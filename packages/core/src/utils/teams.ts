import { Division, Location, Team } from '../types';

type LegacyTeam = string | Team | { name?: string; division?: string };
type LegacyDivision = string | Division;
type LegacyLocation = string | Location;

const toIdPart = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

const createId = (prefix: string, value: string): string =>
  `${prefix}-${toIdPart(value)}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizeDivisions = (divisions: unknown): Division[] => {
  if (!Array.isArray(divisions)) {
    return [];
  }

  const byName = new Map<string, Division>();

  (divisions as LegacyDivision[]).forEach(division => {
    if (typeof division === 'string') {
      const name = division.trim();
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      if (!byName.has(key)) {
        byName.set(key, { id: createId('div', name), name });
      }
      return;
    }

    const name = division.name?.trim();
    if (!name) {
      return;
    }
    const key = name.toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, { id: division.id?.trim() || createId('div', name), name });
    }
  });

  return Array.from(byName.values());
};

export const normalizeLocations = (locations: unknown): Location[] => {
  if (!Array.isArray(locations)) {
    return [];
  }

  const byName = new Map<string, Location>();

  (locations as LegacyLocation[]).forEach(location => {
    if (typeof location === 'string') {
      const name = location.trim();
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      if (!byName.has(key)) {
        byName.set(key, { id: createId('loc', name), name });
      }
      return;
    }

    const name = location.name?.trim();
    if (!name) {
      return;
    }
    const key = name.toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, { id: location.id?.trim() || createId('loc', name), name });
    }
  });

  return Array.from(byName.values());
};

export const normalizeTeams = (teams: unknown, divisions: Division[]): Team[] => {
  if (!Array.isArray(teams)) {
    return [];
  }

  const fallbackDivision =
    divisions.find(division => division.name.toLowerCase() === 'open') || divisions[0] || null;
  const divisionNameToId = new Map(
    divisions.map(division => [division.name.toLowerCase(), division.id] as const)
  );

  return (teams as LegacyTeam[])
    .map(team => {
      if (typeof team === 'string') {
        const name = team.trim();
        if (!name || !fallbackDivision) {
          return null;
        }
        return { id: createId('team', name), name, divisionId: fallbackDivision.id };
      }

      const name = team.name?.trim();
      if (!name || !fallbackDivision) {
        return null;
      }

      if ('divisionId' in team && typeof team.divisionId === 'string' && team.divisionId.trim()) {
        return {
          id:
            'id' in team && typeof team.id === 'string' && team.id.trim()
              ? team.id
              : createId('team', name),
          name,
          divisionId: team.divisionId,
        };
      }

      const legacyDivisionName = 'division' in team ? team.division?.trim() : '';
      const divisionId =
        (legacyDivisionName && divisionNameToId.get(legacyDivisionName.toLowerCase())) ||
        fallbackDivision.id;

      return {
        id:
          'id' in team && typeof team.id === 'string' && team.id.trim()
            ? team.id
            : createId('team', name),
        name,
        divisionId,
      };
    })
    .filter((team): team is Team => team !== null);
};

export const sortTeamsByDivisionThenName = (teams: Team[], divisions: Division[]): Team[] => {
  const divisionById = new Map(divisions.map(division => [division.id, division.name] as const));
  return [...teams].sort((left, right) => {
    const leftDivision = divisionById.get(left.divisionId) || '';
    const rightDivision = divisionById.get(right.divisionId) || '';
    const divisionCompare = leftDivision.localeCompare(rightDivision, undefined, {
      sensitivity: 'base',
    });
    if (divisionCompare !== 0) {
      return divisionCompare;
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
  });
};

export const getTeamName = (teams: Team[], teamRef: string): string => {
  if (!teamRef.trim()) {
    return 'Empty slot';
  }

  const team = teams.find(item => item.id === teamRef);
  return team?.name || teamRef;
};

export const getTeamDivision = (
  teams: Team[],
  divisions: Division[],
  teamRef: string
): string | null => {
  const team = teams.find(item => item.id === teamRef);
  if (!team) {
    return null;
  }
  return divisions.find(division => division.id === team.divisionId)?.name ?? null;
};

export const formatTeamWithDivision = (
  teams: Team[],
  divisions: Division[],
  teamRef: string
): string => {
  const teamName = getTeamName(teams, teamRef);
  if (!teamRef.trim()) {
    return teamName;
  }

  const division = getTeamDivision(teams, divisions, teamRef);
  return division ? `${teamName} (${division})` : teamName;
};

export const createEntityId = (prefix: string, name: string): string => createId(prefix, name);
