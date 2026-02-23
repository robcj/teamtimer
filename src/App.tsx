import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import GameScoresView from './components/GameScoresView';
import AppHeader from './components/AppHeader';
import Draw from './components/Draw';
import LocationTimerPanel, {
  getLocationGameResultsSnapshot,
  getLocationTimerStorageKey,
} from './components/LocationTimerPanel';
import { TimerConfig, ViewType } from './types';
import { useWakeLock } from './hooks/useWakeLock';
import { getExpectedStartTimestamps, LocationStartTimes } from './utils/expectedStartTimes';
import { useSyncedConfig } from './hooks/useSyncedConfig';
import { useSyncedLocationStartTimes } from './hooks/useSyncedLocationStartTimes';
import { useTournamentAutoStart } from './hooks/useTournamentAutoStart';
import { useGlobalTimerAggregateState } from './hooks/useGlobalTimerAggregateState';
import { useAppTimerController } from './hooks/useAppTimerController';

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

  const handleDrawSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleDrawCancel = (): void => {
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
  const isSplitView = timerLayout === 'split' && locations.length > 1;

  return (
    <div className="app">
      {!isDisplayOnly && (
        <AppHeader
          view={view}
          competitionName={config.competitionName}
          onOpenScores={() => setView('scores')}
          onOpenDraw={() => setView('draw')}
          onOpenConfig={() => setView('config')}
          onViewTimer={() => setView('timer')}
          canToggleLayout={locations.length > 1}
          isSplitLayout={isSplitView}
          onSetSingleLayout={() => setTimerLayout('single')}
          onSetSplitLayout={() => setTimerLayout('split')}
          onOpenSecondScreen={handleOpenSecondScreen}
          onResetAll={handleResetAll}
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
                    showGlobalControl={
                      !isDisplayOnly && (isSplitView ? location === locations[0] : true)
                    }
                    globalControlLabel={globalControlLabel}
                    onGlobalControl={handleGlobalControl}
                  />
                );
              })}
            </div>
          </>
        ) : view === 'draw' ? (
          <Draw
            config={config}
            gameResults={gameResults}
            expectedStartTimes={expectedStartTimes}
            onSave={handleDrawSave}
            onCancel={handleDrawCancel}
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
