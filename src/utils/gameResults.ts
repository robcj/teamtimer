import { Game, GameResult } from '../types';

export const createEmptyResults = (games: Game[]): GameResult[] =>
  games.map(() => ({ startTime: null, score: null }));
