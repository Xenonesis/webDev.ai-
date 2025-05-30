import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import {
  dynamicThemeStore,
  dynamicThemeEnabledStore,
  setDynamicTheme,
  applyDynamicTheme,
  removeDynamicTheme,
  DYNAMIC_THEMES,
  type DynamicTheme,
} from '~/lib/stores/theme';

const THEME_CYCLE_INTERVAL = 30000; // 30 seconds
const THEME_ORDER: DynamicTheme[] = ['cosmic', 'aurora', 'nebula', 'galaxy', 'stellar'];

export function useDynamicTheme() {
  const currentTheme = useStore(dynamicThemeStore);
  const isEnabled = useStore(dynamicThemeEnabledStore);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(THEME_CYCLE_INTERVAL);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle to next theme
  const cycleToNextTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    const nextTheme = THEME_ORDER[nextIndex];
    setDynamicTheme(nextTheme);
    setTimeRemaining(THEME_CYCLE_INTERVAL);
  };

  // Cycle to previous theme
  const cycleToPreviousTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme);
    const prevIndex = currentIndex === 0 ? THEME_ORDER.length - 1 : currentIndex - 1;
    const prevTheme = THEME_ORDER[prevIndex];
    setDynamicTheme(prevTheme);
    setTimeRemaining(THEME_CYCLE_INTERVAL);
  };

  // Start auto-cycling
  const startCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isPaused && isEnabled) {
        cycleToNextTheme();
      }
    }, THEME_CYCLE_INTERVAL);

    // Countdown timer for UI feedback
    countdownRef.current = setInterval(() => {
      if (!isPaused && isEnabled) {
        setTimeRemaining((prev) => {
          const newTime = prev - 1000;
          return newTime <= 0 ? THEME_CYCLE_INTERVAL : newTime;
        });
      }
    }, 1000);
  };

  // Stop auto-cycling
  const stopCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // Pause/resume cycling
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Manual theme selection
  const selectTheme = (theme: DynamicTheme) => {
    setDynamicTheme(theme);
    setTimeRemaining(THEME_CYCLE_INTERVAL);
  };

  // Initialize and manage cycling
  useEffect(() => {
    if (isEnabled && !isPaused) {
      startCycling();
      applyDynamicTheme(currentTheme);
    } else {
      stopCycling();
      if (!isEnabled) {
        removeDynamicTheme();
      }
    }

    return () => {
      stopCycling();
    };
  }, [isEnabled, isPaused, currentTheme]);

  // Apply theme on mount if enabled
  useEffect(() => {
    if (isEnabled) {
      applyDynamicTheme(currentTheme);
    }
  }, []);

  return {
    currentTheme,
    isEnabled,
    isPaused,
    timeRemaining,
    themes: DYNAMIC_THEMES,
    themeOrder: THEME_ORDER,
    cycleToNextTheme,
    cycleToPreviousTheme,
    togglePause,
    selectTheme,
    startCycling,
    stopCycling,
  };
}
