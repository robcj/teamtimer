import React from 'react';

interface DivisionsSectionProps {
  divisions: string[];
  newDivisionName: string;
  onNewDivisionNameChange: (value: string) => void;
  onAddDivision: () => void;
  onRemoveDivision: (division: string) => void;
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
          <div key={division} className="game-item">
            <span className="game-number">Division {index + 1}:</span>
            <span className="game-teams">{division}</span>
            <div className="game-controls">
              <button onClick={() => onRemoveDivision(division)} className="remove-btn">
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
