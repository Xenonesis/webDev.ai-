import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { motion } from 'framer-motion';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <motion.header
      className={classNames(
        'flex items-center p-5 border-b h-[var(--header-height)] relative overflow-hidden',
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        }
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 webdev-header-gradient webdev-gradient-animated opacity-10 pointer-events-none" />

      {/* Logo section with enhanced animations */}
      <motion.div
        className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer relative z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div
          className="i-ph:sidebar-simple-duotone text-xl"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        />
        <motion.a
          href="/"
          className="text-2xl font-semibold flex items-center relative webdev-logo-gradient"
          whileHover={{
            textShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
          }}
        >
          webdev
        </motion.a>
      </motion.div>

      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <motion.div
          className="flex items-center flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary relative z-10">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-1 relative z-10">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </motion.div>
      )}
    </motion.header>
  );
}
