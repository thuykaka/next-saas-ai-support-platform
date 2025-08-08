import { useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Loader2Icon } from 'lucide-react';
import {
  useContactSessionActions,
  useContactSessionId
} from '@/modules/widget/store/use-contact-session-store';
import {
  useScreenActions,
  useScreenLoadingMessage
} from '@/modules/widget/store/use-screen-store';
import { WIDGET_SCREENS } from '@/modules/widget/types';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';

interface WidgetLoadingScreenProps {
  orgId: string;
}

type InitStep = 'storage' | 'org' | 'session' | 'settings' | 'vapi' | 'done';

export const WidgetLoadingScreen = ({ orgId }: WidgetLoadingScreenProps) => {
  const { setError, setScreen, setLoadingMessage, setOrgId } =
    useScreenActions();
  const loadingMessage = useScreenLoadingMessage();

  const contactSessionId = useContactSessionId();

  const [step, setStep] = useState<InitStep>('org');
  const [sessionValid, setSessionValid] = useState(false);

  const validateOrg = useAction(api.public.organizations.validate);
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  // Step 1: Validate organization, set orgId
  useEffect(() => {
    if (step !== 'org') return;

    setLoadingMessage('Loading organization...');

    if (!orgId) {
      setError('No organization ID found');
      setScreen(WIDGET_SCREENS.ERROR);
      return;
    }

    setLoadingMessage('Validating organization...');

    validateOrg({ id: orgId })
      .then(({ valid, message }) => {
        if (valid) {
          setOrgId(orgId);
          setStep('session');
        } else {
          setError(message || 'Invalid organization');
          setScreen(WIDGET_SCREENS.ERROR);
        }
      })
      .catch(() => {
        setError('Unable to validate organization. Please try again later.');
        setScreen(WIDGET_SCREENS.ERROR);
      });
  }, [step, orgId]);

  // Step 2: Validate session
  useEffect(() => {
    if (step !== 'session') return;

    setLoadingMessage('Loading session...');

    // get from storage
    if (!contactSessionId) {
      console.log('no contact session id');
      setSessionValid(false);
      setStep('done');
      return;
    }

    setLoadingMessage('Validating session...');

    validateContactSession({ id: contactSessionId as Id<'contactSessions'> })
      .then(({ valid }) => {
        console.log('contact session valid', valid);
        // if is valid, done
        setSessionValid(valid);
        setStep('done');
      })
      .catch(() => {
        console.log('contact session not valid');
        // if is not valid, go to settings to setup
        setSessionValid(false);
        setStep('settings');
      });
  }, [step, contactSessionId]);

  // Step 3
  useEffect(() => {
    if (step !== 'done') return;

    const hasValidSession = sessionValid && contactSessionId;
    console.log('hasValidSession', sessionValid, contactSessionId);
    setScreen(hasValidSession ? WIDGET_SCREENS.SELECTION : WIDGET_SCREENS.AUTH);
  }, [step, sessionValid, contactSessionId]);

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>Let's get you started</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-4 p-4'>
        <Loader2Icon className='text-primary h-10 w-10 animate-spin' />
        <p className='text-sm'>{loadingMessage || 'Loading...'}</p>
      </div>
    </>
  );
};
