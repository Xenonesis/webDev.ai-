import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { DynamicThemeIndicator } from '~/components/ui/DynamicThemeIndicator';

export const meta: MetaFunction = () => {
  return [
    { title: 'webdev.ai - AI-Powered Web Development' },
    { name: 'description', content: 'Build web applications with AI assistance. webdev.ai helps you create, debug, and deploy web projects faster than ever.' }
  ];
};

export const loader = () => json({});

/**
 * Landing page component for webdev.ai
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      <ClientOnly>
        {() => <DynamicThemeIndicator />}
      </ClientOnly>
    </div>
  );
}
