'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { useOrganization } from '@clerk/nextjs';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import Image from 'next/image';
import {
  type IntegrationId,
  INTEGRATIONS
} from '@/modules/integrations/constants';
import { createSnippet } from '@/modules/integrations/utils';

export const IntegrationsView = () => {
  const { organization } = useOrganization();
  const [copied, setCopied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snippet, setSnippet] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? '');
      setCopied(true);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error('Organization not found');
      return;
    }

    const snippet = createSnippet(integrationId, organization.id);
    setSnippet(snippet);
    setOpenDialog(true);
  };

  return (
    <>
      <div className='flex h-[calc(100vh-56px)] flex-col overflow-y-auto'>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div className='px-4'>
            <h2 className='text-xl font-bold tracking-tight'>
              Setup & Integrations
            </h2>
            <p className='text-muted-foreground text-sm'>
              Choose the integration that&apos;s right for you
            </p>
          </div>
        </div>

        <div className='my-8 flex w-full max-w-screen-md flex-1 flex-col px-4'>
          <div className='flex items-center gap-4'>
            <Label className='w-34' htmlFor='orgId'>
              Organization ID
            </Label>
            <Input
              id='orgId'
              className='bg-muted flex-1 font-mono text-sm'
              disabled
              readOnly
              value={organization?.id ?? ''}
            />
            <Button
              size='sm'
              className='gap-2'
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <CheckIcon className='size-4' />
              ) : (
                <ClipboardIcon className='size-4' />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <Separator className='my-8' />

          <div className='space-y-6'>
            <div className='space-y-1'>
              <Label className='text-md font-medium'>Integrations</Label>
              <p className='text-muted-foreground text-sm'>
                Add the following code to your website to enable the chatbox.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  className='bg-muted hover:bg-accent flex items-center gap-4 rounded-lg border p-4'
                  onClick={() => handleIntegrationClick(integration.id)}
                >
                  <Image
                    src={integration.icon}
                    alt={integration.title}
                    width={32}
                    height={32}
                  />
                  <p className='text-sm font-medium'>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <IntegrationDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        snippet={snippet}
      />
    </>
  );
};

const IntegrationDialog = ({
  open,
  onOpenChange,
  snippet
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Integration with your website</DialogTitle>
          <DialogDescription>
            Add the following code to your website to enable the chatbox.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='bg-accent rounded-md p-2 text-sm'>
              1. Copy the following code.
            </div>
            <div className='group relative'>
              <pre className='bg-foreground text-secondary max-h-[300px] overflow-auto whitespace-pre-wrap break-all rounded-md p-2 font-mono text-sm'>
                {snippet}
              </pre>
              <Button
                className='absolute right-2 top-2 size-6 opacity-0 transition-opacity group-hover:opacity-100'
                size='icon'
                variant='secondary'
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <CheckIcon className='size-3' />
                ) : (
                  <ClipboardIcon className='size-3' />
                )}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='bg-accent rounded-md p-2 text-sm'>
              2. Paste it into the <code>head</code> section of your website.
            </div>
            <p className='text-muted-foreground text-sm'>
              Add the following code to your website to enable the chatbox.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
