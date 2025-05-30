import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { useDynamicTheme } from '~/lib/hooks/useDynamicTheme';
import { toggleDynamicTheme, dynamicThemeEnabledStore } from '~/lib/stores/theme';
import { classNames } from '~/utils/classNames';

export function DynamicThemeIndicator() {
  const {
    currentTheme,
    isEnabled,
    isPaused,
    timeRemaining,
    themes,
    themeOrder,
    cycleToNextTheme,
    cycleToPreviousTheme,
    togglePause,
    selectTheme,
  } = useDynamicTheme();

  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getProgressPercentage = () => {
    return ((30000 - timeRemaining) / 30000) * 100;
  };

  if (!isEnabled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          type="button"
          onClick={toggleDynamicTheme}
          className={classNames(
            'flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'text-white text-sm font-medium',
            'hover:bg-white/20 transition-all duration-300',
            'shadow-lg hover:shadow-xl'
          )}
          title="Enable Dynamic Themes"
        >
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>Enable Dynamic Themes</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="flex flex-col items-end gap-2">
        {/* Expanded Theme Selector */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={classNames(
                'flex flex-col gap-2 p-3 rounded-xl',
                'bg-white/10 backdrop-blur-md border border-white/20',
                'shadow-xl'
              )}
            >
              <div className="text-xs text-white/80 font-medium mb-1">Select Theme</div>
              <div className="grid grid-cols-2 gap-2">
                {themeOrder.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => selectTheme(theme)}
                    className={classNames(
                      'flex flex-col items-center gap-1 p-2 rounded-lg text-xs',
                      'transition-all duration-200',
                      currentTheme === theme
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background: themes[theme].primaryGradient,
                      }}
                    />
                    <span className="font-medium">{themes[theme].name}</span>
                  </button>
                ))}
              </div>
              
              {/* Controls */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={cycleToPreviousTheme}
                  className="flex-1 py-1 px-2 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  title="Previous Theme"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={togglePause}
                  className={classNames(
                    'flex-1 py-1 px-2 text-xs rounded-md transition-colors',
                    isPaused
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                      : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300'
                  )}
                  title={isPaused ? 'Resume Auto-Cycle' : 'Pause Auto-Cycle'}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
                <button
                  type="button"
                  onClick={cycleToNextTheme}
                  className="flex-1 py-1 px-2 text-xs bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  title="Next Theme"
                >
                  →
                </button>
              </div>
              
              <button
                type="button"
                onClick={toggleDynamicTheme}
                className="w-full py-1 px-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
                title="Disable Dynamic Themes"
              >
                Disable
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Indicator */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={classNames(
            'relative flex items-center gap-3 px-4 py-3 rounded-full',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'text-white text-sm font-medium',
            'hover:bg-white/20 transition-all duration-300',
            'shadow-lg hover:shadow-xl',
            isExpanded && 'bg-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Theme Color Indicator */}
          <div className="relative">
            <div
              className="w-4 h-4 rounded-full border-2 border-white/30"
              style={{
                background: themes[currentTheme].primaryGradient,
              }}
            />
            
            {/* Progress Ring */}
            {!isPaused && (
              <svg
                className="absolute inset-0 w-4 h-4 -rotate-90"
                viewBox="0 0 16 16"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray={`${2 * Math.PI * 6}`}
                  strokeDashoffset={`${2 * Math.PI * 6 * (1 - getProgressPercentage() / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
            )}
          </div>

          {/* Theme Info */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{themes[currentTheme].name}</span>
              {isPaused && (
                <span className="text-xs text-yellow-300">⏸</span>
              )}
            </div>
            <div className="text-xs text-white/70">
              {isPaused ? 'Paused' : formatTime(timeRemaining)}
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/70"
          >
            ▼
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
