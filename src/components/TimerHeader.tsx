import React from 'react';

interface TimerHeaderProps {
  phaseLabel: string;
  timeText: string;
  isWarning: boolean;
}

function TimerHeader({ phaseLabel, timeText, isWarning }: TimerHeaderProps) {
  return (
    <div className="timer-container">
      <div className="phase-label">{phaseLabel}</div>
      <div className={`timer ${isWarning ? 'warning' : ''}`}>{timeText}</div>
    </div>
  );
}

export default TimerHeader;
