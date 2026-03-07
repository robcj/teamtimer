import { Phase } from './utils/phases';

export interface Location {
  id: string;
  name: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  divisionId: string;
}

export interface Game {
  team1: Team['id'];
  team2: Team['id'];
  locationId?: string;
}

export interface TimerConfig {
  countdownToStart: number;
  gameHalfDuration: number;
  halfTimeDuration: number;
  betweenGamesDuration: number;
  extraTimeHalfDuration: number;
  keepScreenAwake: boolean;
  locations: Location[];
  divisions: Division[];
  teams: Team[];
  games: Game[];
  leftTeamLabel: string;
  rightTeamLabel: string;
  tournamentStartAt?: string;
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
  phase: Phase;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  scores: Scores;
  currentGameIndex?: number;
  gameResults?: GameResult[];
}

export type ViewType = 'timer' | 'setup' | 'scores' | 'guide';

export type SpecialOutcome = 'Winner' | 'Loser';

export const EMPTY_SLOT_OPTION_VALUE = '__EMPTY_SLOT__';

export const EMPTY_SLOT_LABEL = 'Empty slot';
