import { TimerConfig } from '../types';
import { normalizeTeams } from '../utils/teams';

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

  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    keepScreenAwake: parsed.keepScreenAwake ?? DEFAULT_CONFIG.keepScreenAwake,
    locations: parsed.locations || [],
    divisions: parsed.divisions || [],
    teams: normalizeTeams(parsed.teams),
    games: parsed.games || [],
    tournamentStartAt: parsed.tournamentStartAt || '',
  };
};
