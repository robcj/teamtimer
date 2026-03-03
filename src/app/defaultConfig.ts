import { TimerConfig } from '../types';
import {
  createEntityId,
  normalizeDivisions,
  normalizeLocations,
  normalizeTeams,
} from '../utils/teams';

export const DEFAULT_CONFIG: TimerConfig = {
  countdownToStart: 20,
  firstHalfDuration: 600,
  halfTimeDuration: 120,
  secondHalfDuration: 600,
  betweenGamesDuration: 180,
  keepScreenAwake: true,
  locations: [],
  divisions: [],
  teams: [],
  games: [],
  leftTeamLabel: 'White',
  rightTeamLabel: 'Black',
  tournamentStartAt: '',
  competitionName: 'Tournament',
};

export const hydrateConfig = (parsed?: Partial<TimerConfig>): TimerConfig => {
  if (!parsed) {
    return DEFAULT_CONFIG;
  }

  const baseDivisions = normalizeDivisions(parsed.divisions || []);
  const divisions =
    baseDivisions.length === 0 && Array.isArray(parsed.teams) && parsed.teams.length > 0
      ? [{ id: createEntityId('div', 'Open'), name: 'Open' }]
      : baseDivisions;
  const locations = normalizeLocations(parsed.locations || []);
  const teams = normalizeTeams(parsed.teams, divisions);

  const teamNameToId = new Map(teams.map(team => [team.name, team.id] as const));
  const locationNameToId = new Map(
    locations.map(location => [location.name, location.id] as const)
  );

  const games = (parsed.games || []).map(game => {
    const mappedTeam1 = teamNameToId.get(game.team1) || game.team1;
    const mappedTeam2 = teamNameToId.get(game.team2) || game.team2;
    const mappedLocationId = game.locationId || (game as { location?: string }).location;
    return {
      ...game,
      team1: mappedTeam1,
      team2: mappedTeam2,
      locationId: mappedLocationId
        ? locationNameToId.get(mappedLocationId) || mappedLocationId
        : undefined,
    };
  });

  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    keepScreenAwake: parsed.keepScreenAwake ?? DEFAULT_CONFIG.keepScreenAwake,
    locations,
    divisions,
    teams,
    games,
    tournamentStartAt: parsed.tournamentStartAt || '',
  };
};
