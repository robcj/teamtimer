import React from 'react';
import { Game } from '../types';

interface GameHeaderProps {
  game: Game;
  currentIndex: number;
  totalGames: number;
}

function GameHeader({ game, currentIndex, totalGames }: GameHeaderProps) {
  return (
    <div className="game-info">
      <h2>
        Game {currentIndex + 1} of {totalGames}: {game.team1} vs {game.team2}
      </h2>
    </div>
  );
}

export default GameHeader;
