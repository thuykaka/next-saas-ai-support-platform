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
import { WidgetHeader } from '../components/widget-header';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address')
});

const orgId = 'org_123';

export const WidgetAuthScreen = () => {
  const createContactSession = useMutation(api.public.contact_session.create);

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

    console.log(result);

    toast.success(`Contact session created: ${result.id}`);
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
          <Button type='submit' className='w-full'>
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
};
