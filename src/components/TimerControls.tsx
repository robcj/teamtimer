import React from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkipPhase: () => void;
  canSkip: boolean;
}

function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onSkipPhase,
  canSkip,
}: TimerControlsProps) {
  const closeCompactMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
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

      <div className="controls-right">
        <button onClick={onReset} className="control-btn reset-btn">
          Reset
        </button>
        <button onClick={onSkipPhase} disabled={!canSkip} className="control-btn skip-btn">
          Skip Phase
        </button>
      </div>

      <details className="compact-actions-menu" role="group">
        <summary className="compact-actions-trigger">Actions ▾</summary>
        <div className="compact-actions-list">
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
