import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';
import { useAction, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@workspace/ui/components/ai-elements/conversation';
import {
  Message,
  MessageContent
} from '@workspace/ui/components/ai-elements/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar
} from '@workspace/ui/components/ai-elements/prompt-input';
import { Response } from '@workspace/ui/components/ai-elements/response';
import { Button } from '@workspace/ui/components/button';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import { Form, FormField } from '@workspace/ui/components/form';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { cn } from '@workspace/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeftIcon,
  MenuIcon,
  MoreHorizontalIcon,
  Wand2Icon
} from 'lucide-react';
import { useContactSessionId } from '@/modules/widget/store/use-contact-session-store';
import {
  useConversationActions,
  useConversationId
} from '@/modules/widget/store/use-conversation-store';
import { useScreenActions } from '@/modules/widget/store/use-screen-store';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

const formSchema = z.object({
  message: z.string().min(1, 'Message is required')
});

export const WidgetChatScreen = () => {
  const conversationId = useConversationId();
  const contactSessionId = useContactSessionId();
  const { setScreen } = useScreenActions();
  const { setConversationId } = useConversationActions();

  const [isPendingCreateMessage, setIsPendingCreateMessage] = useState(false);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          id: conversationId,
          contactSessionId
        }
      : 'skip'
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId
        }
      : 'skip',
    { initialNumItems: 10 }
  );

  const { topEleRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      onLoadMore: messages.loadMore,
      loadSize: 10
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  });

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) return;
    if (conversation.status === 'resolved') return;

    setIsPendingCreateMessage(true);

    try {
      await createMessage({
        prompt: values.message,
        threadId: conversation.threadId,
        contactSessionId
      });
      form.reset();
      setTimeout(() => {
        form.setFocus('message');
      }, 100);
    } catch (error) {
      console.error(error);
      form.setError('message', {
        type: 'server',
        message: 'Failed to send. Please try again.'
      });
    } finally {
      setIsPendingCreateMessage(false);
    }
  };

  const handleOnBack = () => {
    setConversationId(null);
    setScreen(WIDGET_SCREENS.SELECTION);
  };

  return (
    <div className='flex h-full flex-col'>
      <WidgetHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='transparent' onClick={handleOnBack}>
            <ArrowLeftIcon className='size-4' />
          </Button>
          <p className='text-lg font-medium'>Chat</p>
        </div>
        <Button size='icon' variant='transparent'>
          <MenuIcon className='size-4' />
        </Button>
      </WidgetHeader>

      <div className='h-full'>
        <Conversation className='h-[calc(100vh-68px-64px-44px-22px)]'>
          <ConversationContent>
            <InfiniteScrollTrigger
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                ref={topEleRef}
              />

            {toUIMessages(messages.results ?? [])?.map((message: any) => (
              <Message
                key={message.id}
                from={message.role === 'user' ? 'user' : 'assistant'}
              >
                <MessageContent>
                  <Response>{message.content}</Response>
                </MessageContent>
                {message.role === 'assistant' && (
                  <DicebearAvatar
                    seed='assistant'
                    size={32}
                    imageUrl='/logo.svg'
                  />
                )}
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* FORM */}
      <div className='p-2'>
        <Form {...form}>
          <PromptInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === 'resolved'}
              name='message'
              render={({ field }) => (
                <PromptInputTextarea
                  {...form.register('message')}
                  disabled={
                    conversation?.status === 'resolved' ||
                    isPendingCreateMessage
                  }
                  onChange={field.onChange}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === 'resolved'
                      ? 'This conversation has been resolved'
                      : 'Type your message...'
                  }
                  value={field.value}
                />
              )}
            />
            <PromptInputToolbar>
              <div></div>
              <PromptInputSubmit
                disabled={
                  conversation?.status === 'resolved' ||
                  !form.formState.isValid ||
                  isPendingCreateMessage
                }
                status={
                  isPendingCreateMessage
                    ? 'submitted'
                    : form.formState.errors.message
                      ? 'error'
                      : 'ready'
                }
                type='submit'
              />
            </PromptInputToolbar>
          </PromptInput>
        </Form>
      </div>
    </div>
  );
};
