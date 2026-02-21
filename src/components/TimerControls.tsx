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
  return (
    <div className="controls">
      <div className="controls-left">
        <button
          onClick={onStart}
          disabled={isRunning && !isPaused}
          className="control-btn start-btn"
        >
          {isPaused ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning || isPaused}
          className="control-btn pause-btn"
        >
          Pause
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
    </div>
  );
}

export default TimerControls;
