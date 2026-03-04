import React from 'react';
import { Division, Team } from '../../../types';

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
  const divisionById = new Map(divisions.map(division => [division.id, division.name] as const));

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

      <div className="games-list">
        {teams.map((team, index) => (
          <div key={team.id} className="game-item">
            <span className="game-number">Team {index + 1}:</span>
            <span className="game-teams">
              {team.name} <strong>({divisionById.get(team.divisionId) || 'Unassigned'})</strong>
            </span>
            <div className="game-controls">
              <button onClick={() => onRemoveTeam(team)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TeamsSection;
