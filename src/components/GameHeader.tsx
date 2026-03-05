import React from 'react';
import { Game, Location } from '../types';

interface GameHeaderProps {
  currentIndex: number;
  totalGames: number;
  showLocationSelector?: boolean;
  locations?: Location[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
}

function GameHeader({
  currentIndex,
  totalGames,
  showLocationSelector = false,
  locations = [],
  selectedLocation = '',
  onSelectLocation,
}: GameHeaderProps) {
  return (
    <div className="game-info">
      <div className="game-info-row">
        {showLocationSelector && onSelectLocation && (
          <label className="location-panel-selector game-info-location-selector">
            <select
              value={selectedLocation}
              onChange={event => onSelectLocation(event.target.value)}
            >
              {locations.map(nextLocation => (
                <option key={`game-header-location-${nextLocation.id}`} value={nextLocation.id}>
                  {nextLocation.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <h2>
          Game {currentIndex + 1} of {totalGames}
        </h2>
      </div>
    </div>
  );
}

export default GameHeader;
