import { useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useContactSessionId } from '@/modules/widget/store/use-contact-session-store';
import {
  useConversationActions,
  useConversationId
} from '@/modules/widget/store/use-conversation-store';
import { useScreenActions } from '@/modules/widget/store/use-screen-store';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetChatScreen = () => {
  const conversationId = useConversationId();
  const contactSessionId = useContactSessionId();

  const { setScreen } = useScreenActions();
  const { setConversationId } = useConversationActions();

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          id: conversationId,
          contactSessionId
        }
      : 'skip'
  );

  const handleOnBack = () => {
    setConversationId(null);
    setScreen(WIDGET_SCREENS.SELECTION);
  };

  return (
    <>
      <WidgetHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='ghost' onClick={handleOnBack}>
            <ArrowLeftIcon className='size-4' />
          </Button>
          <p className='text-lg font-medium'>Chat</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-4 p-4'>
        {conversation ? (
          <div className='flex flex-col gap-y-4'>
            <p>{conversation.id}</p>
            <p>{conversation.threadId}</p>
            <p>{conversation.status}</p>
          </div>
        ) : null}
      </div>
    </>
  );
};
