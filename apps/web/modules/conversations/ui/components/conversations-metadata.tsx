import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Doc } from '@workspace/backend/_generated/dataModel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import { cn } from '@workspace/ui/lib/utils';
import Bowser from 'bowser';
import {
  MonitorIcon,
  LanguagesIcon,
  ActivityIcon,
  SendIcon
} from 'lucide-react';
import Link from 'next/link';
import { getContryFromTimezone } from '@/lib/common';

type ConversationsMetadataProps = {
  conversation: Doc<'conversations'> & {
    contactSession: Doc<'contactSessions'>;
  };
};

type InfoItem = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

type InfoSection = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
};

const formatTimezoneOffset = (offsetMinutes: number) => {
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${minutes}`;
};

export const ConversationsMetadata = ({
  conversation
}: ConversationsMetadataProps) => {
  const countryInfo = useMemo(() => {
    return getContryFromTimezone(
      conversation.contactSession.metadata?.timezone
    );
  }, [conversation.contactSession.metadata?.timezone]);

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent)
        return {
          browser: 'N/A',
          os: 'N/A',
          device: 'N/A'
        };

      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();
      return {
        browser: result.browser.name || 'N/A',
        browserVersion: result.browser.version,
        os: result.os.name || 'N/A',
        osVersion: result.os.version,
        device: result.platform.type || 'N/A',
        deviceVendor: result.platform.vendor,
        deviceModel: result.platform.model
      };
    };
  }, []);

  const userAgentInfo = useMemo(() => {
    return parseUserAgent(conversation.contactSession.metadata?.userAgent);
  }, [conversation.contactSession.metadata?.userAgent]);

  const accordionData: InfoSection[] = useMemo(() => {
    if (!conversation.contactSession?.metadata) return [];
    return [
      {
        id: 'device-info',
        icon: MonitorIcon,
        title: 'Device Info',
        items: [
          {
            label: 'Browser',
            value: `${userAgentInfo.browser}${userAgentInfo.browserVersion ? ` ${userAgentInfo.browserVersion}` : ''}`
          },
          {
            label: 'OS',
            value: `${userAgentInfo.os}${userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ''}`
          },
          {
            label: 'Device',
            value: `${userAgentInfo.device}${userAgentInfo.deviceModel ? ` - ${userAgentInfo.deviceModel}` : ''}`,
            className: 'capitalize'
          },
          {
            label: 'Screen',
            value: `${conversation.contactSession.metadata.screenResolution?.width} x ${conversation.contactSession.metadata.screenResolution?.height}`
          },
          {
            label: 'Viewport',
            value: `${conversation.contactSession.metadata.viewportSize?.width} x ${conversation.contactSession.metadata.viewportSize?.height}`
          },
          {
            label: 'Cookies',
            value: conversation.contactSession.metadata.cookieEnabled
              ? 'Enabled'
              : 'Disabled'
          }
        ]
      },
      {
        id: 'location-info',
        icon: LanguagesIcon,
        title: 'Location & Language',
        items: [
          ...(countryInfo
            ? [
                {
                  label: 'Country',
                  value: <span>{countryInfo.countryName}</span>
                }
              ]
            : []),
          {
            label: 'Language',
            value: conversation.contactSession.metadata.language
          },
          {
            label: 'Timezone',
            value: conversation.contactSession.metadata.timezone
          },
          {
            label: 'UTC Offset',
            value: conversation.contactSession.metadata.timezoneOffset
              ? formatTimezoneOffset(
                  conversation.contactSession.metadata.timezoneOffset
                )
              : 'N/A'
          }
        ]
      },
      {
        id: 'activity-info',
        icon: ActivityIcon,
        title: 'Session Details',
        items: [
          {
            label: 'Session ID',
            value: conversation.contactSessionId
          },
          {
            label: 'Started',
            value: formatDistanceToNow(new Date(conversation._creationTime))
          }
        ]
      }
    ];
  }, [
    userAgentInfo,
    countryInfo,
    conversation.contactSession.metadata,
    conversation.contactSessionId
  ]);

  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      <div className='flex-1 space-y-4 overflow-y-auto'>
        <div className='flex flex-col gap-4 px-4'>
          <div className='flex items-start gap-3 text-sm leading-tight'>
            <DicebearAvatar
              seed={conversation.contactSession._id}
              size={40}
              className='shrink-0'
              badgeImageUrl={
                countryInfo?.countryCode
                  ? `https://flagcdn.com/w40/${countryInfo.countryCode.toLowerCase()}.png`
                  : undefined
              }
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
          <Button
            variant='primary-gradient'
            className='w-full justify-center'
            asChild
          >
            <Link href={`mailto:${conversation.contactSession.email}`}>
              <SendIcon className='mr-2 h-4 w-4' />
              Send Email
            </Link>
          </Button>
        </div>

        {/* Accordion Sections */}
        <div className='bg-muted flex flex-col gap-2 overflow-y-auto border-t'>
          {conversation.contactSession?.metadata && (
            <Accordion type='multiple'>
              {accordionData.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                    <div className='flex items-center gap-2'>
                      <section.icon className='h-4 w-4' />
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='px-4 pb-4'>
                    <div className='space-y-2 text-xs'>
                      {section.items.map((item) => (
                        <div key={item.label} className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            {item.label}
                          </span>
                          <span className={cn(item.className)}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};
