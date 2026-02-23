import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LocationStartTimes } from '../utils/expectedStartTimes';

type UseSyncedLocationStartTimesResult = [
  LocationStartTimes,
  Dispatch<SetStateAction<LocationStartTimes>>,
];

export const useSyncedLocationStartTimes = (
  isDisplayOnly: boolean
): UseSyncedLocationStartTimesResult => {
  const [locationStartTimes, setLocationStartTimes] = useState<LocationStartTimes>(() => {
    const saved = localStorage.getItem('teamTimerLocationStartTimes');
    if (!saved) {
      return {};
    }

    try {
      return JSON.parse(saved) as LocationStartTimes;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (isDisplayOnly) {
      return;
    }
    localStorage.setItem('teamTimerLocationStartTimes', JSON.stringify(locationStartTimes));
  }, [locationStartTimes, isDisplayOnly]);

  useEffect(() => {
    if (!isDisplayOnly) {
      return;
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== 'teamTimerLocationStartTimes' || !event.newValue) {
        return;
      }

      try {
        setLocationStartTimes(JSON.parse(event.newValue) as LocationStartTimes);
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [isDisplayOnly]);

  return [locationStartTimes, setLocationStartTimes];
};
