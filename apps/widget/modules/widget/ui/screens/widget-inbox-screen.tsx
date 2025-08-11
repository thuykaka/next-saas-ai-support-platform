import { formatDistanceToNow } from 'date-fns';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { ConversationStatusIcon } from '@workspace/ui/components/conversation-status-icon';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import { useContactSessionId } from '@/modules/widget/store/use-contact-session-store';
import { useConversationActions } from '@/modules/widget/store/use-conversation-store';
import { useScreenActions } from '@/modules/widget/store/use-screen-store';
import { WidgetFooter } from '@/modules/widget/ui/components/widget-footer';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetInboxScreen = () => {
  const contactSessionId = useContactSessionId();
  const { setScreen } = useScreenActions();
  const { setConversationId } = useConversationActions();

  const {
    results: conversations,
    status,
    isLoading,
    loadMore
  } = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId
        }
      : 'skip',
    { initialNumItems: 10 }
  );

  const { topEleRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: status,
      onLoadMore: loadMore,
      loadSize: 10
    });

  const handleOnBack = () => {
    setScreen(WIDGET_SCREENS.SELECTION);
  };

  return (
    <>
      <WidgetHeader>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='transparent' onClick={handleOnBack}>
            <ArrowLeftIcon className='size-4' />
          </Button>
          <p className='text-lg font-medium'>Inbox</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col gap-y-2 overflow-y-auto p-4'>
        {isLoading ? (
          <ConversationSkeleton />
        ) : conversations.length > 0 ? (
          <>
            {conversations.map((conversation) => (
              <Button
                key={conversation._id}
                className='h-20 w-full justify-between'
                onClick={() => {
                  setConversationId(conversation._id);
                  setScreen(WIDGET_SCREENS.CHAT);
                }}
                variant='outline'
              >
                <div className='flex w-full flex-col gap-4 overflow-hidden text-start'>
                  <div className='flex w-full items-center justify-between gap-x-2'>
                    <p className='text-muted-foreground text-xs'>Chat</p>
                    <p className='text-muted-foreground text-xs'>
                      {formatDistanceToNow(
                        new Date(conversation._creationTime)
                      )}
                    </p>
                  </div>
                  <div className='flex w-full items-center justify-between gap-x-2'>
                    <p className='truncate text-sm'>
                      {conversation.lastMessage?.text}
                    </p>
                    <ConversationStatusIcon
                      status={conversation.status}
                      className='shrink-0'
                    />
                  </div>
                </div>
              </Button>
            ))}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topEleRef}
            />
          </>
        ) : (
          <div className='flex flex-1 flex-col items-center justify-center gap-y-4 p-4'>
            <p className='text-sm'>No conversations found</p>
          </div>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};

const ConversationSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Skeleton key={index} className='shadow-xs h-20 w-full border px-4 py-2' />
  ));
};
