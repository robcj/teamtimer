import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TimerConfig, DEFAULT_CONFIG, hydrateConfig } from '@team-timer/core';
import { TEAM_TIMER_CONFIG_STORAGE_KEY } from '../utils/appBootstrap';

type UseSyncedConfigResult = [TimerConfig, Dispatch<SetStateAction<TimerConfig>>];

export const useSyncedConfig = (isDisplayOnly: boolean): UseSyncedConfigResult => {
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem(TEAM_TIMER_CONFIG_STORAGE_KEY);
    if (!saved) {
      return DEFAULT_CONFIG;
    }

    try {
      return hydrateConfig(JSON.parse(saved) as Partial<TimerConfig>);
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    if (isDisplayOnly) {
      return;
    }
    localStorage.setItem(TEAM_TIMER_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config, isDisplayOnly]);

  useEffect(() => {
    if (!isDisplayOnly) {
      return;
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== TEAM_TIMER_CONFIG_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as Partial<TimerConfig>;
        setConfig(hydrateConfig(parsed));
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [isDisplayOnly]);

  return [config, setConfig];
};
