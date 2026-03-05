import React from 'react';
import { secondsToMinutesAndSeconds, minutesAndSecondsToSeconds } from '../../utils/time';

export function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}:
      <div className="time-input-group">
        <input
          type="number"
          value={secondsToMinutesAndSeconds(value).minutes}
          onChange={e =>
            onChange(
              minutesAndSecondsToSeconds(
                Number(e.target.value),
                secondsToMinutesAndSeconds(value).seconds
              )
            )
          }
          min="0"
          placeholder="mins"
        />
        <span>:</span>
        <input
          type="number"
          value={secondsToMinutesAndSeconds(value).seconds}
          onChange={e =>
            onChange(
              minutesAndSecondsToSeconds(
                secondsToMinutesAndSeconds(value).minutes,
                Number(e.target.value)
              )
            )
          }
          min="0"
          max="59"
          placeholder="secs"
        />
      </div>
    </label>
  );
}
export default DurationInput;
