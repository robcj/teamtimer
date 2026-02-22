export const PHASES = {
  COUNTDOWN: 'countdown',
  FIRST_HALF: 'firstHalf',
  HALF_TIME: 'halfTime',
  SECOND_HALF: 'secondHalf',
  BETWEEN_GAMES: 'betweenGames',
  IDLE: 'idle',
} as const;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export const PHASE_LABELS: Record<Phase, string> = {
  countdown: 'Countdown to Start',
  firstHalf: 'First Half',
  halfTime: 'Half Time',
  secondHalf: 'Second Half',
  betweenGames: 'Between Games',
  idle: 'Ready to Start',
};
