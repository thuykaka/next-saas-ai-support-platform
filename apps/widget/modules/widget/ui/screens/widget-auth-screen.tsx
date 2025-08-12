'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Doc } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useContactSessionActions } from '@/modules/widget/store/use-contact-session-store';
import {
  useScreenActions,
  useScreenOrgId
} from '@/modules/widget/store/use-screen-store';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address')
});

export const WidgetAuthScreen = () => {
  const orgId = useScreenOrgId();
  const { setContactSessionId } = useContactSessionActions();
  const { setScreen } = useScreenActions();

  const createContactSession = useMutation(api.public.contactSessions.create);
  const [isPendingCreateContactSession, setIsPendingCreateContactSession] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) {
      toast.error('Org ID is required');
      return;
    }

    setIsPendingCreateContactSession(true);

    try {
      const metadata: Doc<'contactSessions'>['metadata'] = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages as string[],
        platform: navigator.platform,
        vendor: navigator.vendor,
        screenResolution: {
          width: window.screen.width,
          height: window.screen.height
        },
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        cookieEnabled: navigator.cookieEnabled,
        referrer: document.referrer || '',
        currentUrl: window.location.href
      };

      const result = await createContactSession({
        ...values,
        orgId,
        metadata
      });

      toast.success(`Contact session created: ${result.id}`);
      setContactSessionId(result.id);

      setScreen(WIDGET_SCREENS.SELECTION);
    } catch (error) {
      toast.error('Failed to create contact session');
      console.error('Error creating contact session:', error);
    } finally {
      setIsPendingCreateContactSession(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>Let's get you started</p>
        </div>
      </WidgetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-1 flex-col gap-y-4 p-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='bg-background h-10'
                    placeholder='Enter your name'
                    type='text'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='bg-background h-10'
                    placeholder='Enter your email'
                    type='email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='w-full'
            disabled={isPendingCreateContactSession}
          >
            {isPendingCreateContactSession ? (
              <>
                <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                Creating...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
