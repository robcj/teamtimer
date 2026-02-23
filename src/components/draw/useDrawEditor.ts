import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Game, GameResult, Team, TimerConfig } from '../../types';
import { normalizeTeams, sortTeamsByDivisionThenName } from '../../utils/teams';
import { resolveGamesFromResults } from '../../utils/drawResolution';
import { SpecialOutcome } from './types';
import {
  buildExportConfig,
  buildSpecialPlaceholder,
  moveItemInArray,
  parseImportedConfig,
} from './utils';

interface UseDrawEditorResult {
  editableConfig: TimerConfig;
  locations: string[];
  tournamentStartAt: string;
  divisions: string[];
  teams: Team[];
  games: Game[];
  isLocationsOpen: boolean;
  isTournamentStartOpen: boolean;
  sortedDivisions: string[];
  sortedTeams: Team[];
  resolvedGames: Game[];
  priorGameNumbers: number[];
  newLocationName: string;
  selectedLocation: string;
  isDivisionsOpen: boolean;
  isTeamsOpen: boolean;
  isGamesOpen: boolean;
  newDivisionName: string;
  selectedDivision: string;
  newTeamName: string;
  selectedTeam1: string;
  selectedTeam2: string;
  specialOutcome1: SpecialOutcome;
  specialOutcome2: SpecialOutcome;
  specialGameNumber1: number;
  specialGameNumber2: number;
  setIsDivisionsOpen: Dispatch<SetStateAction<boolean>>;
  setIsTeamsOpen: Dispatch<SetStateAction<boolean>>;
  setIsGamesOpen: Dispatch<SetStateAction<boolean>>;
  setIsLocationsOpen: Dispatch<SetStateAction<boolean>>;
  setIsTournamentStartOpen: Dispatch<SetStateAction<boolean>>;
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
  handleRemoveLocation: (locationToRemove: string) => void;
  handleAddDivision: () => void;
  handleRemoveDivision: (divisionToRemove: string) => void;
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

function useDrawEditor(config: TimerConfig, gameResults: GameResult[]): UseDrawEditorResult {
  const [editableConfig, setEditableConfig] = useState<TimerConfig>(config);
  const [locations, setLocations] = useState<string[]>(config.locations || []);
  const [tournamentStartAt, setTournamentStartAt] = useState<string>(
    config.tournamentStartAt || ''
  );
  const [divisions, setDivisions] = useState<string[]>(config.divisions || []);
  const [teams, setTeams] = useState<Team[]>(normalizeTeams(config.teams));
  const [games, setGames] = useState<Game[]>(config.games || []);
  const [isLocationsOpen, setIsLocationsOpen] = useState<boolean>(false);
  const [isTournamentStartOpen, setIsTournamentStartOpen] = useState<boolean>(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState<boolean>(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState<boolean>(false);
  const [isGamesOpen, setIsGamesOpen] = useState<boolean>(false);
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
    left.localeCompare(right, undefined, { sensitivity: 'base' })
  );
  const sortedTeams = sortTeamsByDivisionThenName(teams);
  const resolvedGames = resolveGamesFromResults(games, gameResults);
  const priorGameNumbers = games.map((_, index) => index + 1);
  const hasMultipleLocations = locations.length > 1;

  const handleAddLocation = (): void => {
    const locationName = newLocationName.trim();
    if (!locationName) {
      return;
    }
    if (locations.some(location => location.toLowerCase() === locationName.toLowerCase())) {
      return;
    }
    setLocations([...locations, locationName]);
    if (!selectedLocation) {
      setSelectedLocation(locationName);
    }
    setNewLocationName('');
  };

  const handleRemoveLocation = (locationToRemove: string): void => {
    const remainingLocations = locations.filter(location => location !== locationToRemove);
    setLocations(remainingLocations);
    setGames(prevGames =>
      prevGames.map(game => {
        if (game.location !== locationToRemove) {
          return game;
        }
        if (remainingLocations.length === 0) {
          const { location, ...rest } = game;
          return rest;
        }
        return { ...game, location: remainingLocations[0] };
      })
    );
    if (selectedLocation === locationToRemove) {
      setSelectedLocation(remainingLocations[0] || '');
    }
  };

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
    const locationForGame = hasMultipleLocations ? selectedLocation : locations[0] || undefined;
    if (hasMultipleLocations && !locationForGame) {
      return;
    }

    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      setGames([
        ...games,
        {
          team1: selectedTeam1,
          team2: selectedTeam2,
          location: locationForGame,
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
    const locationForGame = hasMultipleLocations ? selectedLocation : locations[0] || undefined;
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
        location: locationForGame,
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
            setEditableConfig(importedConfig);
            setLocations(importedConfig.locations || []);
            setTournamentStartAt(importedConfig.tournamentStartAt || '');
            setDivisions(importedConfig.divisions);
            setTeams(importedConfig.teams);
            setGames(importedConfig.games);
            setSelectedLocation((importedConfig.locations || [])[0] || '');
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
    isLocationsOpen,
    isTournamentStartOpen,
    sortedDivisions,
    sortedTeams,
    resolvedGames,
    priorGameNumbers,
    newLocationName,
    selectedLocation,
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
    setIsDivisionsOpen,
    setIsTeamsOpen,
    setIsGamesOpen,
    setIsLocationsOpen,
    setIsTournamentStartOpen,
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

export default useDrawEditor;
