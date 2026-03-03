import React from 'react';
import { ViewType } from '../types';

interface AppHeaderProps {
  view: ViewType;
  competitionName?: string;
  globalControlLabel?: string;
  headerStatusText?: string;
  onOpenScores: () => void;
  onOpenSetup: () => void;
  onViewTimer: () => void;
  onGlobalControl?: () => void;
  onOpenSecondScreen?: () => void;
  onResetAll?: () => void;
  onClearAllData?: () => void;
  canToggleLayout?: boolean;
  isSplitLayout?: boolean;
  onSetSingleLayout?: () => void;
  onSetSplitLayout?: () => void;
}

function AppHeader({
  view,
  competitionName,
  globalControlLabel,
  headerStatusText,
  onOpenScores,
  onOpenSetup,
  onViewTimer,
  onGlobalControl,
  onOpenSecondScreen,
  onResetAll,
  onClearAllData,
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
        <h1>
          Team
          <br />
          Timer
        </h1>
      </div>
      {competitionName && (
        <p className="competition-name">
          {competitionName}{' '}
          {headerStatusText && <small className="header-status-hint">{headerStatusText}</small>}
        </p>
      )}

      <div className="header-actions">
        {globalControlLabel && onGlobalControl && (
          <button className="config-button" onClick={onGlobalControl}>
            {globalControlLabel}
          </button>
        )}
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
              Results
            </button>
            <button
              onClick={event => {
                closeMenu(event);
                onOpenSetup();
              }}
              className={`header-menu-item ${view === 'setup' ? 'active' : ''}`}
            >
              Setup
            </button>
            {canToggleLayout && onSetSingleLayout && isSplitLayout && (
              <button
                onClick={event => {
                  closeMenu(event);
                  onSetSingleLayout();
                }}
                className={`header-menu-item ${!isSplitLayout ? 'active' : ''}`}
              >
                Single Scoreboard
              </button>
            )}

            {canToggleLayout && onSetSplitLayout && !isSplitLayout && (
              <button
                onClick={event => {
                  closeMenu(event);
                  onSetSplitLayout();
                }}
                className={`header-menu-item ${isSplitLayout ? 'active' : ''}`}
              >
                Split Scoreboard
              </button>
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
            {onClearAllData && (
              <button
                onClick={event => {
                  closeMenu(event);
                  onClearAllData();
                }}
                className="header-menu-item"
              >
                Clear All Data
              </button>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}

export default AppHeader;
