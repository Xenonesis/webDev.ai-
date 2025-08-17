import { type MetaFunction } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { motion } from 'framer-motion';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [{ title: 'webdev' }, { name: 'description', content: 'Talk with webdev, an AI assistant for web development' }];
};

/**
 * Landing page component for webdev
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <motion.div
      className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Enhanced background with subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none webdev-background-overlay" />

      <BackgroundRays />
      <Header />

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </motion.div>
    </motion.div>
  );
}
