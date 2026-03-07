import React from 'react';

interface CompetitionSectionProps {
  competitionName: string;
  onCompetitionNameChange: (value: string) => void;
}

function CompetitionSection({ competitionName, onCompetitionNameChange }: CompetitionSectionProps) {
  return (
    <div className="config-group">
      <label>
        Competition Name:
        <input
          type="text"
          value={competitionName}
          onChange={e => onCompetitionNameChange(e.target.value)}
          placeholder="e.g., Regional Tournament 2026"
        />
      </label>
    </div>
  );
}

export default CompetitionSection;
