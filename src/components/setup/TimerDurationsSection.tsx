import React from 'react';
import { secondsToMinutesAndSeconds, minutesAndSecondsToSeconds } from '../../utils/time';

interface TimerDurationsSectionProps {
  countdownToStart: number;
  firstHalfDuration: number;
  halfTimeDuration: number;
  secondHalfDuration: number;
  betweenGamesDuration: number;
  onCountdownToStartChange: (value: number) => void;
  onFirstHalfDurationChange: (value: number) => void;
  onHalfTimeDurationChange: (value: number) => void;
  onSecondHalfDurationChange: (value: number) => void;
  onBetweenGamesDurationChange: (value: number) => void;
}

function TimerDurationsSection({
  countdownToStart,
  firstHalfDuration,
  halfTimeDuration,
  secondHalfDuration,
  betweenGamesDuration,
  onCountdownToStartChange,
  onFirstHalfDurationChange,
  onHalfTimeDurationChange,
  onSecondHalfDurationChange,
  onBetweenGamesDurationChange,
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

      <label>
        First Half Duration:
        <div className="time-input-group">
          <input
            type="number"
            value={secondsToMinutesAndSeconds(firstHalfDuration).minutes}
            onChange={e =>
              onFirstHalfDurationChange(
                minutesAndSecondsToSeconds(
                  Number(e.target.value),
                  secondsToMinutesAndSeconds(firstHalfDuration).seconds
                )
              )
            }
            min="0"
            placeholder="mins"
          />
          <span>:</span>
          <input
            type="number"
            value={secondsToMinutesAndSeconds(firstHalfDuration).seconds}
            onChange={e =>
              onFirstHalfDurationChange(
                minutesAndSecondsToSeconds(
                  secondsToMinutesAndSeconds(firstHalfDuration).minutes,
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

      <label>
        Half Time Duration:
        <div className="time-input-group">
          <input
            type="number"
            value={secondsToMinutesAndSeconds(halfTimeDuration).minutes}
            onChange={e =>
              onHalfTimeDurationChange(
                minutesAndSecondsToSeconds(
                  Number(e.target.value),
                  secondsToMinutesAndSeconds(halfTimeDuration).seconds
                )
              )
            }
            min="0"
            placeholder="mins"
          />
          <span>:</span>
          <input
            type="number"
            value={secondsToMinutesAndSeconds(halfTimeDuration).seconds}
            onChange={e =>
              onHalfTimeDurationChange(
                minutesAndSecondsToSeconds(
                  secondsToMinutesAndSeconds(halfTimeDuration).minutes,
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

      <label>
        Second Half Duration:
        <div className="time-input-group">
          <input
            type="number"
            value={secondsToMinutesAndSeconds(secondHalfDuration).minutes}
            onChange={e =>
              onSecondHalfDurationChange(
                minutesAndSecondsToSeconds(
                  Number(e.target.value),
                  secondsToMinutesAndSeconds(secondHalfDuration).seconds
                )
              )
            }
            min="0"
            placeholder="mins"
          />
          <span>:</span>
          <input
            type="number"
            value={secondsToMinutesAndSeconds(secondHalfDuration).seconds}
            onChange={e =>
              onSecondHalfDurationChange(
                minutesAndSecondsToSeconds(
                  secondsToMinutesAndSeconds(secondHalfDuration).minutes,
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

      <label>
        Between Games Duration:
        <div className="time-input-group">
          <input
            type="number"
            value={secondsToMinutesAndSeconds(betweenGamesDuration).minutes}
            onChange={e =>
              onBetweenGamesDurationChange(
                minutesAndSecondsToSeconds(
                  Number(e.target.value),
                  secondsToMinutesAndSeconds(betweenGamesDuration).seconds
                )
              )
            }
            min="0"
            placeholder="mins"
          />
          <span>:</span>
          <input
            type="number"
            value={secondsToMinutesAndSeconds(betweenGamesDuration).seconds}
            onChange={e =>
              onBetweenGamesDurationChange(
                minutesAndSecondsToSeconds(
                  secondsToMinutesAndSeconds(betweenGamesDuration).minutes,
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
    </div>
  );
}

export default TimerDurationsSection;
