'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';
import { useAction, useMutation, useQuery } from 'convex/react';
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@workspace/ui/components/resizable';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { cn } from '@workspace/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react';
import { ConversationsMetadata } from '@/modules/conversations/ui/components/conversations-metadata';
import { ConversationsStatusButton } from '@/modules/conversations/ui/components/conversations-status-button';

type ConversationsDetailViewProps = {
  conversationId: Id<'conversations'>;
};

const formSchema = z.object({
  message: z.string().min(1, 'Message is required')
});

export const ConversationsDetailView = ({
  conversationId
}: ConversationsDetailViewProps) => {
  const [isPendingUpdateStatus, setIsPendingUpdateStatus] = useState(false);
  const [isPendingEnhanceResponse, setIsPendingEnhanceResponse] =
    useState(false);

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

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );

  const handleToggleStatusButton = async () => {
    if (!conversation) return;

    const newStatus =
      conversation.status === 'resolved'
        ? 'unresolved'
        : conversation.status === 'unresolved'
          ? 'escalated'
          : 'resolved';

    setIsPendingUpdateStatus(true);

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus
      });

      toast.success('Conversation status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update conversation status');
    } finally {
      setIsPendingUpdateStatus(false);
    }
  };

  const callEnhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    if (!conversation) return;

    setIsPendingEnhanceResponse(true);

    try {
      const response = await callEnhanceResponse({
        threadId: conversation.threadId,
        prompt: form.getValues('message')
      });
      form.setValue('message', response);
    } catch (err) {
      console.error(err);
      toast.error('Failed to enhance response');
    } finally {
      setIsPendingEnhanceResponse(false);
    }
  };

  if (conversation === undefined || messages.status === 'LoadingFirstPage') {
    return <ConversationDetailViewSkeleton />;
  }

  return (
    <ResizablePanelGroup direction='horizontal' className='h-full flex-1'>
      <ResizablePanel defaultSize={75} className='h-full'>
        <div className='bg-muted flex h-full flex-1 flex-col'>
          <header className='bg-background flex items-center justify-between border-b p-2.5'>
            <Button size='sm' variant='ghost'>
              <MoreHorizontalIcon />
            </Button>
            {conversation && (
              <ConversationsStatusButton
                status={conversation.status}
                onClick={handleToggleStatusButton}
                isSubmitting={isPendingUpdateStatus}
              />
            )}
          </header>

          <Conversation className='max-h-[calc(100vh-159px-64px-44px-30px)] flex-1'>
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
                        form.formState.isSubmitting ||
                        isPendingEnhanceResponse
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
                  <PromptInputButton
                    disabled={
                      conversation?.status === 'resolved' ||
                      isPendingEnhanceResponse ||
                      !form.formState.isValid
                    }
                    onClick={handleEnhanceResponse}
                  >
                    <Wand2Icon size={16} />
                    {isPendingEnhanceResponse ? 'Enhancing...' : 'Enhance'}
                  </PromptInputButton>
                  <PromptInputSubmit
                    disabled={
                      conversation?.status === 'resolved' ||
                      !form.formState.isValid ||
                      form.formState.isSubmitting ||
                      isPendingEnhanceResponse
                    }
                    status={form.formState.isSubmitting ? 'submitted' : 'ready'}
                    type='submit'
                  />
                </PromptInputToolbar>
              </PromptInput>
            </Form>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} maxSize={25} minSize={20}>
        <ConversationsMetadata conversation={conversation} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const ConversationDetailViewSkeleton = () => {
  return (
    <div className='bg-muted flex h-full flex-1 flex-col'>
      <header className='bg-background flex items-center justify-between border-b p-2.5'>
        <Button size='sm' variant='ghost'>
          <MoreHorizontalIcon />
        </Button>
        <Skeleton className='h-8 w-24' />
      </header>

      <Conversation className='max-h-[calc(100vh-159px-64px-44px-22px)] flex-1'>
        <ConversationContent>
          {Array.from({ length: 10 }).map((_, index) => {
            const isUser = index % 2 === 0;
            const widths = ['w-48', 'w-60', 'w-72'];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  'group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]',
                  isUser ? 'is-user' : 'is-assistant flex-row-reverse'
                )}
                key={index}
              >
                <Skeleton className={`h-9 ${width} bg-secondary rounded-lg`} />
                <Skeleton className='bg-secondary size-8 rounded-full' />
              </div>
            );
          })}
        </ConversationContent>
      </Conversation>

      {/* FORM */}
      <div className='p-2'>
        <PromptInput>
          <PromptInputTextarea
            disabled
            placeholder='Type your response as an operator...'
          />
          <PromptInputToolbar>
            <PromptInputButton disabled={true}>
              <Wand2Icon size={16} />
              Enhance
            </PromptInputButton>
            <PromptInputSubmit disabled status='ready' />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};
