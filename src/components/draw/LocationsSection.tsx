import React from 'react';

interface LocationsSectionProps {
  locations: string[];
  newLocationName: string;
  onNewLocationNameChange: (value: string) => void;
  onAddLocation: () => void;
  onRemoveLocation: (location: string) => void;
}

function LocationsSection({
  locations,
  newLocationName,
  onNewLocationNameChange,
  onAddLocation,
  onRemoveLocation,
}: LocationsSectionProps) {
  return (
    <>
      <div className="add-game">
        <input
          type="text"
          placeholder="Location name"
          value={newLocationName}
          onChange={event => onNewLocationNameChange(event.target.value)}
        />
        <button onClick={onAddLocation} className="add-btn">
          Add Location
        </button>
      </div>

      <div className="games-list">
        {locations.map((location, index) => (
          <div key={location} className="game-item">
            <span className="game-number">Location {index + 1}:</span>
            <span className="game-teams">{location}</span>
            <div className="game-controls">
              <button onClick={() => onRemoveLocation(location)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default LocationsSection;
