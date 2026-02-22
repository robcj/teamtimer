import { Team } from '../types';

type LegacyTeam = string | Team;

export const normalizeTeams = (teams: unknown): Team[] => {
  if (!Array.isArray(teams)) {
    return [];
  }

  return (teams as LegacyTeam[])
    .map(team => {
      if (typeof team === 'string') {
        const name = team.trim();
        return name ? { name, division: 'Open' } : null;
      }

      const name = team.name?.trim();
      const division = team.division?.trim() || 'Open';
      if (!name) {
        return null;
      }
      return { name, division };
    })
    .filter((team): team is Team => team !== null);
};

export const sortTeamsByDivisionThenName = (teams: Team[]): Team[] =>
  [...teams].sort((left, right) => {
    const divisionCompare = left.division.localeCompare(right.division, undefined, {
      sensitivity: 'base',
    });
    if (divisionCompare !== 0) {
      return divisionCompare;
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
  });

export const getTeamDivision = (teams: Team[], teamName: string): string | null => {
  const match = teams.find(team => team.name === teamName);
  return match?.division ?? null;
};

export const formatTeamWithDivision = (teams: Team[], teamName: string): string => {
  const division = getTeamDivision(teams, teamName);
  return division ? `${teamName} (${division})` : teamName;
};
