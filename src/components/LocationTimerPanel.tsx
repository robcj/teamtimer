import React from 'react';
import { Game, Location, TimerConfig } from '../types';
import { useGameTimer } from '../hooks/useGameTimer';
import TimerDisplay from './TimerDisplay';
import { getExpectedStartTimestamps } from '../utils/expectedStartTimes';
import { getLocationTimerStorageKey } from '../utils/gameResults';

export const QUICK_MODE_DIVISION_ID = 'quick-mode-division';
export const QUICK_MODE_TEAM_A_ID = 'quick-mode-team-a';
export const QUICK_MODE_TEAM_B_ID = 'quick-mode-team-b';

interface LocationTimerPanelProps {
  locationId: string;
  locationName: string;
  locations: Location[];
  selectedLocation: string;
  showLocationSelector: boolean;
  config: TimerConfig;
  games: Game[];
  readOnlyMirror: boolean;
  displayOnly: boolean;
  hidden: boolean;
  startAllSignal: number;
  pauseAllSignal: number;
  resumeAllSignal: number;
  resetAllSignal: number;
  onManualStart: (locationId: string) => void;
  onSelectLocation: (location: string) => void;
}

function LocationTimerPanel({
  locationId,
  locations,
  selectedLocation,
  showLocationSelector,
  config,
  games,
  readOnlyMirror,
  displayOnly,
  hidden,
  startAllSignal,
  pauseAllSignal,
  resumeAllSignal,
  resetAllSignal,
  onManualStart,
  onSelectLocation,
}: LocationTimerPanelProps) {
  const useQuickMode = games.length === 0;
  const effectiveGames: Game[] = useQuickMode
    ? [{ team1: QUICK_MODE_TEAM_A_ID, team2: QUICK_MODE_TEAM_B_ID, locationId }]
    : games;

  const locationConfig: TimerConfig = {
    ...config,
    divisions: useQuickMode ? [{ id: QUICK_MODE_DIVISION_ID, name: 'Open' }] : config.divisions,
    teams: useQuickMode
      ? [
          { id: QUICK_MODE_TEAM_A_ID, name: 'Team A', divisionId: QUICK_MODE_DIVISION_ID },
          { id: QUICK_MODE_TEAM_B_ID, name: 'Team B', divisionId: QUICK_MODE_DIVISION_ID },
        ]
      : config.teams,
    games: effectiveGames,
  };

  const {
    currentGameIndex,
    gameResults,
    phase,
    setPhase,
    timeRemaining,
    setTimeRemaining,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    scores,
    setScores,
    handleResetTimer,
  } = useGameTimer(locationConfig, {
    selectedLocation,
    readOnlyMirror,
    storageKey: getLocationTimerStorageKey(locationId),
    externalStartSignal: startAllSignal,
    externalPauseSignal: pauseAllSignal,
    externalResumeSignal: resumeAllSignal,
    externalResetSignal: resetAllSignal,
    loopGames: useQuickMode,
  });

  return (
    <section className={`location-timer-panel ${hidden ? 'location-hidden' : ''}`}>
      <TimerDisplay
        config={locationConfig}
        displayOnly={displayOnly}
        showLocationSelector={showLocationSelector}
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        onManualStart={() => onManualStart(locationId)}
        currentGameIndex={currentGameIndex}
        gameResults={gameResults}
        phase={phase}
        setPhase={setPhase}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        scores={scores}
        setScores={setScores}
        onResetTimer={handleResetTimer}
      />
    </section>
  );
}

export default LocationTimerPanel;
