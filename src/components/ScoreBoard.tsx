import React from 'react';
import { Scores, TimerConfig, Game } from '../types';

interface ScoreBoardProps {
  config: TimerConfig;
  game: Game;
  scores: Scores;
  onIncrement: (team: keyof Scores) => void;
  onDecrement: (team: keyof Scores) => void;
}

function ScoreBoard({ config, game, scores, onIncrement, onDecrement }: ScoreBoardProps) {
  return (
    <div className="score-display">
      <div className="score-team left-team">
        <div className="team-color-label">{config.leftTeamLabel}</div>
        <div className="team-name">{game.team1}</div>
        <div className="score-row">
          <button onClick={() => onDecrement('team1')} className="score-btn minus">
            -
          </button>
          <div className="score-value">{scores.team1}</div>
          <button onClick={() => onIncrement('team1')} className="score-btn plus">
            +
          </button>
        </div>
      </div>

      <div className="score-team right-team">
        <div className="team-color-label">{config.rightTeamLabel}</div>
        <div className="team-name">{game.team2}</div>
        <div className="score-row">
          <button onClick={() => onDecrement('team2')} className="score-btn minus">
            -
          </button>
          <div className="score-value">{scores.team2}</div>
          <button onClick={() => onIncrement('team2')} className="score-btn plus">
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
