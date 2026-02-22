import React from 'react';
import { ViewType } from '../types';

interface AppHeaderProps {
  view: ViewType;
  competitionName?: string;
  onOpenScores: () => void;
  onOpenDraw: () => void;
  onOpenConfig: () => void;
  onViewTimer: () => void;
}

function AppHeader({
  view,
  competitionName,
  onOpenScores,
  onOpenDraw,
  onOpenConfig,
  onViewTimer,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>Team Timer</h1>
      </div>
      {competitionName && <p className="competition-name">{competitionName}</p>}
      <div className="header-buttons">
        <button onClick={onViewTimer} className="config-button">
          Timer
        </button>
        <button onClick={onOpenScores} className="config-button scores-header-button">
          Game Scores
        </button>
        <button onClick={onOpenDraw} className="config-button">
          Draw
        </button>
        <button onClick={onOpenConfig} className="config-button">
          Configuration
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
