import React from 'react';
import { DurationInput } from './DurationInput';

interface TimerDurationsSectionProps {
  countdownToStart: number;
  gameHalfDuration: number;
  halfTimeDuration: number;
  betweenGamesDuration: number;
  extraTimeHalfDuration: number;
  onCountdownToStartChange: (value: number) => void;
  onGameHalfDurationChange: (value: number) => void;
  onHalfTimeDurationChange: (value: number) => void;
  onBetweenGamesDurationChange: (value: number) => void;
  onExtraTimeHalfDurationChange: (value: number) => void;
}

function TimerDurationsSection({
  countdownToStart,
  gameHalfDuration,
  halfTimeDuration,
  betweenGamesDuration,
  extraTimeHalfDuration,
  onCountdownToStartChange,
  onGameHalfDurationChange,
  onHalfTimeDurationChange,
  onBetweenGamesDurationChange,
  onExtraTimeHalfDurationChange,
}: TimerDurationsSectionProps) {
  return (
    <div className="config-group">
      <label>
        Countdown to Start (seconds):
        <input
          type="number"
          value={countdownToStart}
          onChange={e => onCountdownToStartChange(Number(e.target.value))}
          min="0"
        />
      </label>

      <DurationInput
        label="Game-Half Duration:"
        value={gameHalfDuration}
        onChange={onGameHalfDurationChange}
      />
      <DurationInput
        label="Half-Time Duration:"
        value={halfTimeDuration}
        onChange={onHalfTimeDurationChange}
      />
      <DurationInput
        label="Between Games Duration:"
        value={betweenGamesDuration}
        onChange={onBetweenGamesDurationChange}
      />
      <DurationInput
        label="Extra-Time-Half Duration:"
        value={extraTimeHalfDuration}
        onChange={onExtraTimeHalfDurationChange}
      />
    </div>
  );
}

export default TimerDurationsSection;
