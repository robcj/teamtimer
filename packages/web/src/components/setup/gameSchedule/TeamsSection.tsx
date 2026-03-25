import React, { useState } from 'react';
import { Division, Team } from '@team-timer/core';

interface TeamsSectionProps {
  divisions: Division[];
  teams: Team[];
  selectedDivision: string;
  newTeamName: string;
  onSelectedDivisionChange: (value: string) => void;
  onNewTeamNameChange: (value: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (team: Team) => void;
}

function TeamsSection({
  divisions,
  teams,
  selectedDivision,
  newTeamName,
  onSelectedDivisionChange,
  onNewTeamNameChange,
  onAddTeam,
  onRemoveTeam,
}: TeamsSectionProps) {
  const [groupByDivision, setGroupByDivision] = useState<boolean>(true);
  const divisionById = new Map(divisions.map(division => [division.id, division.name] as const));
  const groupedTeams = groupByDivision
    ? teams.reduce<Array<{ label: string; rows: Array<{ team: Team; index: number }> }>>(
        (groups, team, index) => {
          const divisionName = divisionById.get(team.divisionId) || 'Unassigned';
          const existingGroup = groups.find(group => group.label === divisionName);

          if (existingGroup) {
            existingGroup.rows.push({ team, index });
            return groups;
          }

          groups.push({
            label: divisionName,
            rows: [{ team, index }],
          });
          return groups;
        },
        []
      )
    : [{ label: 'All Teams', rows: teams.map((team, index) => ({ team, index })) }];

  return (
    <>
      <div className="add-game">
        <select
          value={selectedDivision}
          onChange={event => onSelectedDivisionChange(event.target.value)}
        >
          <option value="">Select Division</option>
          {divisions.map(division => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Team name"
          value={newTeamName}
          onChange={event => onNewTeamNameChange(event.target.value)}
        />
        <button onClick={onAddTeam} className="add-btn">
          Add Team
        </button>
      </div>

      <div className="teams-list">
        <div className="grouping-controls">
          <button
            type="button"
            className="grouping-toggle-btn"
            onClick={() => setGroupByDivision(currentValue => !currentValue)}
          >
            {groupByDivision ? 'Show Single List' : 'Group by Division'}
          </button>
        </div>

        <table className="teams-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Division</th>
              <th>Team Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedTeams.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-table-row">
                  No teams added yet.
                </td>
              </tr>
            ) : (
              groupedTeams.map(group => (
                <React.Fragment key={group.label}>
                  {groupByDivision && (
                    <tr className="table-group-row">
                      <td colSpan={4}>{group.label}</td>
                    </tr>
                  )}
                  {group.rows.map(({ team, index }) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{divisionById.get(team.divisionId) || 'Unassigned'}</td>
                      <td>{team.name}</td>
                      <td>
                        <div className="game-controls">
                          <button
                            type="button"
                            onClick={() => onRemoveTeam(team)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TeamsSection;
