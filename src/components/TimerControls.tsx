import React, { useRef, useState } from 'react';
import { Game, Scores } from '../types';

interface PreviousGameSummary {
  game: Game;
  score: Scores | null;
}

interface NextGameSummary {
  game: Game;
}

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  previousGame: PreviousGameSummary | null;
  nextGame: NextGameSummary | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkipPhase: () => void;
  canSkip: boolean;
}

function TimerControls({
  isRunning,
  isPaused,
  previousGame,
  nextGame,
  onStart,
  onPause,
  onReset,
  onSkipPhase,
  canSkip,
}: TimerControlsProps) {
  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const actionsMenuRef = useRef<HTMLDetailsElement | null>(null);
  const actionsListRef = useRef<HTMLDivElement | null>(null);

  const handleActionsToggle = (): void => {
    const menu = actionsMenuRef.current;
    if (!menu || !menu.open) {
      setOpenUpwards(false);
      return;
    }

    const menuRect = menu.getBoundingClientRect();
    const spaceBelow = window.innerHeight - menuRect.bottom;
    const listHeight = actionsListRef.current?.offsetHeight ?? 170;
    setOpenUpwards(spaceBelow < listHeight + 12);
  };

  const closeCompactMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
      setOpenUpwards(false);
    }
  };

  return (
    <div className="controls">
      <div className="controls-left">
        <button
          onClick={isRunning && !isPaused ? onPause : onStart}
          className={`control-btn ${isRunning && !isPaused ? 'pause-btn' : 'start-btn'}`}
        >
          {isRunning && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Start'}
        </button>
      </div>

      <div className="controls-middle">
        <div className="last-game-summary" aria-live="polite">
          <span className="last-game-label">Last game:</span>{' '}
          <span className="last-game-result">
            {previousGame?.game.team1} <b>{previousGame?.score?.team1 ?? '—'}</b> -{' '}
            <b>{previousGame?.score?.team2 ?? '—'}</b> {previousGame?.game.team2}
          </span>
        </div>
        <div className="next-game-summary" aria-live="polite">
          <span className="next-game-label">Next game:</span>{' '}
          <span className="next-game-result">
            {nextGame ? `${nextGame.game.team1} vs ${nextGame.game.team2}` : '—'}
          </span>
        </div>
      </div>

      <details
        ref={actionsMenuRef}
        className={`compact-actions-menu ${openUpwards ? 'open-upwards' : ''}`}
        role="group"
        onToggle={handleActionsToggle}
      >
        <summary className="compact-actions-trigger">Actions ▾</summary>
        <div ref={actionsListRef} className="compact-actions-list">
          <button
            className="compact-action-item"
            onClick={event => {
              closeCompactMenu(event);
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className="compact-action-item"
            disabled={!canSkip}
            onClick={event => {
              closeCompactMenu(event);
              onSkipPhase();
            }}
          >
            Skip Phase
          </button>
        </div>
      </details>
    </div>
  );
}

export default TimerControls;
