import React from 'react';
import { Division } from '@team-timer/core';

interface DivisionsSectionProps {
  divisions: Division[];
  newDivisionName: string;
  onNewDivisionNameChange: (value: string) => void;
  onAddDivision: () => void;
  onRemoveDivision: (divisionId: string) => void;
}

function DivisionsSection({
  divisions,
  newDivisionName,
  onNewDivisionNameChange,
  onAddDivision,
  onRemoveDivision,
}: DivisionsSectionProps) {
  return (
    <>
      <div className="add-game">
        <input
          type="text"
          placeholder="Division name"
          value={newDivisionName}
          onChange={event => onNewDivisionNameChange(event.target.value)}
        />
        <button onClick={onAddDivision} className="add-btn">
          Add Division
        </button>
      </div>

      <div className="games-list">
        {divisions.map((division, index) => (
          <div key={division.id} className="game-item">
            <span className="game-number">Division {index + 1}:</span>
            <span className="game-teams">{division.name}</span>
            <div className="game-controls">
              <button onClick={() => onRemoveDivision(division.id)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DivisionsSection;
