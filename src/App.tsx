import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import GameScoresView from './components/GameScoresView';
import AppHeader from './components/AppHeader';
import GameSetup from './components/GameSetup';
import LocationTimerPanel, {
  getLocationGameResultsSnapshot,
  getLocationTimerStorageKey,
} from './components/LocationTimerPanel';
import { GameResult, TimerConfig, ViewType } from './types';
import { useWakeLock } from './hooks/useWakeLock';
import {
  formatExpectedStartTime,
  getExpectedStartTimestamps,
  LocationStartTimes,
} from './utils/expectedStartTimes';
import { useSyncedConfig } from './hooks/useSyncedConfig';
import { useSyncedLocationStartTimes } from './hooks/useSyncedLocationStartTimes';
import { useTournamentAutoStart } from './hooks/useTournamentAutoStart';
import { useGlobalTimerAggregateState } from './hooks/useGlobalTimerAggregateState';
import { useAppTimerController } from './hooks/useAppTimerController';
import { DEFAULT_CONFIG } from './app/defaultConfig';

function App() {
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isDisplayOnly = urlParams.get('view') === 'display';
  const initialLayoutParam = urlParams.get('layout');
  const initialLocationParam = urlParams.get('location');
  const [view, setView] = useState<ViewType>('timer');
  const [config, setConfig] = useSyncedConfig(isDisplayOnly);
  const [timerLayout, setTimerLayout] = useState<'single' | 'split'>(
    initialLayoutParam === 'split' ? 'split' : 'single'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocationParam || '');
  const [locationStartTimes, setLocationStartTimes] = useSyncedLocationStartTimes(isDisplayOnly);

  useWakeLock(config.keepScreenAwake);

  const locations = config.locations.length > 0 ? config.locations : ['Location 1'];
  const defaultLocation = locations[0];

  const getGameLocation = (gameLocation?: string): string => {
    if (gameLocation && locations.includes(gameLocation)) {
      return gameLocation;
    }
    return defaultLocation;
  };

  useEffect(() => {
    if (!selectedLocation || !locations.includes(selectedLocation)) {
      setSelectedLocation(defaultLocation);
    }
    if (locations.length <= 1 && timerLayout === 'split') {
      setTimerLayout('single');
    }
  }, [locations, selectedLocation, defaultLocation, timerLayout]);

  const handleConfigSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleConfigCancel = (): void => {
    setView('timer');
  };

  const handleGameSetupSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleGameSetupCancel = (): void => {
    setView('timer');
  };

  const handleClearAllData = (): void => {
    const confirmed = window.confirm(
      'Clear all saved game and configuration data. This cannot be undone.\n' +
        'It is recommended that you export your configuration and game data before proceeding. Are you sure you want to continue?'
    );
    if (!confirmed) {
      return;
    }

    localStorage.clear();
    setConfig(DEFAULT_CONFIG);
    setLocationStartTimes({});
    setView('timer');
  };

  const { hasStartedGames, allStartedGamesPaused } = useGlobalTimerAggregateState(
    locations,
    getLocationTimerStorageKey
  );
  const {
    startAllSignal,
    pauseAllSignal,
    resumeAllSignal,
    resetAllSignal,
    globalControlLabel,
    handleOpenSecondScreen,
    handleLocationManualStart,
    handleAutoStartAll,
    handleResetAll,
    handleGlobalControl,
  } = useAppTimerController({
    tournamentStartAt: config.tournamentStartAt,
    locations,
    selectedLocation,
    setLocationStartTimes,
    hasStartedGames,
    allStartedGamesPaused,
  });

  useTournamentAutoStart({
    tournamentStartAt: config.tournamentStartAt,
    isDisplayOnly,
    onStartAll: handleAutoStartAll,
  });

  const gameResults = getLocationGameResultsSnapshot(config.games, locations);
  const expectedStartTimes = getExpectedStartTimestamps(
    config,
    config.games,
    locations,
    locationStartTimes
  );

  const headerStartTimeText = useMemo(() => {
    if (isDisplayOnly || config.games.length === 0) {
      return '';
    }

    const activeLocation = selectedLocation || defaultLocation;
    const locationGameIndexes = config.games
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => getGameLocation(game.location) === activeLocation)
      .map(({ index }) => index);

    if (locationGameIndexes.length === 0) {
      return '';
    }

    const rawState = localStorage.getItem(getLocationTimerStorageKey(activeLocation));
    let localGameIndex = 0;
    let gameResultsForLocation: GameResult[] = [];

    if (rawState) {
      try {
        const parsed = JSON.parse(rawState) as {
          currentGameIndex?: number;
          gameResults?: GameResult[];
        };
        if (typeof parsed.currentGameIndex === 'number') {
          localGameIndex = parsed.currentGameIndex;
        }
        if (Array.isArray(parsed.gameResults)) {
          gameResultsForLocation = parsed.gameResults;
        }
      } catch {}
    }

    const clampedLocalGameIndex = Math.min(
      Math.max(localGameIndex, 0),
      Math.max(locationGameIndexes.length - 1, 0)
    );
    const globalGameIndex = locationGameIndexes[clampedLocalGameIndex];
    const startTime = gameResultsForLocation[clampedLocalGameIndex]?.startTime ?? null;

    if (startTime) {
      return `Started: ${startTime}`;
    }

    const expectedStartTime = expectedStartTimes[globalGameIndex] ?? null;
    if (!expectedStartTime) {
      return '';
    }

    return `Start: ${formatExpectedStartTime(expectedStartTime)}`;
  }, [
    isDisplayOnly,
    config.games,
    selectedLocation,
    defaultLocation,
    expectedStartTimes,
    locations,
    startAllSignal,
    pauseAllSignal,
    resumeAllSignal,
    resetAllSignal,
  ]);

  const headerStatusText = headerStartTimeText;
  const isSplitView = timerLayout === 'split' && locations.length > 1;

  return (
    <div className="app">
      {!isDisplayOnly && (
        <AppHeader
          view={view}
          competitionName={config.competitionName}
          globalControlLabel={globalControlLabel}
          headerStatusText={headerStatusText}
          onOpenScores={() => setView('scores')}
          onOpenGameSetup={() => setView('gameSetup')}
          onOpenConfig={() => setView('config')}
          onViewTimer={() => setView('timer')}
          onGlobalControl={handleGlobalControl}
          canToggleLayout={locations.length > 1}
          isSplitLayout={isSplitView}
          onSetSingleLayout={() => setTimerLayout('single')}
          onSetSplitLayout={() => setTimerLayout('split')}
          onOpenSecondScreen={handleOpenSecondScreen}
          onResetAll={handleResetAll}
          onClearAllData={handleClearAllData}
        />
      )}

      <main className="app-main">
        {view === 'timer' || isDisplayOnly ? (
          <>
            <div className={`location-timer-grid ${isSplitView ? 'split' : 'single'}`}>
              {locations.map(location => {
                const locationGames = config.games.filter(
                  game => getGameLocation(game.location) === location
                );

                return (
                  <LocationTimerPanel
                    key={location}
                    location={location}
                    config={config}
                    games={locationGames}
                    readOnlyMirror={isDisplayOnly}
                    displayOnly={isDisplayOnly}
                    hidden={!isSplitView && selectedLocation !== location}
                    startAllSignal={startAllSignal}
                    resetAllSignal={resetAllSignal}
                    pauseAllSignal={pauseAllSignal}
                    resumeAllSignal={resumeAllSignal}
                    locationStartTime={locationStartTimes[location]}
                    onManualStart={handleLocationManualStart}
                    locations={locations}
                    selectedLocation={selectedLocation}
                    showLocationSelector={!isSplitView && locations.length > 1}
                    onSelectLocation={setSelectedLocation}
                  />
                );
              })}
            </div>
          </>
        ) : view === 'gameSetup' ? (
          <GameSetup
            config={config}
            gameResults={gameResults}
            expectedStartTimes={expectedStartTimes}
            onSave={handleGameSetupSave}
            onCancel={handleGameSetupCancel}
          />
        ) : view === 'scores' ? (
          <GameScoresView
            games={config.games}
            teams={config.teams}
            results={gameResults}
            expectedStartTimes={expectedStartTimes}
            leftTeamLabel={config.leftTeamLabel}
            rightTeamLabel={config.rightTeamLabel}
            competitionName={config.competitionName || ''}
          />
        ) : (
          <Configuration config={config} onSave={handleConfigSave} onCancel={handleConfigCancel} />
        )}
      </main>
    </div>
  );
}

export default App;
