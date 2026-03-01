import React from 'react';
import './Configuration.scss';
import { GameResult, TimerConfig } from '../types';
import CollapsibleSection from './gameSetup/CollapsibleSection';
import DivisionsSection from './gameSetup/DivisionsSection';
import TeamsSection from './gameSetup/TeamsSection';
import GamesSection from './gameSetup/GamesSection';
import ImportExportSection from './gameSetup/ImportExportSection';
import LocationsSection from './gameSetup/LocationsSection';
import TournamentStartSection from './gameSetup/TournamentStartSection';
import useGameSetupEditor from './gameSetup/useGameSetupEditor';

interface GameSetupProps {
  config: TimerConfig;
  gameResults: GameResult[];
  expectedStartTimes: Array<number | null>;
  onSave: (config: TimerConfig) => void;
  onCancel: () => void;
}

function GameSetup({ config, gameResults, expectedStartTimes, onSave, onCancel }: GameSetupProps) {
  const {
    locations,
    games,
    teams,
    isLocationsOpen,
    isTournamentStartOpen,
    sortedDivisions,
    sortedTeams,
    resolvedGames,
    priorGameNumbers,
    newLocationName,
    selectedLocation,
    tournamentStartAt,
    isDivisionsOpen,
    isTeamsOpen,
    isGamesOpen,
    newDivisionName,
    selectedDivision,
    newTeamName,
    selectedTeam1,
    selectedTeam2,
    specialOutcome1,
    specialOutcome2,
    specialGameNumber1,
    specialGameNumber2,
    setIsLocationsOpen,
    setIsTournamentStartOpen,
    setNewLocationName,
    setSelectedLocation,
    setTournamentStartAt,
    setIsDivisionsOpen,
    setIsTeamsOpen,
    setIsGamesOpen,
    setNewDivisionName,
    setSelectedDivision,
    setNewTeamName,
    setSelectedTeam1,
    setSelectedTeam2,
    setSpecialOutcome1,
    setSpecialOutcome2,
    setSpecialGameNumber1,
    setSpecialGameNumber2,
    handleAddLocation,
    handleRemoveLocation,
    handleAddDivision,
    handleRemoveDivision,
    handleAddTeam,
    handleRemoveTeam,
    handleAddGame,
    handleAddSpecialGame,
    handleRemoveGame,
    handleMoveGameUp,
    handleMoveGameDown,
    handleExportConfig,
    handleImportConfig,
    getConfigForSave,
  } = useGameSetupEditor(config, gameResults);

  return (
    <div className="configuration">
      <h2>Game Setup</h2>

      <CollapsibleSection
        title="Locations"
        isOpen={isLocationsOpen}
        onToggle={() => setIsLocationsOpen(prev => !prev)}
      >
        <LocationsSection
          locations={locations}
          newLocationName={newLocationName}
          onNewLocationNameChange={setNewLocationName}
          onAddLocation={handleAddLocation}
          onRemoveLocation={handleRemoveLocation}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Auto-Start Time"
        isOpen={isTournamentStartOpen}
        onToggle={() => setIsTournamentStartOpen(prev => !prev)}
      >
        <TournamentStartSection
          tournamentStartAt={tournamentStartAt}
          onTournamentStartAtChange={setTournamentStartAt}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Divisions"
        isOpen={isDivisionsOpen}
        onToggle={() => setIsDivisionsOpen(prev => !prev)}
      >
        <DivisionsSection
          divisions={sortedDivisions}
          newDivisionName={newDivisionName}
          onNewDivisionNameChange={setNewDivisionName}
          onAddDivision={handleAddDivision}
          onRemoveDivision={handleRemoveDivision}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Teams"
        isOpen={isTeamsOpen}
        onToggle={() => setIsTeamsOpen(prev => !prev)}
      >
        <TeamsSection
          divisions={sortedDivisions}
          teams={sortedTeams}
          selectedDivision={selectedDivision}
          newTeamName={newTeamName}
          onSelectedDivisionChange={setSelectedDivision}
          onNewTeamNameChange={setNewTeamName}
          onAddTeam={handleAddTeam}
          onRemoveTeam={handleRemoveTeam}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Game Schedule"
        isOpen={isGamesOpen}
        onToggle={() => setIsGamesOpen(prev => !prev)}
      >
        <GamesSection
          games={games}
          teams={teams}
          resolvedGames={resolvedGames}
          expectedStartTimes={expectedStartTimes}
          locations={locations}
          selectedLocation={selectedLocation}
          requireLocationSelection={locations.length > 1}
          sortedTeams={sortedTeams}
          onSelectedLocationChange={setSelectedLocation}
          selectedTeam1={selectedTeam1}
          selectedTeam2={selectedTeam2}
          onSelectedTeam1Change={setSelectedTeam1}
          onSelectedTeam2Change={setSelectedTeam2}
          onAddGame={handleAddGame}
          specialOutcome1={specialOutcome1}
          specialOutcome2={specialOutcome2}
          specialGameNumber1={specialGameNumber1}
          specialGameNumber2={specialGameNumber2}
          priorGameNumbers={priorGameNumbers}
          onSpecialOutcome1Change={setSpecialOutcome1}
          onSpecialOutcome2Change={setSpecialOutcome2}
          onSpecialGameNumber1Change={setSpecialGameNumber1}
          onSpecialGameNumber2Change={setSpecialGameNumber2}
          onAddSpecialGame={handleAddSpecialGame}
          onMoveGameUp={handleMoveGameUp}
          onMoveGameDown={handleMoveGameDown}
          onRemoveGame={handleRemoveGame}
        />
      </CollapsibleSection>

      <ImportExportSection
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      <div className="config-actions">
        <button onClick={() => onSave(getConfigForSave())} className="save-btn">
          Save
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GameSetup;
