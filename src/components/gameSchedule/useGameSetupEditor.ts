import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Division, Game, GameResult, Location, Team, TimerConfig } from '../../types';
import { createEntityId, sortTeamsByDivisionThenName } from '../../utils/teams';
import { resolveGamesFromResults } from '../../utils/gameSetupResolution';
import { EMPTY_SLOT_OPTION_VALUE, SpecialOutcome } from '../../types';
import {
  buildExportConfig,
  buildSpecialPlaceholder,
  moveItemInArray,
  parseImportedConfig,
} from './utils';

interface UseGameSetupEditorResult {
  editableConfig: TimerConfig;
  locations: Location[];
  tournamentStartAt: string;
  divisions: Division[];
  teams: Team[];
  games: Game[];
  sortedDivisions: Division[];
  sortedTeams: Team[];
  resolvedGames: Game[];
  priorGameNumbers: number[];
  newLocationName: string;
  selectedLocation: string;
  newDivisionName: string;
  selectedDivision: string;
  newTeamName: string;
  selectedTeam1: string;
  selectedTeam2: string;
  specialOutcome1: SpecialOutcome;
  specialOutcome2: SpecialOutcome;
  specialGameNumber1: number;
  specialGameNumber2: number;
  setTournamentStartAt: Dispatch<SetStateAction<string>>;
  setNewLocationName: Dispatch<SetStateAction<string>>;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  setNewDivisionName: Dispatch<SetStateAction<string>>;
  setSelectedDivision: Dispatch<SetStateAction<string>>;
  setNewTeamName: Dispatch<SetStateAction<string>>;
  setSelectedTeam1: Dispatch<SetStateAction<string>>;
  setSelectedTeam2: Dispatch<SetStateAction<string>>;
  setSpecialOutcome1: Dispatch<SetStateAction<SpecialOutcome>>;
  setSpecialOutcome2: Dispatch<SetStateAction<SpecialOutcome>>;
  setSpecialGameNumber1: Dispatch<SetStateAction<number>>;
  setSpecialGameNumber2: Dispatch<SetStateAction<number>>;
  handleAddLocation: () => void;
  handleRemoveLocation: (locationIdToRemove: string) => void;
  handleAddDivision: () => void;
  handleRemoveDivision: (divisionIdToRemove: string) => void;
  handleAddTeam: () => void;
  handleRemoveTeam: (teamToRemove: Team) => void;
  handleAddGame: () => void;
  handleAddSpecialGame: () => void;
  handleRemoveGame: (index: number) => void;
  handleMoveGameUp: (index: number) => void;
  handleMoveGameDown: (index: number) => void;
  handleExportConfig: () => void;
  handleImportConfig: (event: ChangeEvent<HTMLInputElement>) => void;
  getConfigForSave: () => TimerConfig;
}

function useGameSetupEditor(
  config: TimerConfig,
  gameResults: GameResult[]
): UseGameSetupEditorResult {
  const clearPersistedDataForImport = (): void => {
    const timerStateKeyPrefix = 'teamTimerState:';
    const keysToRemove: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) {
        continue;
      }
      if (key.startsWith(timerStateKeyPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('teamTimerLocationStartTimes');
    localStorage.removeItem('teamTimerConfig');
  };

  const [editableConfig, setEditableConfig] = useState<TimerConfig>(config);
  const [locations, setLocations] = useState<Location[]>(config.locations || []);
  const [tournamentStartAt, setTournamentStartAt] = useState<string>(
    config.tournamentStartAt || ''
  );
  const [divisions, setDivisions] = useState<Division[]>(config.divisions || []);
  const [teams, setTeams] = useState<Team[]>(config.teams || []);
  const [games, setGames] = useState<Game[]>(config.games || []);
  const [newLocationName, setNewLocationName] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [newDivisionName, setNewDivisionName] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [specialOutcome1, setSpecialOutcome1] = useState<SpecialOutcome>('Winner');
  const [specialGameNumber1, setSpecialGameNumber1] = useState<number>(1);
  const [specialOutcome2, setSpecialOutcome2] = useState<SpecialOutcome>('Loser');
  const [specialGameNumber2, setSpecialGameNumber2] = useState<number>(1);

  const sortedDivisions = [...divisions].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: 'base' })
  );
  const sortedTeams = sortTeamsByDivisionThenName(teams, divisions);
  const resolvedGames = resolveGamesFromResults(games, gameResults);
  const priorGameNumbers = games.map((_, index) => index + 1);
  const hasMultipleLocations = locations.length > 1;

  const handleAddLocation = (): void => {
    const locationName = newLocationName.trim();
    if (!locationName) {
      return;
    }
    if (locations.some(location => location.name.toLowerCase() === locationName.toLowerCase())) {
      return;
    }

    const addedLocation: Location = {
      id: createEntityId('loc', locationName),
      name: locationName,
    };
    setLocations([...locations, addedLocation]);
    if (!selectedLocation) {
      setSelectedLocation(addedLocation.id);
    }
    setNewLocationName('');
  };

  const handleRemoveLocation = (locationIdToRemove: string): void => {
    const remainingLocations = locations.filter(location => location.id !== locationIdToRemove);
    setLocations(remainingLocations);
    setGames(prevGames =>
      prevGames.map(game => {
        if (game.locationId !== locationIdToRemove) {
          return game;
        }
        if (remainingLocations.length === 0) {
          const { locationId, ...rest } = game;
          return rest;
        }
        return { ...game, locationId: remainingLocations[0].id };
      })
    );
    if (selectedLocation === locationIdToRemove) {
      setSelectedLocation(remainingLocations[0]?.id || '');
    }
  };

  const handleAddDivision = (): void => {
    const divisionName = newDivisionName.trim();
    if (!divisionName) {
      return;
    }
    if (divisions.some(division => division.name.toLowerCase() === divisionName.toLowerCase())) {
      return;
    }

    const addedDivision: Division = {
      id: createEntityId('div', divisionName),
      name: divisionName,
    };
    setDivisions([...divisions, addedDivision]);
    setSelectedDivision(addedDivision.id);
    setNewDivisionName('');
  };

  const handleRemoveDivision = (divisionIdToRemove: string): void => {
    setDivisions(divisions.filter(division => division.id !== divisionIdToRemove));
    const remainingTeams = teams.filter(team => team.divisionId !== divisionIdToRemove);
    setTeams(remainingTeams);

    const removedTeamIds = new Set(
      teams.filter(team => team.divisionId === divisionIdToRemove).map(team => team.id)
    );
    setGames(
      games.filter(game => !removedTeamIds.has(game.team1) && !removedTeamIds.has(game.team2))
    );

    if (selectedDivision === divisionIdToRemove) {
      setSelectedDivision('');
    }
    if (removedTeamIds.has(selectedTeam1)) {
      setSelectedTeam1('');
    }
    if (removedTeamIds.has(selectedTeam2)) {
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

    setTeams([
      ...teams,
      {
        id: createEntityId('team', teamName),
        name: teamName,
        divisionId: selectedDivision,
      },
    ]);
    setNewTeamName('');
  };

  const handleRemoveTeam = (teamToRemove: Team): void => {
    setTeams(teams.filter(team => team.id !== teamToRemove.id));
    setGames(
      games.filter(game => game.team1 !== teamToRemove.id && game.team2 !== teamToRemove.id)
    );
    if (selectedTeam1 === teamToRemove.id) {
      setSelectedTeam1('');
    }
    if (selectedTeam2 === teamToRemove.id) {
      setSelectedTeam2('');
    }
  };

  const handleAddGame = (): void => {
    const locationForGame = hasMultipleLocations ? selectedLocation : locations[0]?.id || undefined;
    if (hasMultipleLocations && !locationForGame) {
      return;
    }

    const isEmptySlot =
      selectedTeam1 === EMPTY_SLOT_OPTION_VALUE && selectedTeam2 === EMPTY_SLOT_OPTION_VALUE;

    if (isEmptySlot) {
      setGames([
        ...games,
        {
          team1: '',
          team2: '',
          locationId: locationForGame,
        },
      ]);
      setSelectedTeam1('');
      setSelectedTeam2('');
      return;
    }

    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      setGames([
        ...games,
        {
          team1: selectedTeam1,
          team2: selectedTeam2,
          locationId: locationForGame,
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
    const locationForGame = hasMultipleLocations ? selectedLocation : locations[0]?.id || undefined;
    if (hasMultipleLocations && !locationForGame) {
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
        locationId: locationForGame,
      },
    ]);
  };

  const handleRemoveGame = (index: number): void => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleMoveGameUp = (index: number): void => {
    if (index > 0) {
      setGames(moveItemInArray(games, index, index - 1));
    }
  };

  const handleMoveGameDown = (index: number): void => {
    if (index < games.length - 1) {
      setGames(moveItemInArray(games, index, index + 1));
    }
  };

  const handleExportConfig = (): void => {
    const configToExport = buildExportConfig(
      editableConfig,
      divisions,
      teams,
      games,
      locations,
      tournamentStartAt
    );

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
            const importedConfig = parseImportedConfig(JSON.parse(result) as TimerConfig);
            clearPersistedDataForImport();
            setEditableConfig(importedConfig);
            setLocations(importedConfig.locations || []);
            setTournamentStartAt(importedConfig.tournamentStartAt || '');
            setDivisions(importedConfig.divisions);
            setTeams(importedConfig.teams);
            setGames(importedConfig.games);
            setSelectedLocation(importedConfig.locations[0]?.id || '');
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

  const getConfigForSave = (): TimerConfig =>
    buildExportConfig(editableConfig, divisions, teams, games, locations, tournamentStartAt);

  return {
    editableConfig,
    locations,
    tournamentStartAt,
    divisions,
    teams,
    games,
    sortedDivisions,
    sortedTeams,
    resolvedGames,
    priorGameNumbers,
    newLocationName,
    selectedLocation,
    newDivisionName,
    selectedDivision,
    newTeamName,
    selectedTeam1,
    selectedTeam2,
    specialOutcome1,
    specialOutcome2,
    specialGameNumber1,
    specialGameNumber2,
    setTournamentStartAt,
    setNewLocationName,
    setSelectedLocation,
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
  };
}

export default useGameSetupEditor;
