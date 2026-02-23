import { Game, Team, TimerConfig } from '../../types';
import { normalizeTeams } from '../../utils/teams';
import { SpecialOutcome } from './types';

export const buildSpecialPlaceholder = (outcome: SpecialOutcome, gameNumber: number): string =>
  `${outcome} of Game ${gameNumber}`;

export const moveItemInArray = <T>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const nextItems = [...items];
  [nextItems[fromIndex], nextItems[toIndex]] = [nextItems[toIndex], nextItems[fromIndex]];
  return nextItems;
};

export const buildExportConfig = (
  editableConfig: TimerConfig,
  divisions: string[],
  teams: Team[],
  games: Game[]
): TimerConfig => ({
  ...editableConfig,
  divisions,
  teams,
  games,
});

export const parseImportedConfig = (rawConfig: Partial<TimerConfig>): TimerConfig => ({
  countdownToStart: rawConfig.countdownToStart || 20,
  firstHalfDuration: rawConfig.firstHalfDuration || 600,
  halfTimeDuration: rawConfig.halfTimeDuration || 120,
  secondHalfDuration: rawConfig.secondHalfDuration || 600,
  betweenGamesDuration: rawConfig.betweenGamesDuration || 180,
  keepScreenAwake: rawConfig.keepScreenAwake ?? true,
  divisions: rawConfig.divisions || [],
  teams: normalizeTeams(rawConfig.teams),
  leftTeamLabel: rawConfig.leftTeamLabel || 'White',
  rightTeamLabel: rawConfig.rightTeamLabel || 'Black',
  competitionName: rawConfig.competitionName || '',
  games: rawConfig.games || [],
});
