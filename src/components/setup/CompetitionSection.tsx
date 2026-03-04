import React from 'react';

interface CompetitionSectionProps {
  competitionName: string;
  keepScreenAwake: boolean;
  onCompetitionNameChange: (value: string) => void;
  onKeepScreenAwakeChange: (value: boolean) => void;
}

function CompetitionSection({
  competitionName,
  keepScreenAwake,
  onCompetitionNameChange,
  onKeepScreenAwakeChange,
}: CompetitionSectionProps) {
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

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={keepScreenAwake}
          onChange={e => onKeepScreenAwakeChange(e.target.checked)}
        />
        <span>Keep screen awake while using the timer (where supported)</span>
      </label>
    </div>
  );
}

export default CompetitionSection;
