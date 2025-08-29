'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@workspace/ui/components/form';
import { InputPassword } from '@workspace/ui/components/input-password';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeftRightIcon,
  GlobeIcon,
  Loader2Icon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon
} from 'lucide-react';
import {
  type Feature,
  PluginCard
} from '@/modules/plugins/ui/components/plugin-card';
import { VapiPluginConnected } from '@/modules/plugins/ui/components/vapi-plugin-connected';

const features: Feature[] = [
  {
    label: 'AI Voice Calls',
    description: 'Enable AI voice calls and phone support',
    icon: GlobeIcon
  },
  {
    label: 'Phone numbers',
    description: 'Get dedicated business lines',
    icon: PhoneIcon
  },
  {
    label: 'Outbound calls',
    description: 'Automated customer outreach',
    icon: PhoneCallIcon
  },
  {
    label: 'Workflows',
    description: 'Custom conversation workflows',
    icon: WorkflowIcon
  }
];

const formSchema = z.object({
  publicKey: z.string().min(1, 'Public API key is required'),
  privateKey: z.string().min(1, 'Private API key is required')
});

const VapiAddForm = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicKey: '',
      privateKey: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: 'vapi',
        value: data
      });

      toast.success('VAPI secret upserted successfully');
      setOpen(false);
    } catch (error) {
      console.error(`Failed to upsert VAPI secret: ${error}`);
      toast.error('Failed to upsert VAPI secret');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-y-4'
          >
            <DialogHeader>
              <DialogTitle>Enable VAPI</DialogTitle>
              <DialogDescription>
                Your API keys are safely encrypted and stored using AWS Secrets
                Manager.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name='publicKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      required
                      placeholder='Your public API key'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='privateKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Key</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      required
                      placeholder='Your private API key'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Enabling...' : 'Enable VAPI'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const VapiRemoveForm = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const removePlugin = useMutation(api.private.plugins.remove);

  const onSubmit = async () => {
    try {
      await removePlugin({
        service: 'vapi'
      });

      toast.success('VAPI plugin removed successfully');
      setOpen(false);
    } catch (error) {
      console.error(`Failed to remove VAPI plugin: ${error}`);
      toast.error('Failed to remove VAPI plugin');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect VAPI</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the VAPI plugin?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} variant='destructive'>
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const VapiPlugin = () => {
  const plugin = useQuery(api.private.plugins.getOne, {
    service: 'vapi'
  });

  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (plugin) {
      setRemoveDialogOpen(true);
    } else {
      setConnectDialogOpen(true);
    }
  };

  const isLoading = plugin === undefined;

  return (
    <>
      {isLoading ? (
        <VapiPluginSkeleton />
      ) : !!plugin ? (
        <>
          <VapiPluginConnected onDisconnect={handleSubmit} />
          <VapiRemoveForm
            open={removeDialogOpen}
            setOpen={setRemoveDialogOpen}
          />
        </>
      ) : (
        <>
          <VapiAddForm
            open={connectDialogOpen}
            setOpen={setConnectDialogOpen}
          />

          <PluginCard
            isDisabled={!!plugin}
            serviceName='VAPI'
            serviceImage='/vapi.jpg'
            features={features}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export const VapiPluginSkeleton = () => {
  return (
    <div className='bg-muted h-fit w-full rounded-lg border p-8'>
      <div className='mb-6 flex items-center justify-center gap-4'>
        <div className='flex flex-col items-center'>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>

        <div className='flex flex-col items-center gap-1'>
          <Skeleton className='h-4 w-10' />
        </div>

        <div className='flex flex-col items-center'>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </div>

      <div className='mb-6 text-center'>
        <Skeleton className='h-4 w-full rounded-md' />
      </div>

      <div className='mb-6'>
        <div className='space-y-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='bg-background flex size-8 items-center justify-center rounded-lg border'>
                <Skeleton className='h-4 w-4 rounded-full' />
              </div>
              <div className='flex flex-col'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-4 w-[350px]' />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center'>
        <Skeleton className='h-10 w-full rounded-md' />
      </div>
    </div>
  );
};
