export interface Game {
  team1: string;
  team2: string;
}

export interface Team {
  name: string;
  division: string;
}

export interface TimerConfig {
  countdownToStart: number;
  firstHalfDuration: number;
  halfTimeDuration: number;
  secondHalfDuration: number;
  betweenGamesDuration: number;
  divisions: string[];
  teams: Team[];
  games: Game[];
  leftTeamLabel: string;
  rightTeamLabel: string;
  competitionName?: string;
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

export type ViewType = 'timer' | 'config' | 'draw';
