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

export type ViewType = 'timer' | 'config';
