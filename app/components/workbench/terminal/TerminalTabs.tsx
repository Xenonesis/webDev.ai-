import { useStore } from '@nanostores/react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Panel, type ImperativePanelHandle } from 'react-resizable-panels';
import { IconButton } from '~/components/ui/IconButton';
import { shortcutEventEmitter } from '~/lib/hooks';
import { themeStore } from '~/lib/stores/theme';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { Terminal, type TerminalRef } from './Terminal';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('Terminal');

const MAX_TERMINALS = 3;
export const DEFAULT_TERMINAL_SIZE = 25;

export const TerminalTabs = memo(() => {
  const showTerminal = useStore(workbenchStore.showTerminal);
  const theme = useStore(themeStore);

  const terminalRefs = useRef<Array<TerminalRef | null>>([]);
  const terminalPanelRef = useRef<ImperativePanelHandle>(null);
  const terminalToggledByShortcut = useRef(false);

  const [activeTerminal, setActiveTerminal] = useState(0);
  const [terminalCount, setTerminalCount] = useState(1);

  const addTerminal = () => {
    if (terminalCount < MAX_TERMINALS) {
      setTerminalCount(terminalCount + 1);
      setActiveTerminal(terminalCount);
    }
  };

  useEffect(() => {
    const { current: terminal } = terminalPanelRef;

    if (!terminal) {
      return;
    }

    const isCollapsed = terminal.isCollapsed();

    if (!showTerminal && !isCollapsed) {
      terminal.collapse();
    } else if (showTerminal && isCollapsed) {
      terminal.resize(DEFAULT_TERMINAL_SIZE);
    }

    terminalToggledByShortcut.current = false;
  }, [showTerminal]);

  useEffect(() => {
    const unsubscribeFromEventEmitter = shortcutEventEmitter.on('toggleTerminal', () => {
      terminalToggledByShortcut.current = true;
    });

    const unsubscribeFromThemeStore = themeStore.subscribe(() => {
      for (const ref of Object.values(terminalRefs.current)) {
        ref?.reloadStyles();
      }
    });

    return () => {
      unsubscribeFromEventEmitter();
      unsubscribeFromThemeStore();
    };
  }, []);

  return (
    <Panel
      ref={terminalPanelRef}
      defaultSize={showTerminal ? DEFAULT_TERMINAL_SIZE : 0}
      minSize={10}
      collapsible
      onExpand={() => {
        if (!terminalToggledByShortcut.current) {
          workbenchStore.toggleTerminal(true);
        }
      }}
      onCollapse={() => {
        if (!terminalToggledByShortcut.current) {
          workbenchStore.toggleTerminal(false);
        }
      }}
    >
      <div className="h-full">
        <div className="bg-bolt-elements-terminals-background h-full flex flex-col rounded-xl overflow-hidden border border-white/10 dark:border-gray-800/50 shadow-xl">
          <div className="flex items-center bg-gradient-to-r from-purple-50/30 to-violet-50/30 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-white/10 dark:border-gray-800/50 gap-2 min-h-[42px] px-4 py-2">
            {Array.from({ length: terminalCount + 1 }, (_, index) => {
              const isActive = activeTerminal === index;

              return (
                <React.Fragment key={index}>
                  {index == 0 ? (
                    <button
                      type="button"
                      key={index}
                      className={classNames(
                        'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full transition-all duration-200',
                        {
                          'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shadow-sm':
                            isActive,
                          'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400':
                            !isActive,
                        },
                      )}
                      onClick={() => setActiveTerminal(index)}
                    >
                      <div className="i-ph:terminal-window-duotone text-lg" />
                      webdev.ai Terminal
                    </button>
                  ) : (
                    <React.Fragment>
                      <button
                        type="button"
                        key={index}
                        className={classNames(
                          'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full transition-all duration-200',
                          {
                            'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 shadow-sm': isActive,
                            'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400':
                              !isActive,
                          },
                        )}
                        onClick={() => setActiveTerminal(index)}
                      >
                        <div className="i-ph:terminal-window-duotone text-lg" />
                        Terminal {terminalCount > 1 && index}
                      </button>
                    </React.Fragment>
                  )}
                </React.Fragment>
              );
            })}
            {terminalCount < MAX_TERMINALS && <IconButton icon="i-ph:plus" size="md" onClick={addTerminal} />}
            <IconButton
              className="ml-auto"
              icon="i-ph:caret-down"
              title="Close"
              size="md"
              onClick={() => workbenchStore.toggleTerminal(false)}
            />
          </div>
          {Array.from({ length: terminalCount + 1 }, (_, index) => {
            const isActive = activeTerminal === index;

            logger.debug(`Starting webdev.ai terminal [${index}]`);

            if (index == 0) {
              return (
                <Terminal
                  key={index}
                  id={`terminal_${index}`}
                  className={classNames('h-full overflow-hidden modern-scrollbar-invert', {
                    hidden: !isActive,
                  })}
                  ref={(ref) => {
                    terminalRefs.current.push(ref);
                  }}
                  onTerminalReady={(terminal) => workbenchStore.attachBoltTerminal(terminal)}
                  onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
                  theme={theme}
                />
              );
            } else {
              return (
                <Terminal
                  key={index}
                  id={`terminal_${index}`}
                  className={classNames('modern-scrollbar h-full overflow-hidden', {
                    hidden: !isActive,
                  })}
                  ref={(ref) => {
                    terminalRefs.current.push(ref);
                  }}
                  onTerminalReady={(terminal) => workbenchStore.attachTerminal(terminal)}
                  onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
                  theme={theme}
                />
              );
            }
          })}
        </div>
      </div>
    </Panel>
  );
});
