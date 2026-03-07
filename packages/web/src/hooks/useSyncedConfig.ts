import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TimerConfig, DEFAULT_CONFIG, hydrateConfig } from '@team-timer/core';

type UseSyncedConfigResult = [TimerConfig, Dispatch<SetStateAction<TimerConfig>>];

export const useSyncedConfig = (isDisplayOnly: boolean): UseSyncedConfigResult => {
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('teamTimerConfig');
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
    localStorage.setItem('teamTimerConfig', JSON.stringify(config));
  }, [config, isDisplayOnly]);

  useEffect(() => {
    if (!isDisplayOnly) {
      return;
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== 'teamTimerConfig' || !event.newValue) {
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
