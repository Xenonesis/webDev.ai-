import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { toggleDynamicTheme, dynamicThemeEnabledStore } from '~/lib/stores/theme';

export function Header() {
  const chat = useStore(chatStore);
  const dynamicThemeEnabled = useStore(dynamicThemeEnabledStore);

  return (
    <header
      className={classNames(
        'flex items-center px-6 py-4 h-[var(--header-height)]',
        'bg-gradient-to-r from-white/8 via-white/5 to-transparent',
        'backdrop-blur-xl border-b transition-all duration-300',
        {
          'border-white/15 shadow-md shadow-purple-500/10': !chat.started,
          'border-white/20 shadow-lg shadow-purple-500/15': chat.started,
        },
      )}
    >
      <div className="flex items-center gap-3 z-logo cursor-pointer group">
        <div className="i-ph:sidebar-simple-duotone text-xl text-white/80 group-hover:text-white transition-colors duration-200" />
        <a
          href="/"
          className="text-2xl font-semibold flex items-center transition-all duration-200 hover:scale-105 group"
        >
          <span className="dynamic-branding font-bold tracking-tight relative">
            webdev.ai
            {/* Enhanced visibility backdrop for branding */}
            <span className="absolute inset-0 bg-black/20 rounded-lg blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </span>
        </a>
      </div>

      {/* Dynamic Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleDynamicTheme}
          className={classNames(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
            'backdrop-blur-md border',
            dynamicThemeEnabled
              ? 'bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30'
              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white',
          )}
          title={dynamicThemeEnabled ? 'Disable Dynamic Themes' : 'Enable Dynamic Themes'}
        >
          <div
            className={classNames(
              'w-2 h-2 rounded-full transition-all duration-300',
              dynamicThemeEnabled ? 'bg-purple-400 animate-pulse' : 'bg-white/50',
            )}
          />
          <span className="hidden sm:inline">{dynamicThemeEnabled ? 'Dynamic' : 'Static'}</span>
        </button>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-6 truncate text-center">
            <ClientOnly>
              {() => (
                <div className="text-white/80 font-medium">
                  <ChatDescription />
                </div>
              )}
            </ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-2">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
