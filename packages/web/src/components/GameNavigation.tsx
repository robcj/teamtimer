import React from 'react';
import { Game, Scores } from '@team-timer/core';

interface PreviousGameSummary {
  game: Game;
  score: Scores | null;
  team1Name: string;
  team2Name: string;
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

  const closeCompactMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
    }
  };

  return (
    <div className="game-navigation">
      <div className="last-game-summary" aria-live="polite">
        <span className="last-game-label">Last game:</span>{' '}
        <span className="last-game-result">
          {previousGame?.team1Name} <b>{previousGame?.score?.team1 ?? '—'}</b> -{' '}
          <b>{previousGame?.score?.team2 ?? '—'}</b> {previousGame?.team2Name}
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

      <details className="compact-nav-menu" role="group">
        <summary className="compact-actions-trigger">Game Nav ▾</summary>
        <div className="compact-actions-list">
          <button
            className="compact-action-item"
            disabled={currentGameIndex === 0}
            onClick={event => {
              closeCompactMenu(event);
              onPrevGame();
            }}
          >
            Previous Game
          </button>
          <button
            className="compact-action-item"
            onClick={event => {
              closeCompactMenu(event);
              onResetGame();
            }}
          >
            First Game
          </button>
          <button
            className="compact-action-item"
            disabled={currentGameIndex >= totalGames - 1}
            onClick={event => {
              closeCompactMenu(event);
              onNextGame();
            }}
          >
            Next Game
          </button>
        </div>
      </details>
    </div>
  );
}

export default GameNavigation;
