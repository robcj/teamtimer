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
  keepScreenAwake: boolean;
  onKeepScreenAwakeChange: (value: boolean) => void;
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
  keepScreenAwake,
  onKeepScreenAwakeChange,
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
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={keepScreenAwake}
          onChange={e => onKeepScreenAwakeChange(e.target.checked)}
        />
        <span>Keep screen awake while using the timer (where supported)</span>
      </label>
    </div>
  );
}

export default TimerDurationsSection;
