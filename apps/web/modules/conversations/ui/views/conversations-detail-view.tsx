'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
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
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react';

type ConversationsDetailViewProps = {
  conversationId: Id<'conversations'>;
};

const formSchema = z.object({
  message: z.string().min(1, 'Message is required')
});

export const ConversationsDetailView = ({
  conversationId
}: ConversationsDetailViewProps) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId
      ? {
          threadId: conversation.threadId
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

  const createMessage = useMutation(api.private.messages.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: data.message
      });
      form.reset();
      setTimeout(() => {
        form.setFocus('message');
      }, 0);
    } catch (error) {
      console.error(error);
      form.setError('message', {
        type: 'server',
        message: 'Failed to send. Please try again.'
      });
    }
  };

  return (
    <div className='bg-muted flex h-full flex-1 flex-col'>
      <header className='bg-background flex items-center justify-between border-b p-2.5'>
        <Button size='sm' variant='ghost'>
          <MoreHorizontalIcon />
        </Button>
      </header>

      <Conversation className='max-h-[calc(100vh-159px-64px-44px-22px)] flex-1'>
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
              // reverse the role, we are assistant, user is the user
              from={message.role === 'user' ? 'assistant' : 'user'}
            >
              <MessageContent>
                <Response>{message.content}</Response>
              </MessageContent>
              {message.role === 'user' && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? 'user'}
                  size={32}
                />
              )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

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
                    form.formState.isSubmitting
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
                      : 'Type your response as an operator...'
                  }
                  value={field.value}
                />
              )}
            />
            <PromptInputToolbar>
              <PromptInputButton>
                <Wand2Icon size={16} />
                Enhance
              </PromptInputButton>
              <PromptInputSubmit
                disabled={
                  conversation?.status === 'resolved' ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting
                }
                status={form.formState.isSubmitting ? 'submitted' : 'ready'}
                type='submit'
              />
            </PromptInputToolbar>
          </PromptInput>
        </Form>
      </div>
    </div>
  );
};
