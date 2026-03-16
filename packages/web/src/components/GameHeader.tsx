import React from 'react';
import { Location, Phase, PHASES } from '@team-timer/core';
import GameActionsMenu from './GameActionsMenu';

interface GameHeaderProps {
  currentIndex: number;
  totalGames: number;
  showLocationSelector?: boolean;
  locations?: Location[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  isRunning?: boolean;
  isPaused?: boolean;
  phase?: Phase;
  onStart?: () => void;
  onPause?: () => void;
  onStartExtraTime?: () => void;
  onStartSuddenDeath?: () => void;
  onEndSuddenDeath?: () => void;
  onReset?: () => void;
  onSkipPhase?: () => void;
  canSkip?: boolean;
}

function GameHeader({
  currentIndex,
  totalGames,
  showLocationSelector = false,
  locations = [],
  selectedLocation = '',
  onSelectLocation,
  isRunning = false,
  isPaused = false,
  phase,
  onStart,
  onPause,
  onStartExtraTime,
  onStartSuddenDeath,
  onEndSuddenDeath,
  onReset,
  onSkipPhase,
  canSkip = false,
}: GameHeaderProps) {
  const showControls = Boolean(onStart);
  const hasBetweenGamesButtons = showControls && phase === PHASES.BETWEEN_GAMES;

  return (
    <div className="game-info">
      <div className={`game-info-row ${hasBetweenGamesButtons ? 'has-between-games-buttons' : ''}`}>
        <div className="game-info-left">
          {showControls && (
            <>
              <button
                onClick={isRunning && !isPaused ? onPause : onStart}
                className={`control-btn ${isRunning && !isPaused ? 'pause-btn' : 'start-btn'}`}
              >
                {isRunning && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Start'}
              </button>
              {phase === PHASES.BETWEEN_GAMES && (
                <button onClick={onStartExtraTime} className="control-btn start-extra-time-btn">
                  Extra Time
                </button>
              )}
              {phase === PHASES.BETWEEN_GAMES && (
                <button onClick={onStartSuddenDeath} className="control-btn start-sudden-death-btn">
                  Sudden Death
                </button>
              )}
              {phase === PHASES.SUDDEN_DEATH && (
                <button onClick={onEndSuddenDeath} className="control-btn end-sudden-death-btn">
                  End Sudden Death
                </button>
              )}
            </>
          )}
        </div>

        <div className="game-info-middle">
          {showLocationSelector && onSelectLocation && (
            <label className="location-panel-selector game-info-location-selector">
              <select
                value={selectedLocation}
                onChange={event => onSelectLocation(event.target.value)}
              >
                {locations.map(nextLocation => (
                  <option key={`game-header-location-${nextLocation.id}`} value={nextLocation.id}>
                    {nextLocation.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {totalGames > 0 && (
            <h2>
              Game {currentIndex + 1} of {totalGames}
            </h2>
          )}
        </div>

        {showControls && onReset && onSkipPhase && (
          <div className="game-info-right">
            <GameActionsMenu onReset={onReset} onSkipPhase={onSkipPhase} canSkip={canSkip} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameHeader;
