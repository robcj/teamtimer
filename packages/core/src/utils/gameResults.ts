import { Game, GameResult } from '../types';

export const createEmptyResults = (games: Game[]): GameResult[] =>
  games.map(() => ({ startTime: null, score: null }));

export const getLocationTimerStorageKey = (location: string): string =>
  `teamTimerState:${encodeURIComponent(location)}`;

export const getLocationGameResultsSnapshot = (
  allGames: Game[],
  locationIds: string[]
): GameResult[] => {
  const results: GameResult[] = allGames.map(() => ({ startTime: null, score: null }));

  locationIds.forEach(locationId => {
    const gameIndexesForLocation = allGames
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => {
        const gameLocation = game.locationId || locationIds[0];
        return gameLocation === locationId;
      })
      .map(({ index }) => index);

    const rawState = localStorage.getItem(getLocationTimerStorageKey(locationId));
    if (!rawState) {
      return;
    }

    try {
      const parsed = JSON.parse(rawState) as { gameResults?: GameResult[] };
      gameIndexesForLocation.forEach((gameIndex, locationGameIndex) => {
        const nextResult = parsed.gameResults?.[locationGameIndex];
        if (nextResult) {
          results[gameIndex] = nextResult;
        }
      });
    } catch {}
  });

  return results;
};
