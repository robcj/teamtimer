import { DEFAULT_CONFIG, TimerConfig } from '@team-timer/core';

export const TEAM_TIMER_CONFIG_STORAGE_KEY = 'teamTimerConfig';

const matchesDefaultText = (value: string | undefined, defaultValue: string | undefined): boolean =>
  (value || '').trim() === (defaultValue || '').trim();

export const isConfigUnconfigured = (config: TimerConfig): boolean => {
  const hasStructuredSetup =
    config.locations.length > 0 ||
    config.divisions.length > 0 ||
    config.teams.length > 0 ||
    config.games.length > 0;

  const hasCustomTiming =
    config.countdownToStart !== DEFAULT_CONFIG.countdownToStart ||
    config.gameHalfDuration !== DEFAULT_CONFIG.gameHalfDuration ||
    config.halfTimeDuration !== DEFAULT_CONFIG.halfTimeDuration ||
    config.betweenGamesDuration !== DEFAULT_CONFIG.betweenGamesDuration ||
    config.extraTimeHalfDuration !== DEFAULT_CONFIG.extraTimeHalfDuration;

  const hasCustomLabels =
    !matchesDefaultText(config.leftTeamLabel, DEFAULT_CONFIG.leftTeamLabel) ||
    !matchesDefaultText(config.rightTeamLabel, DEFAULT_CONFIG.rightTeamLabel);

  const hasEventMetadata =
    !matchesDefaultText(config.competitionName, DEFAULT_CONFIG.competitionName) ||
    !matchesDefaultText(config.tournamentStartAt, DEFAULT_CONFIG.tournamentStartAt);

  const hasCustomWakeLockPreference = config.keepScreenAwake !== DEFAULT_CONFIG.keepScreenAwake;

  return !(
    hasStructuredSetup ||
    hasCustomTiming ||
    hasCustomLabels ||
    hasEventMetadata ||
    hasCustomWakeLockPreference
  );
};

export const replaceSavedAppState = (
  nextConfig: TimerConfig,
  applyConfig: (config: TimerConfig) => void
): void => {
  localStorage.clear();
  applyConfig(nextConfig);
};
