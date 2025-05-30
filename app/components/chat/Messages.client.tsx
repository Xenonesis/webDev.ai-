import type { Message } from 'ai';
import { Fragment } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { useLocation } from '@remix-run/react';
import { db, chatId } from '~/lib/persistence/useChatHistory';
import { forkChat } from '~/lib/persistence/db';
import { toast } from 'react-toastify';
import { useStore } from '@nanostores/react';
import { profileStore } from '~/lib/stores/profile';
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import styles from './Messages.module.scss';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref: ForwardedRef<HTMLDivElement> | undefined) => {
    const { id, isStreaming = false, messages = [] } = props;
    const location = useLocation();
    const profile = useStore(profileStore);

    const handleRewind = (messageId: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('rewindTo', messageId);
      window.location.search = searchParams.toString();
    };

    const handleFork = async (messageId: string) => {
      try {
        if (!db || !chatId.get()) {
          toast.error('Chat persistence is not available');
          return;
        }

        const urlId = await forkChat(db, chatId.get()!, messageId);
        window.location.href = `/chat/${urlId}`;
      } catch (error) {
        toast.error('Failed to fork chat: ' + (error as Error).message);
      }
    };

    return (
      <div id={id} className={classNames(styles.Messages, props.className)} ref={ref}>
        {messages.length > 0
          ? messages.map((message, index) => {
              const { role, content, id: messageId, annotations } = message;
              const isUserMessage = role === 'user';
              const isFirst = index === 0;
              const isLast = index === messages.length - 1;
              const isHidden = annotations?.includes('hidden');

              if (isHidden) {
                return <Fragment key={index} />;
              }

              return (
                <div
                  key={index}
                  className={classNames(
                    styles.messageContainer,
                    'flex gap-4 p-6 py-5 w-full transition-all duration-300 ease-out',
                    'rounded-2xl border border-white/10 backdrop-blur-sm',
                    'hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10',
                    styles.slideUp,
                    {
                      'bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent': isUserMessage,
                      'bg-gradient-to-br from-white/5 via-white/3 to-transparent': !isUserMessage,
                      'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                        isStreaming && isLast,
                      'mt-6': !isFirst,
                      'ml-auto max-w-[85%]': isUserMessage,
                      'mr-auto max-w-[95%]': !isUserMessage,
                    }
                  )}
                  data-animation-delay={index}
                >
                  {isUserMessage && (
                    <div className="flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-full shrink-0 self-start shadow-lg">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile?.username || 'User'}
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="sync"
                        />
                      ) : (
                        <div className="i-ph:user-fill text-xl" />
                      )}
                    </div>
                  )}
                  {!isUserMessage && (
                    <div className="flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shrink-0 self-start shadow-lg">
                      <div className="i-ph:robot text-xl" />
                    </div>
                  )}
                  <div className="grid grid-col-1 w-full min-w-0">
                    {isUserMessage ? (
                      <UserMessage content={content} />
                    ) : (
                      <AssistantMessage
                        content={content}
                        annotations={message.annotations}
                        messageId={messageId}
                        onRewind={handleRewind}
                        onFork={handleFork}
                      />
                    )}
                  </div>
                </div>
              );
            })
          : null}
        {isStreaming && (
          <div className="flex items-center justify-center w-full mt-6 mb-4" role="status" aria-live="polite">
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className={styles.loadingSpinner} aria-hidden="true"></div>
              <span className="text-sm text-white/70 font-medium">webdev.ai is thinking...</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);
