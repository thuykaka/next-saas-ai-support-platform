'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery
} from 'convex/react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GlobeIcon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon
} from 'lucide-react';
import {
  type Feature,
  PluginCard
} from '@/modules/plugins/ui/components/plugin-card';

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

interface VapiPluginProps {
  preloaded: Preloaded<typeof api.private.plugins.getOne>;
}

const formSchema = z.object({
  publicKey: z.string().min(1, 'Public API key is required'),
  privateKey: z.string().min(1, 'Private API key is required')
});

const VapiForm = ({
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

export const VapiPlugin = ({ preloaded }: VapiPluginProps) => {
  const plugin = usePreloadedQuery(preloaded);

  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (plugin) {
      setRemoveDialogOpen(true);
    } else {
      setConnectDialogOpen(true);
    }
  };

  return (
    <>
      {!!plugin ? (
        <div>Connected</div>
      ) : (
        <>
          <VapiForm open={connectDialogOpen} setOpen={setConnectDialogOpen} />
          <PluginCard
            isDisabled={plugin === undefined}
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
