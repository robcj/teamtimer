import React from 'react';
import { Game, GameResult, TimerConfig } from '../types';
import { useGameTimer } from '../hooks/useGameTimer';
import TimerDisplay from './TimerDisplay';
import { getExpectedStartTimestamps } from '../utils/expectedStartTimes';

interface LocationTimerPanelProps {
  location: string;
  locations: string[];
  selectedLocation: string;
  showLocationSelector: boolean;
  showGlobalControl: boolean;
  globalControlLabel: string;
  config: TimerConfig;
  games: Game[];
  readOnlyMirror: boolean;
  displayOnly: boolean;
  hidden: boolean;
  startAllSignal: number;
  pauseAllSignal: number;
  resumeAllSignal: number;
  resetAllSignal: number;
  locationStartTime?: number;
  onManualStart: (location: string) => void;
  onSelectLocation: (location: string) => void;
  onGlobalControl: () => void;
}

export const getLocationTimerStorageKey = (location: string): string =>
  `teamTimerState:${encodeURIComponent(location)}`;

function LocationTimerPanel({
  location,
  locations,
  selectedLocation,
  showLocationSelector,
  showGlobalControl,
  globalControlLabel,
  config,
  games,
  readOnlyMirror,
  displayOnly,
  hidden,
  startAllSignal,
  pauseAllSignal,
  resumeAllSignal,
  resetAllSignal,
  locationStartTime,
  onManualStart,
  onSelectLocation,
  onGlobalControl,
}: LocationTimerPanelProps) {
  const locationConfig: TimerConfig = {
    ...config,
    games,
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
    readOnlyMirror,
    storageKey: getLocationTimerStorageKey(location),
    externalStartSignal: startAllSignal,
    externalPauseSignal: pauseAllSignal,
    externalResumeSignal: resumeAllSignal,
    externalResetSignal: resetAllSignal,
  });

  const expectedStartTimes = getExpectedStartTimestamps(
    locationConfig,
    games,
    [location],
    locationStartTime ? { [location]: locationStartTime } : {}
  );

  return (
    <section className={`location-timer-panel ${hidden ? 'location-hidden' : ''}`}>
      <div className="location-panel-header">
        {showLocationSelector ? (
          <label className="location-panel-selector">
            Location:
            <select
              value={selectedLocation}
              onChange={event => onSelectLocation(event.target.value)}
            >
              {locations.map(nextLocation => (
                <option key={`view-location-${nextLocation}`} value={nextLocation}>
                  {nextLocation}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="location-panel-title">{location}</div>
        )}
        {showGlobalControl && (
          <button className="config-button" onClick={onGlobalControl}>
            {globalControlLabel}
          </button>
        )}
      </div>
      <TimerDisplay
        config={locationConfig}
        displayOnly={displayOnly}
        onManualStart={() => onManualStart(location)}
        expectedStartTimes={expectedStartTimes}
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

export const getLocationGameResultsSnapshot = (
  allGames: Game[],
  locations: string[]
): GameResult[] => {
  const results: GameResult[] = allGames.map(() => ({ startTime: null, score: null }));

  locations.forEach(location => {
    const gameIndexesForLocation = allGames
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => {
        const gameLocation = game.location || locations[0];
        return gameLocation === location;
      })
      .map(({ index }) => index);

    const rawState = localStorage.getItem(getLocationTimerStorageKey(location));
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as { gameResults?: GameResult[] };
      gameIndexesForLocation.forEach((gameIndex, locationGameIndex) => {
        const nextResult = parsed.gameResults?.[locationGameIndex];
        if (nextResult) {
          results[gameIndex] = nextResult;
        }
      });
    } catch {}
  });

  return results;
};

export default LocationTimerPanel;
