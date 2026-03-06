import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import Results from './components/Results';
import AppHeader from './components/AppHeader';
import Setup from './components/setup/Setup';
import UserGuide from './components/UserGuide';
import LocationTimerPanel, {
  QUICK_MODE_DIVISION_ID,
  QUICK_MODE_TEAM_A_ID,
  QUICK_MODE_TEAM_B_ID,
} from './components/LocationTimerPanel';
import { Division, Game, GameResult, Team, TimerConfig, ViewType } from './types';
import { useWakeLock } from './hooks/useWakeLock';
import {
  formatExpectedStartDateTime,
  formatExpectedStartTime,
  getExpectedStartTimestamps,
} from './utils/expectedStartTimes';
import { useSyncedConfig } from './hooks/useSyncedConfig';
import { useSyncedLocationStartTimes } from './hooks/useSyncedLocationStartTimes';
import { useTournamentAutoStart } from './hooks/useTournamentAutoStart';
import { useGlobalTimerAggregateState } from './hooks/useGlobalTimerAggregateState';
import { useAppTimerController } from './hooks/useAppTimerController';
import { DEFAULT_CONFIG } from './app/defaultConfig';
import { getLocationGameResultsSnapshot, getLocationTimerStorageKey } from './utils/gameResults';

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

  const locations =
    config.locations.length > 0 ? config.locations : [{ id: ' - ', name: 'Location 1' }];
  const defaultLocationId = locations[0].id;

  const getGameLocationId = (gameLocationId?: string): string => {
    if (gameLocationId && locations.some(location => location.id === gameLocationId)) {
      return gameLocationId;
    }
    return defaultLocationId;
  };

  useEffect(() => {
    if (!selectedLocation || !locations.some(location => location.id === selectedLocation)) {
      setSelectedLocation(defaultLocationId);
    }
    if (locations.length <= 1 && timerLayout === 'split') {
      setTimerLayout('single');
    }
  }, [locations, selectedLocation, defaultLocationId, timerLayout]);

  const handleSetupSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleSetupCancel = (): void => {
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
    locations.map(location => location.id),
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
    locations: locations.map(location => location.id),
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

  const gameResults = getLocationGameResultsSnapshot(
    config.games,
    locations.map(location => location.id)
  );

  const quickModeResultsData = useMemo(() => {
    if (config.games.length > 0) {
      return null;
    }

    const games: Game[] = [];
    const results: GameResult[] = [];

    locations.forEach(location => {
      const rawState = localStorage.getItem(getLocationTimerStorageKey(location.id));
      if (!rawState) {
        return;
      }

      try {
        const parsed = JSON.parse(rawState) as { gameResults?: GameResult[] };
        const locationResults = Array.isArray(parsed.gameResults)
          ? parsed.gameResults.filter(result => Boolean(result?.score))
          : [];

        locationResults.forEach(result => {
          games.push({
            team1: QUICK_MODE_TEAM_A_ID,
            team2: QUICK_MODE_TEAM_B_ID,
            locationId: location.id,
          });
          results.push(result);
        });
      } catch {}
    });

    const divisions: Division[] = [{ id: QUICK_MODE_DIVISION_ID, name: 'Open' }];
    const teams: Team[] = [
      { id: QUICK_MODE_TEAM_A_ID, name: 'Team A', divisionId: QUICK_MODE_DIVISION_ID },
      { id: QUICK_MODE_TEAM_B_ID, name: 'Team B', divisionId: QUICK_MODE_DIVISION_ID },
    ];

    return {
      games,
      results,
      divisions,
      teams,
      expectedStartTimes: games.map(() => null),
    };
  }, [
    config.games.length,
    locations,
    view,
    startAllSignal,
    pauseAllSignal,
    resumeAllSignal,
    resetAllSignal,
  ]);

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

    const activeLocation = selectedLocation || defaultLocationId;
    const locationGameIndexes = config.games
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => getGameLocationId(game.locationId) === activeLocation)
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

    return `Start: ${formatExpectedStartDateTime(expectedStartTime)}`;
  }, [
    isDisplayOnly,
    config.games,
    selectedLocation,
    defaultLocationId,
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
          onOpenSetup={() => setView('setup')}
          onOpenGuide={() => setView('guide')}
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
                  game => getGameLocationId(game.locationId) === location.id
                );

                return (
                  <LocationTimerPanel
                    key={location.id}
                    locationId={location.id}
                    locationName={location.name}
                    config={config}
                    games={locationGames}
                    readOnlyMirror={isDisplayOnly}
                    displayOnly={isDisplayOnly}
                    hidden={!isSplitView && selectedLocation !== location.id}
                    startAllSignal={startAllSignal}
                    resetAllSignal={resetAllSignal}
                    pauseAllSignal={pauseAllSignal}
                    resumeAllSignal={resumeAllSignal}
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
        ) : view === 'setup' ? (
          <Setup
            config={config}
            gameResults={gameResults}
            expectedStartTimes={expectedStartTimes}
            onSave={handleSetupSave}
            onCancel={handleSetupCancel}
          />
        ) : view === 'scores' ? (
          <Results
            games={quickModeResultsData?.games ?? config.games}
            locations={config.locations}
            divisions={quickModeResultsData?.divisions ?? config.divisions}
            teams={quickModeResultsData?.teams ?? config.teams}
            results={quickModeResultsData?.results ?? gameResults}
            expectedStartTimes={quickModeResultsData?.expectedStartTimes ?? expectedStartTimes}
            leftTeamLabel={config.leftTeamLabel}
            rightTeamLabel={config.rightTeamLabel}
            competitionName={config.competitionName || ''}
          />
        ) : view === 'guide' ? (
          <UserGuide />
        ) : null}
      </main>
    </div>
  );
}

export default App;
