import React from 'react';
import { ViewType } from '../types';

interface AppHeaderProps {
  view: ViewType;
  competitionName?: string;
  onOpenScores: () => void;
  onOpenDraw: () => void;
  onOpenConfig: () => void;
  onViewTimer: () => void;
  onOpenSecondScreen?: () => void;
  onResetAll?: () => void;
  canToggleLayout?: boolean;
  isSplitLayout?: boolean;
  onSetSingleLayout?: () => void;
  onSetSplitLayout?: () => void;
}

function AppHeader({
  view,
  competitionName,
  onOpenScores,
  onOpenDraw,
  onOpenConfig,
  onViewTimer,
  onOpenSecondScreen,
  onResetAll,
  canToggleLayout = false,
  isSplitLayout = false,
  onSetSingleLayout,
  onSetSplitLayout,
}: AppHeaderProps) {
  const closeMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
    }
  };

  return (
    <header className="app-header">
      <div className="header-title">
        <h1>Team Timer</h1>
      </div>
      {competitionName && <p className="competition-name">{competitionName}</p>}
      <details className="header-menu">
        <summary className="config-button header-menu-trigger">Menu ▾</summary>
        <div className="header-menu-list">
          <button
            onClick={event => {
              closeMenu(event);
              onViewTimer();
            }}
            className={`header-menu-item ${view === 'timer' ? 'active' : ''}`}
          >
            Timer
          </button>
          <button
            onClick={event => {
              closeMenu(event);
              onOpenScores();
            }}
            className={`header-menu-item ${view === 'scores' ? 'active' : ''}`}
          >
            Game Scores
          </button>
          <button
            onClick={event => {
              closeMenu(event);
              onOpenDraw();
            }}
            className={`header-menu-item ${view === 'draw' ? 'active' : ''}`}
          >
            Draw
          </button>
          <button
            onClick={event => {
              closeMenu(event);
              onOpenConfig();
            }}
            className={`header-menu-item ${view === 'config' ? 'active' : ''}`}
          >
            Configuration
          </button>
          {canToggleLayout && onSetSingleLayout && onSetSplitLayout && (
            <>
              <button
                onClick={event => {
                  closeMenu(event);
                  onSetSingleLayout();
                }}
                className={`header-menu-item ${!isSplitLayout ? 'active' : ''}`}
              >
                Single
              </button>
              <button
                onClick={event => {
                  closeMenu(event);
                  onSetSplitLayout();
                }}
                className={`header-menu-item ${isSplitLayout ? 'active' : ''}`}
              >
                Split
              </button>
            </>
          )}
          {onOpenSecondScreen && (
            <button
              onClick={event => {
                closeMenu(event);
                onOpenSecondScreen();
              }}
              className="header-menu-item"
            >
              Second Screen
            </button>
          )}
          {onResetAll && (
            <button
              onClick={event => {
                closeMenu(event);
                onResetAll();
              }}
              className="header-menu-item"
            >
              Reset All
            </button>
          )}
        </div>
      </details>
    </header>
  );
}

export default AppHeader;
