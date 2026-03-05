import React, { useEffect, useState } from 'react';
import { GameResult, TimerConfig } from '../../types';
import CollapsibleSection from './gameSchedule/CollapsibleSection';
import CompetitionSection from './CompetitionSection';
import TimerDurationsSection from './TimerDurationsSection';
import TeamLabelsSection from './TeamLabelsSection';
import DivisionsSection from './gameSchedule/DivisionsSection';
import TeamsSection from './gameSchedule/TeamsSection';
import GamesSection from './gameSchedule/GamesSection';
import ImportExportSection from './gameSchedule/ImportExportSection';
import LocationsSection from './gameSchedule/LocationsSection';
import TournamentStartSection from './gameSchedule/TournamentStartSection';
import useGameSetupEditor from './gameSchedule/useGameSetupEditor';
import './Setup.scss';

interface SetupProps {
  config: TimerConfig;
  gameResults: GameResult[];
  expectedStartTimes: Array<number | null>;
  onSave: (config: TimerConfig) => void;
  onCancel: () => void;
}

function Setup({ config, gameResults, expectedStartTimes, onSave, onCancel }: SetupProps) {
  const {
    editableConfig,
    locations,
    games,
    teams,
    sortedDivisions,
    sortedTeams,
    resolvedGames,
    priorGameNumbers,
    newLocationName,
    selectedLocation,
    tournamentStartAt,
    newDivisionName,
    selectedDivision,
    newTeamName,
    selectedTeam1,
    selectedTeam2,
    specialOutcome1,
    specialOutcome2,
    specialGameNumber1,
    specialGameNumber2,
    setNewLocationName,
    setSelectedLocation,
    setTournamentStartAt,
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
    handleImportConfig,
    getConfigForSave,
  } = useGameSetupEditor(config, gameResults);

  const [competitionName, setCompetitionName] = useState<string>(
    editableConfig.competitionName || ''
  );
  const [countdownToStart, setCountdownToStart] = useState<number>(editableConfig.countdownToStart);
  const [gameHalfDuration, setGameHalfDuration] = useState<number>(editableConfig.gameHalfDuration);
  const [halfTimeDuration, setHalfTimeDuration] = useState<number>(editableConfig.halfTimeDuration);
  const [betweenGamesDuration, setBetweenGamesDuration] = useState<number>(
    editableConfig.betweenGamesDuration
  );
  const [extraTimeHalfDuration, setExtraTimeHalfDuration] = useState<number>(
    editableConfig.extraTimeHalfDuration
  );
  const [keepScreenAwake, setKeepScreenAwake] = useState<boolean>(
    editableConfig.keepScreenAwake ?? true
  );
  const [leftTeamLabel, setLeftTeamLabel] = useState<string>(
    editableConfig.leftTeamLabel || 'White'
  );
  const [rightTeamLabel, setRightTeamLabel] = useState<string>(
    editableConfig.rightTeamLabel || 'Black'
  );

  useEffect(() => {
    setCompetitionName(editableConfig.competitionName || '');
    setCountdownToStart(editableConfig.countdownToStart);
    setGameHalfDuration(editableConfig.gameHalfDuration);
    setHalfTimeDuration(editableConfig.halfTimeDuration);
    setBetweenGamesDuration(editableConfig.betweenGamesDuration);
    setKeepScreenAwake(editableConfig.keepScreenAwake ?? true);
    setLeftTeamLabel(editableConfig.leftTeamLabel || 'White');
    setRightTeamLabel(editableConfig.rightTeamLabel || 'Black');
  }, [editableConfig]);

  const getSetupConfigForSave = (): TimerConfig => ({
    ...getConfigForSave(),
    countdownToStart,
    gameHalfDuration,
    halfTimeDuration,
    betweenGamesDuration,
    keepScreenAwake,
    leftTeamLabel: leftTeamLabel.trim() || 'White',
    rightTeamLabel: rightTeamLabel.trim() || 'Black',
    competitionName: competitionName.trim(),
  });

  const handleExportConfig = (): void => {
    const dataStr = JSON.stringify(getSetupConfigForSave(), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-timer-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="configuration">
      <h2>Setup</h2>

      <CollapsibleSection title="Competition">
        <CompetitionSection
          competitionName={competitionName}
          keepScreenAwake={keepScreenAwake}
          onCompetitionNameChange={setCompetitionName}
          onKeepScreenAwakeChange={setKeepScreenAwake}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Timer Durations">
        <TimerDurationsSection
          countdownToStart={countdownToStart}
          gameHalfDuration={gameHalfDuration}
          halfTimeDuration={halfTimeDuration}
          extraTimeHalfDuration={extraTimeHalfDuration}
          betweenGamesDuration={betweenGamesDuration}
          onCountdownToStartChange={setCountdownToStart}
          onGameHalfDurationChange={setGameHalfDuration}
          onHalfTimeDurationChange={setHalfTimeDuration}
          onBetweenGamesDurationChange={setBetweenGamesDuration}
          onExtraTimeHalfDurationChange={setExtraTimeHalfDuration}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Opposing Team Labels">
        <TeamLabelsSection
          leftTeamLabel={leftTeamLabel}
          rightTeamLabel={rightTeamLabel}
          onLeftTeamLabelChange={setLeftTeamLabel}
          onRightTeamLabelChange={setRightTeamLabel}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Locations">
        <LocationsSection
          locations={locations}
          newLocationName={newLocationName}
          onNewLocationNameChange={setNewLocationName}
          onAddLocation={handleAddLocation}
          onRemoveLocation={handleRemoveLocation}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Divisions">
        <DivisionsSection
          divisions={sortedDivisions}
          newDivisionName={newDivisionName}
          onNewDivisionNameChange={setNewDivisionName}
          onAddDivision={handleAddDivision}
          onRemoveDivision={handleRemoveDivision}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Teams">
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

      <CollapsibleSection title="Auto-Start Time">
        <TournamentStartSection
          tournamentStartAt={tournamentStartAt}
          onTournamentStartAtChange={setTournamentStartAt}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Game Schedule">
        <GamesSection
          games={games}
          teams={teams}
          divisions={sortedDivisions}
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

      <CollapsibleSection title="Import / Export">
        <ImportExportSection
          onExportConfig={handleExportConfig}
          onImportConfig={handleImportConfig}
        />
      </CollapsibleSection>

      <div className="config-actions">
        <button onClick={() => onSave(getSetupConfigForSave())} className="save-btn">
          Apply
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Setup;
