import React from 'react';

interface TournamentStartSectionProps {
  tournamentStartAt: string;
  onTournamentStartAtChange: (value: string) => void;
}

function TournamentStartSection({
  tournamentStartAt,
  onTournamentStartAtChange,
}: TournamentStartSectionProps) {
  return (
    <div className="add-game tournament-start-row">
      <input
        type="datetime-local"
        value={tournamentStartAt}
        onChange={event => onTournamentStartAtChange(event.target.value)}
      />
      <button onClick={() => onTournamentStartAtChange('')} className="remove-btn" type="button">
        Clear
      </button>
    </div>
  );
}

export default TournamentStartSection;
