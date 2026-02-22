import React, { useState, ChangeEvent } from 'react';
import './Configuration.css';
import { Game, GameResult, Team, TimerConfig } from '../types';
import { formatTeamWithDivision, normalizeTeams, sortTeamsByDivisionThenName } from '../utils/teams';
import { resolveGamesFromResults } from '../utils/drawResolution';

interface DrawProps {
  config: TimerConfig;
  gameResults: GameResult[];
  onSave: (config: TimerConfig) => void;
  onCancel: () => void;
}

function Draw({ config, gameResults, onSave, onCancel }: DrawProps) {
  const [editableConfig, setEditableConfig] = useState<TimerConfig>(config);
  const [divisions, setDivisions] = useState<string[]>(config.divisions || []);
  const [teams, setTeams] = useState<Team[]>(normalizeTeams(config.teams));
  const [games, setGames] = useState<Game[]>(config.games || []);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState<boolean>(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState<boolean>(false);
  const [newDivisionName, setNewDivisionName] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [specialOutcome1, setSpecialOutcome1] = useState<'Winner' | 'Loser'>('Winner');
  const [specialGameNumber1, setSpecialGameNumber1] = useState<number>(1);
  const [specialOutcome2, setSpecialOutcome2] = useState<'Winner' | 'Loser'>('Loser');
  const [specialGameNumber2, setSpecialGameNumber2] = useState<number>(1);

  const sortedDivisions = [...divisions].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: 'base' })
  );
  const sortedTeams = sortTeamsByDivisionThenName(teams);
  const resolvedGames = resolveGamesFromResults(games, gameResults);
  const priorGameNumbers = games.map((_, index) => index + 1);

  const buildSpecialPlaceholder = (outcome: 'Winner' | 'Loser', gameNumber: number): string =>
    `${outcome} of Game ${gameNumber}`;

  const handleAddDivision = (): void => {
    const divisionName = newDivisionName.trim();
    if (!divisionName) {
      return;
    }
    if (divisions.some(division => division.toLowerCase() === divisionName.toLowerCase())) {
      return;
    }
    setDivisions([...divisions, divisionName]);
    setSelectedDivision(divisionName);
    setNewDivisionName('');
  };

  const handleRemoveDivision = (divisionToRemove: string): void => {
    setDivisions(divisions.filter(division => division !== divisionToRemove));
    const remainingTeams = teams.filter(team => team.division !== divisionToRemove);
    setTeams(remainingTeams);

    const removedTeamNames = new Set(
      teams.filter(team => team.division === divisionToRemove).map(team => team.name)
    );
    setGames(
      games.filter(game => !removedTeamNames.has(game.team1) && !removedTeamNames.has(game.team2))
    );

    if (selectedDivision === divisionToRemove) {
      setSelectedDivision('');
    }
    if (removedTeamNames.has(selectedTeam1)) {
      setSelectedTeam1('');
    }
    if (removedTeamNames.has(selectedTeam2)) {
      setSelectedTeam2('');
    }
  };

  const handleAddTeam = (): void => {
    const teamName = newTeamName.trim();
    if (!teamName || !selectedDivision) {
      return;
    }
    if (teams.some(team => team.name.toLowerCase() === teamName.toLowerCase())) {
      return;
    }
    setTeams([...teams, { name: teamName, division: selectedDivision }]);
    setNewTeamName('');
  };

  const handleRemoveTeam = (teamToRemove: Team): void => {
    setTeams(teams.filter(team => team.name !== teamToRemove.name));
    setGames(
      games.filter(game => game.team1 !== teamToRemove.name && game.team2 !== teamToRemove.name)
    );
    if (selectedTeam1 === teamToRemove.name) {
      setSelectedTeam1('');
    }
    if (selectedTeam2 === teamToRemove.name) {
      setSelectedTeam2('');
    }
  };

  const handleAddGame = (): void => {
    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      setGames([
        ...games,
        {
          team1: selectedTeam1,
          team2: selectedTeam2,
        },
      ]);
      setSelectedTeam1('');
      setSelectedTeam2('');
    }
  };

  const handleAddSpecialGame = (): void => {
    if (games.length === 0) {
      return;
    }
    const participant1 = buildSpecialPlaceholder(specialOutcome1, specialGameNumber1);
    const participant2 = buildSpecialPlaceholder(specialOutcome2, specialGameNumber2);
    if (participant1 === participant2) {
      return;
    }

    setGames([
      ...games,
      {
        team1: participant1,
        team2: participant2,
      },
    ]);
  };

  const handleRemoveGame = (index: number): void => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleMoveGameUp = (index: number): void => {
    if (index > 0) {
      const newGames = [...games];
      [newGames[index - 1], newGames[index]] = [newGames[index], newGames[index - 1]];
      setGames(newGames);
    }
  };

  const handleMoveGameDown = (index: number): void => {
    if (index < games.length - 1) {
      const newGames = [...games];
      [newGames[index], newGames[index + 1]] = [newGames[index + 1], newGames[index]];
      setGames(newGames);
    }
  };

  const handleExportConfig = (): void => {
    const configToExport: TimerConfig = {
      ...editableConfig,
      divisions,
      teams,
      games,
    };

    const dataStr = JSON.stringify(configToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-timer-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedConfig: TimerConfig = JSON.parse(result);
            setEditableConfig({
              countdownToStart: importedConfig.countdownToStart || 20,
              firstHalfDuration: importedConfig.firstHalfDuration || 600,
              halfTimeDuration: importedConfig.halfTimeDuration || 120,
              secondHalfDuration: importedConfig.secondHalfDuration || 600,
              betweenGamesDuration: importedConfig.betweenGamesDuration || 180,
              divisions: importedConfig.divisions || [],
              teams: normalizeTeams(importedConfig.teams),
              leftTeamLabel: importedConfig.leftTeamLabel || 'White',
              rightTeamLabel: importedConfig.rightTeamLabel || 'Black',
              competitionName: importedConfig.competitionName || '',
              games: importedConfig.games || [],
            });
            setDivisions(importedConfig.divisions || []);
            setTeams(normalizeTeams(importedConfig.teams));
            setGames(importedConfig.games || []);
            setSelectedDivision('');
            setSelectedTeam1('');
            setSelectedTeam2('');
            setSpecialGameNumber1(1);
            setSpecialGameNumber2(1);
          }
        } catch (error) {
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="configuration">
      <h2>Draw</h2>

      <div className="config-section">
        <div className="config-section-header">
          <h3>Divisions</h3>
          <button
            type="button"
            className="section-toggle-btn"
            onClick={() => setIsDivisionsOpen(prev => !prev)}
            aria-label={isDivisionsOpen ? 'Collapse Divisions' : 'Expand Divisions'}
          >
            {isDivisionsOpen ? '−' : '+'}
          </button>
        </div>
        {isDivisionsOpen && (
          <>
            <div className="add-game">
              <input
                type="text"
                placeholder="Division name"
                value={newDivisionName}
                onChange={e => setNewDivisionName(e.target.value)}
              />
              <button onClick={handleAddDivision} className="add-btn">
                Add Division
              </button>
            </div>

            <div className="games-list">
              {sortedDivisions.map((division, index) => (
                <div key={division} className="game-item">
                  <span className="game-number">Division {index + 1}:</span>
                  <span className="game-teams">{division}</span>
                  <div className="game-controls">
                    <button onClick={() => handleRemoveDivision(division)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="config-section">
        <div className="config-section-header">
          <h3>Teams</h3>
          <button
            type="button"
            className="section-toggle-btn"
            onClick={() => setIsTeamsOpen(prev => !prev)}
            aria-label={isTeamsOpen ? 'Collapse Teams' : 'Expand Teams'}
          >
            {isTeamsOpen ? '−' : '+'}
          </button>
        </div>
        {isTeamsOpen && (
          <>
            <div className="add-game">
              <select value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)}>
                <option value="">Select Division</option>
                {sortedDivisions.map(division => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Team name"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
              />
              <button onClick={handleAddTeam} className="add-btn">
                Add Team
              </button>
            </div>

            <div className="games-list">
              {sortedTeams.map((team, index) => (
                <div key={team.name} className="game-item">
                  <span className="game-number">Team {index + 1}:</span>
                  <span className="game-teams">
                    {team.name} <strong>({team.division})</strong>
                  </span>
                  <div className="game-controls">
                    <button onClick={() => handleRemoveTeam(team)} className="remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="config-section">
        <h3>Game Draw</h3>
        <div className="add-game">
          <select value={selectedTeam1} onChange={e => setSelectedTeam1(e.target.value)}>
            <option value="">Select Team 1</option>
            {sortedTeams.map(team => (
              <option key={`team1-${team.name}`} value={team.name}>
                {team.division} - {team.name}
              </option>
            ))}
          </select>
          <span className="vs-label">vs</span>
          <select value={selectedTeam2} onChange={e => setSelectedTeam2(e.target.value)}>
            <option value="">Select Team 2</option>
            {sortedTeams.map(team => (
              <option key={`team2-${team.name}`} value={team.name}>
                {team.division} - {team.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddGame} className="add-btn">
            Add Game
          </button>
        </div>

        <div className="add-game special-game-row">
          <select
            className="special-outcome-select"
            value={specialOutcome1}
            onChange={e => setSpecialOutcome1(e.target.value as 'Winner' | 'Loser')}
          >
            <option value="Winner">Winner</option>
            <option value="Loser">Loser</option>
          </select>
          <select
            className="special-game-number-select"
            value={specialGameNumber1}
            onChange={e => setSpecialGameNumber1(Number(e.target.value))}
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
            onChange={e => setSpecialOutcome2(e.target.value as 'Winner' | 'Loser')}
          >
            <option value="Winner">Winner</option>
            <option value="Loser">Loser</option>
          </select>
          <select
            className="special-game-number-select"
            value={specialGameNumber2}
            onChange={e => setSpecialGameNumber2(Number(e.target.value))}
          >
            {priorGameNumbers.map(gameNumber => (
              <option key={`special-2-${gameNumber}`} value={gameNumber}>
                Game {gameNumber}
              </option>
            ))}
          </select>
          <button onClick={handleAddSpecialGame} className="add-btn" disabled={games.length === 0}>
            Add Special Game
          </button>
        </div>

        <div className="games-list">
          {resolvedGames.map((game, index) => (
            <div key={index} className="game-item">
              <span className="game-number">Game {index + 1}:</span>
              <span className="game-teams">
                {formatTeamWithDivision(teams, game.team1)} vs {formatTeamWithDivision(teams, game.team2)}
              </span>
              <div className="game-controls">
                <button
                  onClick={() => handleMoveGameUp(index)}
                  disabled={index === 0}
                  className="move-btn"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveGameDown(index)}
                  disabled={index === games.length - 1}
                  className="move-btn"
                >
                  ↓
                </button>
                <button onClick={() => handleRemoveGame(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h3>Import / Export</h3>
        <div className="import-export">
          <button onClick={handleExportConfig} className="export-btn">
            Export Configuration
          </button>
          <label className="import-btn">
            Import Configuration
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="config-actions">
        <button
          onClick={() => onSave({ ...editableConfig, divisions, teams, games })}
          className="save-btn"
        >
          Save
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Draw;
