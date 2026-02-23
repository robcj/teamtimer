import React from 'react';
import { Game, Team } from '../../types';
import { formatTeamWithDivision } from '../../utils/teams';
import { SpecialOutcome } from './types';
import { formatExpectedStartTime } from '../../utils/expectedStartTimes';

interface GamesSectionProps {
  games: Game[];
  teams: Team[];
  resolvedGames: Game[];
  expectedStartTimes: Array<number | null>;
  locations: string[];
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
  const locationLabel = (game: Game): string => {
    if (game.location) {
      return game.location;
    }
    return locations[0] || 'Unassigned';
  };

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
              <option key={`location-main-${location}`} value={location}>
                {location}
              </option>
            ))}
          </select>
        )}
        <select value={selectedTeam1} onChange={event => onSelectedTeam1Change(event.target.value)}>
          <option value="">Select Team 1</option>
          {sortedTeams.map(team => (
            <option key={`team1-${team.name}`} value={team.name}>
              {team.division} - {team.name}
            </option>
          ))}
        </select>
        <span className="vs-label">vs</span>
        <select value={selectedTeam2} onChange={event => onSelectedTeam2Change(event.target.value)}>
          <option value="">Select Team 2</option>
          {sortedTeams.map(team => (
            <option key={`team2-${team.name}`} value={team.name}>
              {team.division} - {team.name}
            </option>
          ))}
        </select>
        <button onClick={onAddGame} className="add-btn">
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
        <button onClick={onAddSpecialGame} className="add-btn" disabled={games.length === 0}>
          Add Special Game
        </button>
      </div>

      <div className="games-list">
        {resolvedGames.map((game, index) => (
          <div key={index} className="game-item">
            <span className="game-number">Game {index + 1}:</span>
            <span className="game-teams">
              {formatTeamWithDivision(teams, game.team1)} vs{' '}
              {formatTeamWithDivision(teams, game.team2)}
              <strong className="game-location"> @ {locationLabel(games[index])}</strong>
              <span className="game-expected-start">
                {' '}
                (Expected: {formatExpectedStartTime(expectedStartTimes[index] ?? null)})
              </span>
            </span>
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
          </div>
        ))}
      </div>
    </>
  );
}

export default GamesSection;
