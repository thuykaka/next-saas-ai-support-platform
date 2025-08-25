'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@workspace/ui/components/tabs';
import {
  BotIcon,
  CheckCircleIcon,
  CopyIcon,
  PhoneIcon,
  SettingsIcon,
  UnplugIcon,
  XCircleIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useVapiAssistants,
  useVapiPhoneNumbers
} from '@/modules/plugins/hooks/use-vapi-data';

interface VapiPluginConnectedProps {
  onDisconnect: () => void;
}

const VapiPhoneNumberTabContent = () => {
  const { data: phoneNumbers, loading } = useVapiPhoneNumbers();

  const copyToClipboard = (phoneNumber: string) => {
    try {
      navigator.clipboard.writeText(phoneNumber);
      toast.success('Phone number copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy phone number');
    }
  };

  return (
    <div className='mb-4 px-4'>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-6 py-4'>Phone Number</TableHead>
              <TableHead className='px-6 py-4'>Name</TableHead>
              <TableHead className='px-6 py-4'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              if (loading) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} className='px-6 py-4 text-center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                );
              }
              if (phoneNumbers?.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} className='px-6 py-4 text-center'>
                      No phone numbers found
                    </TableCell>
                  </TableRow>
                );
              }
              return (
                <>
                  {phoneNumbers?.map((phoneNumber) => (
                    <TableRow
                      key={phoneNumber.id}
                      className='hover:bg-muted/50'
                    >
                      <TableCell className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <PhoneIcon className='text-muted-foreground size-4' />
                          <span className='font-mono'>
                            {phoneNumber.number || 'N/A'}
                          </span>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              copyToClipboard(phoneNumber.number ?? '')
                            }
                          >
                            <CopyIcon className='size-3' />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        {phoneNumber.name || 'N/A'}
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        <Badge
                          className='capitalize'
                          variant={
                            phoneNumber.status === 'active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {phoneNumber.status === 'active' ? (
                            <CheckCircleIcon className='size-4' />
                          ) : (
                            <XCircleIcon className='size-4' />
                          )}
                          {phoneNumber.status || 'N/A'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const VapiAssistantTabContent = () => {
  const { data: assistants, loading } = useVapiAssistants();

  return (
    <div className='mb-4 px-4'>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-6 py-4'>Assistant</TableHead>
              <TableHead className='px-6 py-4'>Model</TableHead>
              <TableHead className='px-6 py-4'>First Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              if (loading) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} className='px-6 py-4 text-center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                );
              }
              if (assistants?.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} className='px-6 py-4 text-center'>
                      No phone numbers found
                    </TableCell>
                  </TableRow>
                );
              }
              return (
                <>
                  {assistants?.map((assistant) => (
                    <TableRow key={assistant.id} className='hover:bg-muted/50'>
                      <TableCell className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <BotIcon className='text-muted-foreground size-4' />
                          <span>{assistant.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        <span className='text-sm'>
                          {assistant.model?.model || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        <div className='max-w-[300px] overflow-hidden'>
                          <span
                            className='text-muted-foreground block cursor-help truncate text-sm'
                            title={assistant.firstMessage || 'N/A'}
                          >
                            {assistant.firstMessage || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const VapiPluginConnected = ({
  onDisconnect
}: VapiPluginConnectedProps) => {
  const [activeTab, setActiveTab] = useState('phone-numbers');

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src='/vapi.jpg'
                alt='VAPI'
                width={48}
                height={48}
                className='rounded-lg object-contain'
              />
              <div>
                <CardTitle>VAPI Integration</CardTitle>
                <CardDescription>
                  Manage your phone numbers and assistants.
                </CardDescription>
              </div>
            </div>
            <Button onClick={onDisconnect} variant='destructive' size='sm'>
              <UnplugIcon className='size-4' />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex size-12 items-center justify-center rounded-lg border'>
                <SettingsIcon className='text-muted-foreground size-8' />
              </div>
              <div>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  Setup voice call for your chat widget
                </CardDescription>
              </div>
            </div>
            <Button asChild size='sm'>
              <Link href='/customization'>
                <SettingsIcon className='size-4' />
                Configure
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className='overflow-hidden rounded-lg border'>
        <Tabs
          className='gap-0'
          defaultValue='phone-numbers'
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className='m-4'>
            <TabsTrigger value='phone-numbers'>
              <PhoneIcon className='size-4' />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger value='assistants'>
              <BotIcon className='size-4' />
              Assistants
            </TabsTrigger>
          </TabsList>

          <TabsContent value='phone-numbers'>
            <VapiPhoneNumberTabContent />
          </TabsContent>

          <TabsContent value='assistants'>
            <VapiAssistantTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
