import React, { useEffect, useState } from 'react';
import { ViewType } from '@team-timer/core';
import { isMobileApp } from '../utils/platform';

const OFFLINE_HTML_DOWNLOAD_URL = 'downloads/team-timer-offline.html';
const ANDROID_APP_DOWNLOAD_URL = 'downloads/team-timer.apk';

interface HeaderMenuProps {
  view: ViewType;
  onViewTimer: () => void;
  onOpenScores: () => void;
  onOpenSetup: () => void;
  onOpenGuide: () => void;
  onOpenAbout: () => void;
  canToggleLayout?: boolean;
  isSplitLayout?: boolean;
  onSetSingleLayout?: () => void;
  onSetSplitLayout?: () => void;
  onOpenSecondScreen?: () => void;
  onResetAll?: () => void;
  onClearAllData?: () => void;
}

function HeaderMenu({
  view,
  onViewTimer,
  onOpenScores,
  onOpenSetup,
  onOpenGuide,
  onOpenAbout,
  canToggleLayout = false,
  isSplitLayout = false,
  onSetSingleLayout,
  onSetSplitLayout,
  onOpenSecondScreen,
  onResetAll,
  onClearAllData,
}: HeaderMenuProps) {
  const runningInMobileApp = isMobileApp();
  const [hasAndroidAppDownload, setHasAndroidAppDownload] = useState(false);

  useEffect(() => {
    if (runningInMobileApp) {
      setHasAndroidAppDownload(false);
      return;
    }

    let isCancelled = false;

    const checkAndroidAppDownload = async (): Promise<void> => {
      try {
        const response = await fetch(ANDROID_APP_DOWNLOAD_URL, {
          method: 'HEAD',
          cache: 'no-store',
        });

        if (!isCancelled) {
          setHasAndroidAppDownload(response.ok);
        }
      } catch {
        if (!isCancelled) {
          setHasAndroidAppDownload(false);
        }
      }
    };

    void checkAndroidAppDownload();

    return () => {
      isCancelled = true;
    };
  }, [runningInMobileApp]);

  const closeMenu = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
    let currentElement: HTMLElement | null = event.currentTarget;

    while (currentElement) {
      if (currentElement instanceof HTMLDetailsElement) {
        currentElement.removeAttribute('open');
      }
      currentElement = currentElement.parentElement;
    }
  };

  return (
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
        {onOpenSecondScreen && !runningInMobileApp && (
          <button
            onClick={event => {
              closeMenu(event);
              onOpenSecondScreen();
            }}
            className="header-menu-item"
          >
            Additional Screen
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
        <button
          onClick={event => {
            closeMenu(event);
            onOpenGuide();
          }}
          className={`header-menu-item ${view === 'guide' ? 'active' : ''}`}
        >
          User Guide
        </button>
        <details className="header-menu-submenu">
          <summary className="header-menu-item header-menu-submenu-trigger">Downloads</summary>
          <div className="header-menu-submenu-list">
            <a
              href={OFFLINE_HTML_DOWNLOAD_URL}
              download="team-timer.html"
              onClick={event => {
                closeMenu(event);
              }}
              className="header-menu-item header-menu-submenu-item"
            >
              Single HTML File
            </a>
            {!runningInMobileApp && hasAndroidAppDownload && (
              <a
                href={ANDROID_APP_DOWNLOAD_URL}
                download="team-timer.apk"
                onClick={event => {
                  closeMenu(event);
                }}
                className="header-menu-item header-menu-submenu-item"
              >
                Android App (APK)
              </a>
            )}
          </div>
        </details>
        <button
          onClick={event => {
            closeMenu(event);
            onOpenAbout();
          }}
          className={`header-menu-item ${view === 'about' ? 'active' : ''}`}
        >
          About
        </button>
      </div>
    </details>
  );
}

export default HeaderMenu;
