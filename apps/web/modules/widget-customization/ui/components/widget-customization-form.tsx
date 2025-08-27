'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Doc } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { VapiFormFields } from '@/modules/widget-customization/ui/components/vapi-form-fields';
import { widgetCustomizationFormSchema } from '@/modules/widget-customization/ui/schemas';
import { WidgetCustomizationFormSchema } from '@/modules/widget-customization/ui/types';

type WidgetCustomizationFormProps = {
  preloadedWidgetSettings: Preloaded<typeof api.private.widgetSettings.getOne>;
  preloadedVapiPlugin: Preloaded<typeof api.private.plugins.getOne>;
};

type WidgetSettings = Doc<'widgetSettings'>;

export const WidgetCustomizationForm = ({
  preloadedWidgetSettings,
  preloadedVapiPlugin
}: WidgetCustomizationFormProps) => {
  const widgetSettings = usePreloadedQuery(preloadedWidgetSettings);
  const vapiPlugin = usePreloadedQuery(preloadedVapiPlugin);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const upsertSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<WidgetCustomizationFormSchema>({
    resolver: zodResolver(widgetCustomizationFormSchema),
    defaultValues: {
      greetingMessage:
        widgetSettings?.greetingMessage || 'Hi, how can I help you?',
      defaultSuggestions: {
        suggestion1:
          widgetSettings?.defaultSuggestions?.suggestion1 ||
          'I need help with my account',
        suggestion2:
          widgetSettings?.defaultSuggestions?.suggestion2 ||
          'I have a question about my order',
        suggestion3:
          widgetSettings?.defaultSuggestions?.suggestion3 ||
          'I want to return my product'
      },
      vapiSettings: {
        phoneNumber: widgetSettings?.vapiSettings?.phoneNumber || '',
        assistantId: widgetSettings?.vapiSettings?.assistantId || ''
      }
    }
  });

  const onSubmit = async (data: WidgetCustomizationFormSchema) => {
    setIsSubmitting(true);
    try {
      const vapiSettings: WidgetSettings['vapiSettings'] = {
        assistantId:
          data.vapiSettings.assistantId === 'none'
            ? ''
            : data.vapiSettings.assistantId,
        phoneNumber:
          data.vapiSettings.phoneNumber === 'none'
            ? ''
            : data.vapiSettings.phoneNumber
      };

      await upsertSettings({
        greetingMessage: data.greetingMessage,
        defaultSuggestions: data.defaultSuggestions,
        vapiSettings
      });

      toast.success('Widget settings updated successfully');
    } catch (error) {
      console.error('Failed to update widget settings', error);
      toast.error('Failed to update widget settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingData =
    widgetSettings === undefined || vapiPlugin === undefined;

  return (
    <>
      {isLoadingData ? (
        <div className='flex flex-col items-center justify-center gap-y-2 p-8'>
          <Loader2Icon className='text-muted-foreground size-4 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Loading widget settings...
          </p>
        </div>
      ) : (
        <div className='flex flex-col'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Greeting Chat Settings</CardTitle>
                  <CardDescription>
                    Configure basic chat widget behavior and messages
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='greetingMessage'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Greeting Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Welcome message show when chat open'
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription className='text-muted-foreground text-xs'>
                          This message will be shown when the chat widget is
                          opened.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className='space-y-4'>
                    <div className='flex flex-col gap-y-1'>
                      <h3 className='font-semibold'>Default Suggestions</h3>
                      <p className='text-muted-foreground text-sm'>
                        Quick suggestions to help customers get started with
                        their queries
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name='defaultSuggestions.suggestion1'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suggestion 1</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., "I need help with my account"'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='defaultSuggestions.suggestion2'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suggestion 2</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., "What is your return policy?"'
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='defaultSuggestions.suggestion3'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suggestion 3</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='e.g., "How can I track my order?"'
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {vapiPlugin && (
                <Card>
                  <CardHeader>
                    <CardTitle>VAPI Settings</CardTitle>
                    <CardDescription>
                      Configure VAPI settings for your chat widget
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <VapiFormFields form={form} />
                  </CardContent>
                </Card>
              )}

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={
                    form.formState.isSubmitting ||
                    isLoadingData ||
                    !form.formState.isValid
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2Icon className='size-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};
