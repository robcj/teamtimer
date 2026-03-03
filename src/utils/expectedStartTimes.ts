import { Game, Location, TimerConfig } from '../types';
import { formatClockTime } from './time';

export type LocationStartTimes = Record<string, number>;

export const getExpectedStartTimestamps = (
  config: TimerConfig,
  games: Game[],
  locations: Location[],
  locationStartTimes: LocationStartTimes
): Array<number | null> => {
  const expectedStartTimes: Array<number | null> = games.map(() => null);
  const validTournamentStart = config.tournamentStartAt
    ? new Date(config.tournamentStartAt).getTime()
    : Number.NaN;
  const hasTournamentStart = Number.isFinite(validTournamentStart);
  const gameCycleMs =
    (config.firstHalfDuration +
      config.halfTimeDuration +
      config.secondHalfDuration +
      config.betweenGamesDuration) *
    1000;

  locations.forEach(location => {
    const gameIndexesForLocation = games
      .map((game, index) => ({ game, index }))
      .filter(({ game }) => {
        const gameLocationId = game.locationId || locations[0]?.id;
        return gameLocationId === location.id;
      })
      .map(({ index }) => index);

    if (gameIndexesForLocation.length === 0) {
      return;
    }

    const locationBaseStart = hasTournamentStart
      ? validTournamentStart
      : locationStartTimes[location.id]
        ? locationStartTimes[location.id] + config.countdownToStart * 1000
        : null;

    if (!locationBaseStart) {
      return;
    }

    gameIndexesForLocation.forEach((gameIndex, indexWithinLocation) => {
      expectedStartTimes[gameIndex] = locationBaseStart + gameCycleMs * indexWithinLocation;
    });
  });

  return expectedStartTimes;
};

export const formatExpectedStartTime = (timestamp: number | null): string => {
  // If timestamp is null or undefined, or in the past, return a placeholder
  if (!timestamp || timestamp < Date.now()) {
    return '—';
  }
  return formatClockTime(new Date(timestamp));
};
