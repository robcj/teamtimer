import React from 'react';
import { secondsToMinutesAndSeconds, minutesAndSecondsToSeconds } from '../../utils/time';

interface TimerDurationsSectionProps {
  countdownToStart: number;
  gameHalfDuration: number;
  halfTimeDuration: number;
  betweenGamesDuration: number;
  onCountdownToStartChange: (value: number) => void;
  onGameHalfDurationChange: (value: number) => void;
  onHalfTimeDurationChange: (value: number) => void;
  onBetweenGamesDurationChange: (value: number) => void;
}

function TimerDurationsSection({
  countdownToStart,
  gameHalfDuration,
  halfTimeDuration,
  betweenGamesDuration,
  onCountdownToStartChange,
  onGameHalfDurationChange,
  onHalfTimeDurationChange,
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
        Game-Half Duration:
        <div className="time-input-group">
          <input
            type="number"
            value={secondsToMinutesAndSeconds(gameHalfDuration).minutes}
            onChange={e =>
              onGameHalfDurationChange(
                minutesAndSecondsToSeconds(
                  Number(e.target.value),
                  secondsToMinutesAndSeconds(gameHalfDuration).seconds
                )
              )
            }
            min="0"
            placeholder="mins"
          />
          <span>:</span>
          <input
            type="number"
            value={secondsToMinutesAndSeconds(gameHalfDuration).seconds}
            onChange={e =>
              onGameHalfDurationChange(
                minutesAndSecondsToSeconds(
                  secondsToMinutesAndSeconds(gameHalfDuration).minutes,
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
        Half-Time Duration:
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
