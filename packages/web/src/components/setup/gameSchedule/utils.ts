import {
  DEFAULT_CONFIG,
  Division,
  Game,
  Location,
  Team,
  TimerConfig,
  createEntityId,
  normalizeDivisions,
  normalizeLocations,
  normalizeTeams,
  SpecialOutcome,
} from '@team-timer/core';

export const buildSpecialPlaceholder = (outcome: SpecialOutcome, gameNumber: number): string =>
  `${outcome} of Game ${gameNumber}`;

export const moveItemInArray = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const nextItems = [...items];
  [nextItems[fromIndex], nextItems[toIndex]] = [nextItems[toIndex], nextItems[fromIndex]];
  return nextItems;
};

export const buildExportConfig = (
  editableConfig: TimerConfig,
  divisions: Division[],
  teams: Team[],
  games: Game[],
  locations: Location[],
  tournamentStartAt: string
): TimerConfig => ({
  ...editableConfig,
  locations,
  divisions,
  teams,
  games,
  tournamentStartAt,
});

export const parseImportedConfig = (rawConfig: Partial<TimerConfig>): TimerConfig => {
  const baseDivisions = normalizeDivisions(rawConfig.divisions || []);
  const divisions =
    baseDivisions.length === 0 && Array.isArray(rawConfig.teams) && rawConfig.teams.length > 0
      ? [{ id: createEntityId('div', 'Open'), name: 'Open' }]
      : baseDivisions;
  const locations = normalizeLocations(rawConfig.locations || []);
  const teams = normalizeTeams(rawConfig.teams, divisions);
  const teamNameToId = new Map(teams.map(team => [team.name, team.id] as const));
  const locationNameToId = new Map(
    locations.map(location => [location.name, location.id] as const)
  );

  const games = (rawConfig.games || []).map(game => {
    const legacyLocation = (game as { location?: string }).location;
    return {
      ...game,
      team1: teamNameToId.get(game.team1) || game.team1,
      team2: teamNameToId.get(game.team2) || game.team2,
      locationId: game.locationId
        ? locationNameToId.get(game.locationId) || game.locationId
        : legacyLocation
          ? locationNameToId.get(legacyLocation) || legacyLocation
          : undefined,
    };
  });

  return {
    ...DEFAULT_CONFIG,
    ...rawConfig,
    locations,
    divisions,
    teams,
    games,
  };
};
