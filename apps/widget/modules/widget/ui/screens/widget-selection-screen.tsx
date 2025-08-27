import { useMemo, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  ChevronRightIcon,
  Loader2Icon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon
} from 'lucide-react';
import { useContactSessionId } from '@/modules/widget/store/use-contact-session-store';
import { useConversationActions } from '@/modules/widget/store/use-conversation-store';
import {
  useScreenActions,
  useScreenOrgId
} from '@/modules/widget/store/use-screen-store';
import { useVapiSecrets } from '@/modules/widget/store/use-vapi-secrets-store';
import { useWidgetSettings } from '@/modules/widget/store/use-widget-settings-store';
import { WidgetFooter } from '@/modules/widget/ui/components/widget-footer';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetSelectionScreen = () => {
  const { setScreen, setError } = useScreenActions();
  const orgId = useScreenOrgId();
  const contactSessionId = useContactSessionId();
  const { setConversationId } = useConversationActions();
  const widgetSettings = useWidgetSettings();
  const publicKey = useVapiSecrets();

  const [isPendingCreateConversation, setIsPendingCreateConversation] =
    useState(false);

  const createConversation = useMutation(api.public.conversations.create);

  const handleStartChat = async () => {
    if (!orgId) {
      setScreen(WIDGET_SCREENS.ERROR);
      setError('No organization found');
      return;
    }

    if (!contactSessionId) {
      setScreen(WIDGET_SCREENS.AUTH);
      return;
    }

    setIsPendingCreateConversation(true);
    try {
      const { id } = await createConversation({
        orgId,
        contactSessionId
      });

      setConversationId(id);

      setScreen(WIDGET_SCREENS.CHAT);
    } catch (error) {
      console.error('handleStartChat error', error);
      setScreen(WIDGET_SCREENS.AUTH);
    } finally {
      setIsPendingCreateConversation(false);
    }
  };

  const handleStartVoice = () => {
    setScreen(WIDGET_SCREENS.VOICE);
  };

  const handleStartPhoneCall = () => {
    setScreen(WIDGET_SCREENS.CONTACT);
  };

  const isShouldShowVoice = useMemo(() => {
    return !!publicKey && !!widgetSettings?.vapiSettings?.assistantId;
  }, [publicKey, widgetSettings]);

  const isShouldShowPhoneCall = useMemo(() => {
    return !!publicKey && !!widgetSettings?.vapiSettings?.phoneNumber;
  }, [publicKey, widgetSettings]);

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>Let's get you started</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col gap-y-4 overflow-y-auto p-4'>
        {/* Start chat */}
        <Button
          className='h-16 w-full justify-between'
          variant='outline'
          onClick={handleStartChat}
          disabled={isPendingCreateConversation}
        >
          {isPendingCreateConversation ? (
            <div className='flex items-center gap-x-2'>
              <Loader2Icon className='size-4 animate-spin' />
              <span>Creating conversation...</span>
            </div>
          ) : (
            <>
              <div className='flex items-center gap-x-2'>
                <MessageSquareTextIcon className='size-4' />
                <span>Start chat</span>
              </div>

              <ChevronRightIcon className='size-4' />
            </>
          )}
        </Button>

        {/* Start voice */}
        {isShouldShowVoice && (
          <Button
            className='h-16 w-full justify-between'
            variant='outline'
            onClick={handleStartVoice}
          >
            <div className='flex items-center gap-x-2'>
              <MicIcon className='size-4' />
              <span>Start voice call</span>
            </div>
            <ChevronRightIcon className='size-4' />
          </Button>
        )}

        {/* Start phone call */}
        {isShouldShowPhoneCall && (
          <Button
            className='h-16 w-full justify-between'
            variant='outline'
            onClick={handleStartPhoneCall}
            disabled={isPendingCreateConversation}
          >
            <div className='flex items-center gap-x-2'>
              <PhoneIcon className='size-4' />
              <span>Call us</span>
            </div>

            <ChevronRightIcon className='size-4' />
          </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};
