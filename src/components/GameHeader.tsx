import React from 'react';
import { Game } from '../types';

interface GameHeaderProps {
  game: Game;
  currentIndex: number;
  totalGames: number;
  showLocationSelector?: boolean;
  locations?: string[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  startTime?: string | null;
  expectedStartTime?: number | null;
}

function GameHeader({
  game,
  currentIndex,
  totalGames,
  showLocationSelector = false,
  locations = [],
  selectedLocation = '',
  onSelectLocation,
  startTime = null,
  expectedStartTime = null,
}: GameHeaderProps) {
  const team1Name = game.team1.trim() || 'Empty slot';
  const team2Name = game.team2.trim() || 'Empty slot';
  const nowPlaying = game.team1 || game.team2 ? `${team1Name} vs ${team2Name}` : 'Empty slot';
  return (
    <div className="game-info">
      <div className="game-info-row">
        {showLocationSelector && onSelectLocation && (
          <label className="location-panel-selector game-info-location-selector">
            Location:
            <select
              value={selectedLocation}
              onChange={event => onSelectLocation(event.target.value)}
            >
              {locations.map(nextLocation => (
                <option key={`game-header-location-${nextLocation}`} value={nextLocation}>
                  {nextLocation}
                </option>
              ))}
            </select>
          </label>
        )}
        <h2>
          Game {currentIndex + 1} of {totalGames}: {nowPlaying}
        </h2>
      </div>
    </div>
  );
}

export default GameHeader;
