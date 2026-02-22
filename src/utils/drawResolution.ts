import { Game, GameResult } from '../types';

const SPECIAL_GAME_PATTERN = /^(Winner|Loser) of Game (\d+)$/i;

const resolveParticipant = (
  participant: string,
  games: Game[],
  results: GameResult[],
  visitedGameIndexes: Set<number>
): string => {
  const match = participant.match(SPECIAL_GAME_PATTERN);
  if (!match) {
    return participant;
  }

  const outcome = match[1].toLowerCase();
  const gameNumber = Number(match[2]);
  const referencedIndex = gameNumber - 1;

  if (referencedIndex < 0 || referencedIndex >= games.length) {
    return participant;
  }

  if (visitedGameIndexes.has(referencedIndex)) {
    return participant;
  }

  const referencedGame = games[referencedIndex];
  const referencedResult = results[referencedIndex]?.score;
  if (!referencedResult) {
    return participant;
  }

  if (referencedResult.team1 === referencedResult.team2) {
    return participant;
  }

  const winner =
    referencedResult.team1 > referencedResult.team2 ? referencedGame.team1 : referencedGame.team2;
  const loser =
    referencedResult.team1 > referencedResult.team2 ? referencedGame.team2 : referencedGame.team1;

  const nextParticipant = outcome === 'winner' ? winner : loser;
  return resolveParticipant(
    nextParticipant,
    games,
    results,
    new Set([...visitedGameIndexes, referencedIndex])
  );
};

export const resolveGamesFromResults = (games: Game[], results: GameResult[]): Game[] =>
  games.map((game, index) => ({
    team1: resolveParticipant(game.team1, games, results, new Set([index])),
    team2: resolveParticipant(game.team2, games, results, new Set([index])),
  }));
