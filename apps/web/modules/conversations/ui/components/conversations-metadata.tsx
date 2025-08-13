import { Doc } from '@workspace/backend/_generated/dataModel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import {
  MonitorIcon,
  LanguagesIcon,
  ActivityIcon,
  SendIcon
} from 'lucide-react';
import { getContryFromTimezone } from '@/lib/common';

type ConversationsMetadataProps = {
  conversation: Doc<'conversations'> & {
    contactSession: Doc<'contactSessions'>;
  };
};

export const ConversationsMetadata = ({
  conversation
}: ConversationsMetadataProps) => {
  const country = getContryFromTimezone(
    conversation.contactSession.metadata?.timezone
  );
  const contryFlagUrl = country
    ? `https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`
    : undefined;

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      <div className='flex-1 space-y-4 overflow-y-auto'>
        <div className='flex flex-col gap-4 px-4'>
          <div className='flex items-start gap-3 text-sm leading-tight'>
            <DicebearAvatar
              seed={conversation.contactSession._id}
              size={40}
              className='shrink-0'
              badgeImageUrl={contryFlagUrl}
            />

            <div className='flex-1'>
              <div className='flex w-full items-center gap-2'>
                <span className='truncate font-semibold'>
                  {conversation.contactSession.name}
                </span>
              </div>

              <div className='mt-1 flex items-center justify-between gap-2'>
                <span className='text-muted-foreground line-clamp-1 text-xs'>
                  {conversation.contactSession.email}
                </span>
              </div>
            </div>
          </div>
          <Button variant='primary-gradient' className='w-full justify-center'>
            <SendIcon className='mr-2 h-4 w-4' />
            Send Email
          </Button>
        </div>

        {/* Accordion Sections */}
        <div className='bg-muted flex flex-col gap-2 border-t'>
          <Accordion type='multiple'>
            <AccordionItem value='device-info'>
              <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <MonitorIcon className='h-4 w-4' />
                  Device Info
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4'>
                <div className='space-y-2 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Platform</span>
                    <span>Windows 10</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Browser</span>
                    <span>Chrome 120.0.0.0</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Screen</span>
                    <span>1920x1080</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>User Agent</span>
                    <span className='max-w-[120px] truncate'>
                      Mozilla/5.0...
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='location-language'>
              <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <LanguagesIcon className='h-4 w-4' />
                  Location & Language
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4'>
                <div className='space-y-2 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Location</span>
                    <span>New York, NY</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Language</span>
                    <span>English (US)</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Timezone</span>
                    <span>America/New_York</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>IP Address</span>
                    <span>192.168.1.100</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Session Details */}
            <AccordionItem value='session-details'>
              <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <ActivityIcon className='h-4 w-4' />
                  Session Details
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4'>
                <div className='space-y-2 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Session ID</span>
                    <span className='max-w-[120px] truncate'>
                      {conversation.contactSessionId}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Started</span>
                    <span>
                      {new Date(
                        conversation._creationTime
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Duration</span>
                    <span>2h 15m</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Pages Visited</span>
                    <span>5</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
