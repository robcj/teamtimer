export interface Game {
  team1: string;
  team2: string;
}

export interface TimerConfig {
  countdownToStart: number;
  firstHalfDuration: number;
  halfTimeDuration: number;
  secondHalfDuration: number;
  betweenGamesDuration: number;
  games: Game[];
  leftTeamLabel: string;
  rightTeamLabel: string;
}

export interface Scores {
  team1: number;
  team2: number;
}

export interface GameResult {
  startTime: string | null;
  score: Scores | null;
}

export interface TimerState {
  phase: string;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  scores: Scores;
  currentGameIndex?: number;
  gameResults?: GameResult[];
}

export type ViewType = 'timer' | 'config';
