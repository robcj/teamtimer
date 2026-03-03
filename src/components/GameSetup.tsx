import React, { useEffect, useState } from 'react';
import './Configuration.scss';
import { GameResult, TimerConfig } from '../types';
import { secondsToMinutesAndSeconds, minutesAndSecondsToSeconds } from '../utils/time';
import CollapsibleSection from './gameSetup/CollapsibleSection';
import DivisionsSection from './gameSetup/DivisionsSection';
import TeamsSection from './gameSetup/TeamsSection';
import GamesSection from './gameSetup/GamesSection';
import ImportExportSection from './gameSetup/ImportExportSection';
import LocationsSection from './gameSetup/LocationsSection';
import TournamentStartSection from './gameSetup/TournamentStartSection';
import useGameSetupEditor from './gameSetup/useGameSetupEditor';

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
    handleImportConfig,
    getConfigForSave,
  } = useGameSetupEditor(config, gameResults);

  const [isCompetitionOpen, setIsCompetitionOpen] = useState<boolean>(false);
  const [isTimerDurationsOpen, setIsTimerDurationsOpen] = useState<boolean>(false);
  const [isTeamLabelsOpen, setIsTeamLabelsOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [competitionName, setCompetitionName] = useState<string>(editableConfig.competitionName || '');
  const [countdownToStart, setCountdownToStart] = useState<number>(editableConfig.countdownToStart);
  const [firstHalfDuration, setFirstHalfDuration] = useState<number>(editableConfig.firstHalfDuration);
  const [halfTimeDuration, setHalfTimeDuration] = useState<number>(editableConfig.halfTimeDuration);
  const [secondHalfDuration, setSecondHalfDuration] = useState<number>(editableConfig.secondHalfDuration);
  const [betweenGamesDuration, setBetweenGamesDuration] = useState<number>(
    editableConfig.betweenGamesDuration
  );
  const [keepScreenAwake, setKeepScreenAwake] = useState<boolean>(editableConfig.keepScreenAwake ?? true);
  const [leftTeamLabel, setLeftTeamLabel] = useState<string>(editableConfig.leftTeamLabel || 'White');
  const [rightTeamLabel, setRightTeamLabel] = useState<string>(editableConfig.rightTeamLabel || 'Black');

  useEffect(() => {
    setCompetitionName(editableConfig.competitionName || '');
    setCountdownToStart(editableConfig.countdownToStart);
    setFirstHalfDuration(editableConfig.firstHalfDuration);
    setHalfTimeDuration(editableConfig.halfTimeDuration);
    setSecondHalfDuration(editableConfig.secondHalfDuration);
    setBetweenGamesDuration(editableConfig.betweenGamesDuration);
    setKeepScreenAwake(editableConfig.keepScreenAwake ?? true);
    setLeftTeamLabel(editableConfig.leftTeamLabel || 'White');
    setRightTeamLabel(editableConfig.rightTeamLabel || 'Black');
  }, [editableConfig]);

  const getSetupConfigForSave = (): TimerConfig => ({
    ...getConfigForSave(),
    countdownToStart,
    firstHalfDuration,
    halfTimeDuration,
    secondHalfDuration,
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

      <CollapsibleSection
        title="Competition"
        isOpen={isCompetitionOpen}
        onToggle={() => setIsCompetitionOpen(prev => !prev)}
      >
        <div className="config-group">
          <label>
            Competition Name:
            <input
              type="text"
              value={competitionName}
              onChange={e => setCompetitionName(e.target.value)}
              placeholder="e.g., Regional Tournament 2026"
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={keepScreenAwake}
              onChange={e => setKeepScreenAwake(e.target.checked)}
            />
            <span>Keep screen awake while using the timer (where supported)</span>
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Timer Durations"
        isOpen={isTimerDurationsOpen}
        onToggle={() => setIsTimerDurationsOpen(prev => !prev)}
      >
        <div className="config-group">
          <label>
            Countdown to Start (seconds):
            <input
              type="number"
              value={countdownToStart}
              onChange={e => setCountdownToStart(Number(e.target.value))}
              min="0"
            />
          </label>

          <label>
            First Half Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(firstHalfDuration).minutes}
                onChange={e =>
                  setFirstHalfDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(firstHalfDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(firstHalfDuration).seconds}
                onChange={e =>
                  setFirstHalfDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(firstHalfDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Half Time Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(halfTimeDuration).minutes}
                onChange={e =>
                  setHalfTimeDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(halfTimeDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(halfTimeDuration).seconds}
                onChange={e =>
                  setHalfTimeDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(halfTimeDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Second Half Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(secondHalfDuration).minutes}
                onChange={e =>
                  setSecondHalfDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(secondHalfDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(secondHalfDuration).seconds}
                onChange={e =>
                  setSecondHalfDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(secondHalfDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Between Games Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(betweenGamesDuration).minutes}
                onChange={e =>
                  setBetweenGamesDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(betweenGamesDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(betweenGamesDuration).seconds}
                onChange={e =>
                  setBetweenGamesDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(betweenGamesDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Opposing Team Labels"
        isOpen={isTeamLabelsOpen}
        onToggle={() => setIsTeamLabelsOpen(prev => !prev)}
      >
        <div className="config-group">
          <label>
            Left Team Label:
            <input
              type="text"
              value={leftTeamLabel}
              onChange={e => setLeftTeamLabel(e.target.value)}
              placeholder="White"
            />
          </label>

          <label>
            Right Team Label:
            <input
              type="text"
              value={rightTeamLabel}
              onChange={e => setRightTeamLabel(e.target.value)}
              placeholder="Black"
            />
          </label>
        </div>
      </CollapsibleSection>

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

      <CollapsibleSection
        title="Import / Export"
        isOpen={isImportExportOpen}
        onToggle={() => setIsImportExportOpen(prev => !prev)}
      >
        <ImportExportSection
          onExportConfig={handleExportConfig}
          onImportConfig={handleImportConfig}
        />
      </CollapsibleSection>

      <div className="config-actions">
        <button onClick={() => onSave(getSetupConfigForSave())} className="save-btn">
          Save
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Setup;
