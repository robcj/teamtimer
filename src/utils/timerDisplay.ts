import { TimerConfig } from '../types';
import { PHASES, Phase } from './phases';

export const formatTimerDuration = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getNextGameStartTime = ({
  isRunning,
  isPaused,
  currentGameIndex,
  totalGames,
  timeRemaining,
  phase,
  config,
}: {
  isRunning: boolean;
  isPaused: boolean;
  currentGameIndex: number;
  totalGames: number;
  timeRemaining: number;
  phase: Phase;
  config: TimerConfig;
}): string => {
  if (!isRunning || isPaused || currentGameIndex >= totalGames - 1) {
    return '';
  }

  let secondsUntilGameStart = timeRemaining;

  if (phase === PHASES.COUNTDOWN) {
    secondsUntilGameStart +=
      config.firstHalfDuration +
      config.halfTimeDuration +
      config.secondHalfDuration +
      config.betweenGamesDuration;
  } else if (phase === PHASES.FIRST_HALF) {
    secondsUntilGameStart +=
      config.halfTimeDuration + config.secondHalfDuration + config.betweenGamesDuration;
  } else if (phase === PHASES.HALF_TIME) {
    secondsUntilGameStart += config.secondHalfDuration + config.betweenGamesDuration;
  } else if (phase === PHASES.SECOND_HALF) {
    secondsUntilGameStart += config.betweenGamesDuration;
  } else if (phase === PHASES.BETWEEN_GAMES) {
    secondsUntilGameStart = timeRemaining;
  } else {
    return '';
  }

  const now = new Date();
  const futureTime = new Date(now.getTime() + secondsUntilGameStart * 1000);
  const hours = futureTime.getHours().toString().padStart(2, '0');
  const minutes = futureTime.getMinutes().toString().padStart(2, '0');
  const seconds = futureTime.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
