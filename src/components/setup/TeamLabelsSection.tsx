import React from 'react';

interface TeamLabelsSectionProps {
  leftTeamLabel: string;
  rightTeamLabel: string;
  onLeftTeamLabelChange: (value: string) => void;
  onRightTeamLabelChange: (value: string) => void;
}

function TeamLabelsSection({
  leftTeamLabel,
  rightTeamLabel,
  onLeftTeamLabelChange,
  onRightTeamLabelChange,
}: TeamLabelsSectionProps) {
  return (
    <div className="config-group">
      <label>
        Left Team Label:
        <input
          type="text"
          value={leftTeamLabel}
          onChange={e => onLeftTeamLabelChange(e.target.value)}
          placeholder="White"
        />
      </label>

      <label>
        Right Team Label:
        <input
          type="text"
          value={rightTeamLabel}
          onChange={e => onRightTeamLabelChange(e.target.value)}
          placeholder="Black"
        />
      </label>
    </div>
  );
}

export default TeamLabelsSection;
