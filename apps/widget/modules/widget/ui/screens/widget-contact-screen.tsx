import { useState, useRef, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import {
  Suggestion,
  Suggestions
} from '@workspace/ui/components/ai-elements/suggestion';
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
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  MenuIcon,
  MicIcon,
  MicOffIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  Wand2Icon
} from 'lucide-react';
import Link from 'next/link';
import { useVapi } from '@/modules/widget/hooks/use-vapi';
import {
  useConversationActions,
  useConversationId
} from '@/modules/widget/store/use-conversation-store';
import { useScreenActions } from '@/modules/widget/store/use-screen-store';
import { useWidgetSettings } from '@/modules/widget/store/use-widget-settings-store';
import { WidgetFooter } from '@/modules/widget/ui/components/widget-footer';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetContactScreen = () => {
  // states
  const widgetSettings = useWidgetSettings();
  const [isCopied, setIsCopied] = useState(false);
  // actions
  const { setScreen } = useScreenActions();
  const { setConversationId } = useConversationActions();

  const handleOnBack = () => {
    setConversationId(null);
    setScreen(WIDGET_SCREENS.SELECTION);
  };

  const phoneNumber = useMemo(() => {
    return widgetSettings?.vapiSettings.phoneNumber;
  }, [widgetSettings]);

  const handleCopyPhoneNumber = async () => {
    if (!phoneNumber) return;

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setIsCopied(true);
      toast.success('Phone number copied to clipboard');
    } catch (error) {
      console.error(`Error copying phone number: ${error}`);
      toast.error('Failed to copy phone number');
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <>
      <WidgetHeader className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <Button size='icon' variant='transparent' onClick={handleOnBack}>
            <ArrowLeftIcon className='size-4' />
          </Button>
          <p className='text-lg font-medium'>Contact</p>
        </div>
      </WidgetHeader>

      <div className='flex h-full flex-1 flex-col items-center justify-center gap-y-4 py-6'>
        <div className='bg-background flex items-center justify-center rounded-full border p-3'>
          <PhoneIcon className='text-muted-foreground size-6' />
        </div>
        <p className='text-muted-foreground'>Avaiable 24/7</p>
        <div className='flex items-center gap-x-2'>
          <p className='text-2xl font-bold'>{phoneNumber}</p>
          <Button
            size='icon'
            asChild
            onClick={handleCopyPhoneNumber}
            variant='transparent'
            className='size-4'
          >
            {isCopied ? (
              <CheckIcon className='size-4' />
            ) : (
              <CopyIcon className='size-4' />
            )}
          </Button>
        </div>
      </div>

      <div className='bg-background border-t p-4'>
        <div className='flex flex-col items-center gap-y-2'>
          <Button size='lg' className='w-full' asChild>
            <Link href={`tel:${phoneNumber}`}>
              <PhoneIcon className='animate-phone-vibrate phone-vibrate size-4' />{' '}
              Call Now
            </Link>
          </Button>
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
