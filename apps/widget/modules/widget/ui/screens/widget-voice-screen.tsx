import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@workspace/ui/components/ai-elements/conversation';
import {
  Message,
  MessageContent
} from '@workspace/ui/components/ai-elements/message';
import { Response } from '@workspace/ui/components/ai-elements/response';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { ArrowLeftIcon, Loader2Icon, MicIcon, MicOffIcon } from 'lucide-react';
import { useVapi } from '@/modules/widget/hooks/use-vapi';
import { useConversationActions } from '@/modules/widget/store/use-conversation-store';
import { useScreenActions } from '@/modules/widget/store/use-screen-store';
import { WidgetFooter } from '@/modules/widget/ui/components/widget-footer';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetVoiceScreen = () => {
  // states
  const {
    isConnected,
    isSpeaking,
    isConnecting,
    transcript,
    startCall,
    stopCall
  } = useVapi();

  // actions
  const { setScreen } = useScreenActions();
  const { setConversationId } = useConversationActions();

  const handleOnBack = () => {
    setConversationId(null);
    setScreen(WIDGET_SCREENS.SELECTION);
  };

  return (
    <>
      <WidgetHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='transparent' onClick={handleOnBack}>
            <ArrowLeftIcon className='size-4' />
          </Button>
          <p className='text-lg font-medium'>Voice Call</p>
        </div>
      </WidgetHeader>

      {transcript.length > 0 && (
        <Conversation className='h-full'>
          <ConversationContent>
            {transcript.map((message, index) => (
              <Message key={index} from={message.role}>
                <MessageContent>
                  <Response>{message.text}</Response>
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className='flex h-full flex-1 flex-col items-center justify-center gap-y-4 py-6'>
        <div className='bg-background flex items-center justify-center rounded-full border p-3'>
          <MicIcon className='text-muted-foreground size-6' />
        </div>
        <p className='text-muted-foreground'>Transcript will appear here</p>
      </div>

      <div className='border-t p-4'>
        <div className='flex flex-col items-center gap-y-4'>
          {isConnected && (
            <div className='flex items-center gap-x-2'>
              <div
                className={cn(
                  'size-4 rounded-full',
                  isSpeaking ? 'animate-pulse bg-red-500' : 'bg-green-500'
                )}
              />
              <span className='text-muted-foreground text-sm'>
                {isSpeaking
                  ? 'Assistant Speaking...'
                  : 'Assistant Listening...'}
              </span>
            </div>
          )}

          <div className='flex w-full justify-center'>
            {isConnected ? (
              <Button
                className='w-full'
                size='icon'
                variant='destructive'
                onClick={stopCall}
              >
                <MicOffIcon className='size-4' />
                <span>Stop Call</span>
              </Button>
            ) : (
              <Button
                className='w-full'
                size='icon'
                onClick={startCall}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2Icon className='size-4 animate-spin' />
                    <span>Start Call. Waiting for assistant...</span>
                  </>
                ) : (
                  <>
                    <MicIcon className='size-4' />
                    <span>Start Call</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
