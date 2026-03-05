export const PHASES = {
  COUNTDOWN: 'countdown',
  FIRST_HALF: 'firstHalf',
  HALF_TIME: 'halfTime',
  SECOND_HALF: 'secondHalf',
  EXTRA_TIME_COUNTDOWN: 'extraTimeCountdown',
  EXTRA_TIME_FIRST_HALF: 'extraTimeFirstHalf',
  EXTRA_TIME_HALF_TIME: 'extraTimeHalfTime',
  EXTRA_TIME_SECOND_HALF: 'extraTimeSecondHalf',
  SUDDEN_DEATH_COUNTDOWN: 'suddenDeathCountdown',
  SUDDEN_DEATH: 'suddenDeath',
  BETWEEN_GAMES: 'betweenGames',
  IDLE: 'idle',
} as const;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export const PHASE_LABELS: Record<Phase, string> = {
  countdown: 'Countdown to Start',
  firstHalf: 'First Half',
  halfTime: 'Half Time',
  secondHalf: 'Second Half',
  extraTimeCountdown: 'Extra Time Countdown',
  extraTimeFirstHalf: 'Extra Time First Half',
  extraTimeHalfTime: 'Extra Time Half Time',
  extraTimeSecondHalf: 'Extra Time Second Half',
  suddenDeathCountdown: 'Sudden Death Countdown',
  suddenDeath: 'Sudden Death',
  betweenGames: 'Between Games',
  idle: 'Ready to Start',
};
