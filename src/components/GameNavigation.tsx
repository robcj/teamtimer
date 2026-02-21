import React from 'react';
import { Game, Scores } from '../types';

interface PreviousGameSummary {
  game: Game;
  score: Scores | null;
}

interface GameNavigationProps {
  currentGameIndex: number;
  totalGames: number;
  onPrevGame: () => void;
  onResetGame: () => void;
  onNextGame: () => void;
  nextGameStartTime: string;
  previousGame: PreviousGameSummary | null;
}

function GameNavigation({
  currentGameIndex,
  totalGames,
  onPrevGame,
  onResetGame,
  onNextGame,
  nextGameStartTime,
  previousGame,
}: GameNavigationProps) {
  if (totalGames === 0) {
    return null;
  }

  return (
    <div className="game-navigation">
      <div className="last-game-summary" aria-live="polite">
        <span className="last-game-label">Last game:</span>{' '}
        <span className="last-game-result">
          {previousGame?.game.team1} <b>{previousGame?.score?.team1 ?? '—'}</b> -{' '}
          <b>{previousGame?.score?.team2 ?? '—'}</b> {previousGame?.game.team2}
        </span>
      </div>
      {nextGameStartTime && (
        <div className="next-game-time">Next game starts at: {nextGameStartTime}</div>
      )}

      <div className="game-navigation-buttons">
        <button onClick={onPrevGame} disabled={currentGameIndex === 0} className="nav-btn">
          Previous Game
        </button>
        <button onClick={onResetGame} className="nav-btn">
          First Game
        </button>
        <button
          onClick={onNextGame}
          disabled={currentGameIndex >= totalGames - 1}
          className="nav-btn"
        >
          Next Game
        </button>
      </div>
    </div>
  );
}

export default GameNavigation;
