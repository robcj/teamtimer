import React from 'react';

interface TimerHeaderProps {
  phaseLabel: string;
  timeText: string;
  isWarning: boolean;
  isPaused?: boolean;
  pausedDurationText?: string;
}

function TimerHeader({
  phaseLabel,
  timeText,
  isWarning,
  isPaused = false,
  pausedDurationText = '00:00',
}: TimerHeaderProps) {
  return (
    <div className="timer-container">
      <div className="phase-label">{phaseLabel}</div>
      <div className="timer-row">
        <div className={`timer ${isWarning ? 'warning' : ''} ${isPaused ? 'paused' : ''}`}>
          {timeText}
        </div>
        {isPaused && (
          <div className="paused-timer" aria-live="polite">
            <span className="paused-timer-label">Paused</span>
            <span className="paused-timer-value">{pausedDurationText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimerHeader;
