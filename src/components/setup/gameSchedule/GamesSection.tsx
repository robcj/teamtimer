import React, { useMemo, useState } from 'react';
import { Division, Game, Location, Team } from '../../../types';
import { formatTeamWithDivision, getTeamDivision } from '../../../utils/teams';
import { EMPTY_SLOT_LABEL, EMPTY_SLOT_OPTION_VALUE, SpecialOutcome } from '../../../types';
import { formatExpectedStartTime } from '../../../utils/expectedStartTimes';

interface GamesSectionProps {
  games: Game[];
  teams: Team[];
  divisions: Division[];
  resolvedGames: Game[];
  expectedStartTimes: Array<number | null>;
  locations: Location[];
  selectedLocation: string;
  requireLocationSelection: boolean;
  sortedTeams: Team[];
  selectedTeam1: string;
  selectedTeam2: string;
  onSelectedLocationChange: (value: string) => void;
  onSelectedTeam1Change: (value: string) => void;
  onSelectedTeam2Change: (value: string) => void;
  onAddGame: () => void;
  specialOutcome1: SpecialOutcome;
  specialOutcome2: SpecialOutcome;
  specialGameNumber1: number;
  specialGameNumber2: number;
  priorGameNumbers: number[];
  onSpecialOutcome1Change: (value: SpecialOutcome) => void;
  onSpecialOutcome2Change: (value: SpecialOutcome) => void;
  onSpecialGameNumber1Change: (value: number) => void;
  onSpecialGameNumber2Change: (value: number) => void;
  onAddSpecialGame: () => void;
  onMoveGameUp: (index: number) => void;
  onMoveGameDown: (index: number) => void;
  onRemoveGame: (index: number) => void;
}

function GamesSection({
  games,
  teams,
  divisions,
  resolvedGames,
  expectedStartTimes,
  locations,
  selectedLocation,
  requireLocationSelection,
  sortedTeams,
  selectedTeam1,
  selectedTeam2,
  onSelectedLocationChange,
  onSelectedTeam1Change,
  onSelectedTeam2Change,
  onAddGame,
  specialOutcome1,
  specialOutcome2,
  specialGameNumber1,
  specialGameNumber2,
  priorGameNumbers,
  onSpecialOutcome1Change,
  onSpecialOutcome2Change,
  onSpecialGameNumber1Change,
  onSpecialGameNumber2Change,
  onAddSpecialGame,
  onMoveGameUp,
  onMoveGameDown,
  onRemoveGame,
}: GamesSectionProps) {
  const [groupByLocation, setGroupByLocation] = useState<boolean>(false);
  const [groupByDivision, setGroupByDivision] = useState<boolean>(false);
  const hasGrouping = groupByLocation || groupByDivision;

  const hasRequiredLocation = !requireLocationSelection || Boolean(selectedLocation);
  const isEmptySlotSelection =
    selectedTeam1 === EMPTY_SLOT_OPTION_VALUE && selectedTeam2 === EMPTY_SLOT_OPTION_VALUE;
  const hasValidTeamSelection =
    (Boolean(selectedTeam1) && Boolean(selectedTeam2) && selectedTeam1 !== selectedTeam2) ||
    isEmptySlotSelection;
  const canAddGame = hasRequiredLocation && hasValidTeamSelection;

  const specialParticipant1 = `${specialOutcome1} of Game ${specialGameNumber1}`;
  const specialParticipant2 = `${specialOutcome2} of Game ${specialGameNumber2}`;
  const canAddSpecialGame =
    games.length > 0 && hasRequiredLocation && specialParticipant1 !== specialParticipant2;

  const handleSelectedTeam1Change = (value: string): void => {
    onSelectedTeam1Change(value);
    if (value === EMPTY_SLOT_OPTION_VALUE) {
      onSelectedTeam2Change(EMPTY_SLOT_OPTION_VALUE);
      return;
    }
    if (selectedTeam2 === EMPTY_SLOT_OPTION_VALUE) {
      onSelectedTeam2Change('');
    }
  };

  const handleSelectedTeam2Change = (value: string): void => {
    onSelectedTeam2Change(value);
    if (value === EMPTY_SLOT_OPTION_VALUE) {
      onSelectedTeam1Change(EMPTY_SLOT_OPTION_VALUE);
      return;
    }
    if (selectedTeam1 === EMPTY_SLOT_OPTION_VALUE) {
      onSelectedTeam1Change('');
    }
  };

  const locationNameById = new Map(
    locations.map(location => [location.id, location.name] as const)
  );
  const divisionNameById = new Map(
    divisions.map(division => [division.id, division.name] as const)
  );

  const locationLabel = (game: Game): string => {
    if (game.locationId) {
      return locationNameById.get(game.locationId) || game.locationId;
    }
    return locations[0]?.name || 'Unassigned';
  };

  const divisionLabel = (game: Game): string => {
    const team1Division = getTeamDivision(teams, divisions, game.team1);
    const team2Division = getTeamDivision(teams, divisions, game.team2);
    if (team1Division && team2Division) {
      return team1Division === team2Division
        ? team1Division
        : `${team1Division} / ${team2Division}`;
    }
    return team1Division ?? team2Division ?? 'Unassigned';
  };

  const groupedRows = useMemo(() => {
    const rows = resolvedGames.map((game, index) => ({
      game,
      index,
      location: locationLabel(games[index]),
      division: divisionLabel(game),
    }));

    if (!hasGrouping) {
      return [{ label: 'All Games', rows }];
    }

    const groups = new Map<string, typeof rows>();
    rows.forEach(row => {
      const labels: string[] = [];
      if (groupByLocation) {
        labels.push(`Location: ${row.location}`);
      }
      if (groupByDivision) {
        labels.push(`Division: ${row.division}`);
      }
      const key = labels.join(' • ');
      const existingRows = groups.get(key) || [];
      existingRows.push(row);
      groups.set(key, existingRows);
    });

    return Array.from(groups.entries()).map(([label, grouped]) => ({
      label,
      rows: grouped,
    }));
  }, [
    resolvedGames,
    games,
    hasGrouping,
    groupByLocation,
    groupByDivision,
    teams,
    locations,
    divisions,
  ]);

  return (
    <>
      <div className="add-game">
        {requireLocationSelection && (
          <select
            value={selectedLocation}
            onChange={event => onSelectedLocationChange(event.target.value)}
          >
            <option value="">Select Location</option>
            {locations.map(location => (
              <option key={`location-main-${location.id}`} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={selectedTeam1}
          onChange={event => handleSelectedTeam1Change(event.target.value)}
        >
          <option value="">Select Team 1</option>
          <option value={EMPTY_SLOT_OPTION_VALUE}>{EMPTY_SLOT_LABEL}</option>
          {sortedTeams.map(team => (
            <option key={`team1-${team.id}`} value={team.id}>
              {(divisionNameById.get(team.divisionId) || 'Unassigned') + ' - ' + team.name}
            </option>
          ))}
        </select>
        <span className="vs-label">vs</span>
        <select
          value={selectedTeam2}
          onChange={event => handleSelectedTeam2Change(event.target.value)}
        >
          <option value="">Select Team 2</option>
          <option value={EMPTY_SLOT_OPTION_VALUE}>{EMPTY_SLOT_LABEL}</option>
          {sortedTeams.map(team => (
            <option key={`team2-${team.id}`} value={team.id}>
              {(divisionNameById.get(team.divisionId) || 'Unassigned') + ' - ' + team.name}
            </option>
          ))}
        </select>
        <button onClick={onAddGame} className="add-btn" disabled={!canAddGame}>
          Add Game
        </button>
      </div>

      <div className="add-game special-game-row">
        <select
          className="special-outcome-select"
          value={specialOutcome1}
          onChange={event => onSpecialOutcome1Change(event.target.value as SpecialOutcome)}
        >
          <option value="Winner">Winner</option>
          <option value="Loser">Loser</option>
        </select>
        <select
          className="special-game-number-select"
          value={specialGameNumber1}
          onChange={event => onSpecialGameNumber1Change(Number(event.target.value))}
        >
          {priorGameNumbers.map(gameNumber => (
            <option key={`special-1-${gameNumber}`} value={gameNumber}>
              Game {gameNumber}
            </option>
          ))}
        </select>

        <span className="vs-label">vs</span>

        <select
          className="special-outcome-select"
          value={specialOutcome2}
          onChange={event => onSpecialOutcome2Change(event.target.value as SpecialOutcome)}
        >
          <option value="Winner">Winner</option>
          <option value="Loser">Loser</option>
        </select>
        <select
          className="special-game-number-select"
          value={specialGameNumber2}
          onChange={event => onSpecialGameNumber2Change(Number(event.target.value))}
        >
          {priorGameNumbers.map(gameNumber => (
            <option key={`special-2-${gameNumber}`} value={gameNumber}>
              Game {gameNumber}
            </option>
          ))}
        </select>
        <button onClick={onAddSpecialGame} className="add-btn" disabled={!canAddSpecialGame}>
          Add Special Game
        </button>
      </div>

      <div className="games-list">
        <div className="grouping-controls">
          <label className="grouping-option">
            <input
              type="checkbox"
              checked={groupByLocation}
              onChange={event => setGroupByLocation(event.target.checked)}
            />
            Group by Location
          </label>
          <label className="grouping-option">
            <input
              type="checkbox"
              checked={groupByDivision}
              onChange={event => setGroupByDivision(event.target.checked)}
            />
            Group by Division
          </label>
        </div>
        <table className="scores-table games-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Location</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Expected Start</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedRows.map(group => (
              <React.Fragment key={group.label}>
                {hasGrouping && (
                  <tr className="table-group-row">
                    <td colSpan={6}>{group.label}</td>
                  </tr>
                )}
                {group.rows.map(({ game, index, location }) => (
                  <tr key={index}>
                    <td className="scores-game-number">{index + 1}</td>
                    <td>
                      <strong className="game-location">{location}</strong>
                    </td>
                    <td className="game-teams">
                      {formatTeamWithDivision(teams, divisions, game.team1)}
                    </td>
                    <td className="game-teams">
                      {formatTeamWithDivision(teams, divisions, game.team2)}
                    </td>
                    <td className="scores-time-cell">
                      {formatExpectedStartTime(expectedStartTimes[index] ?? null)}
                    </td>
                    <td>
                      <div className="game-controls">
                        <button
                          onClick={() => onMoveGameUp(index)}
                          disabled={index === 0}
                          className="move-btn"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => onMoveGameDown(index)}
                          disabled={index === games.length - 1}
                          className="move-btn"
                        >
                          ↓
                        </button>
                        <button onClick={() => onRemoveGame(index)} className="remove-btn">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GamesSection;
