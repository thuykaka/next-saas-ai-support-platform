'use client';

import { Button } from '@workspace/ui/components/button';
import { ArrowLeftRightIcon, PlugIcon, type LucideIcon } from 'lucide-react';
import Image from 'next/image';

export interface Feature {
  icon: LucideIcon;
  description: string;
  label: string;
}

interface PluginCardProps {
  isDisabled: boolean;
  serviceName: string;
  serviceImage: string;
  features: Feature[];
  onSubmit?: () => void;
}

export const PluginCard = ({
  isDisabled,
  serviceName,
  serviceImage,
  features,
  onSubmit
}: PluginCardProps) => {
  return (
    <div className='bg-muted h-fit w-full rounded-lg border p-8'>
      <div className='mb-6 flex items-center justify-center gap-4'>
        <div className='flex flex-col items-center'>
          <Image
            src={serviceImage}
            alt={serviceName}
            width={40}
            height={40}
            className='rounded object-contain'
          />
        </div>
        <div className='flex flex-col items-center gap-1'>
          <ArrowLeftRightIcon className='size-4' />
        </div>

        <div className='flex flex-col items-center'>
          <Image
            src='/logo.svg'
            alt='Platform'
            width={40}
            height={40}
            className='rounded object-contain'
          />
        </div>
      </div>

      <div className='mb-6 text-center'>
        <p className='text-lg'>Connect your {serviceName} account</p>
      </div>

      <div className='mb-6'>
        <div className='space-y-4'>
          {features.map((feature) => (
            <div key={feature.label} className='flex items-center gap-2'>
              <div className='bg-background flex size-8 items-center justify-center rounded-lg border'>
                <feature.icon className='text-muted-foreground size-4' />
              </div>
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{feature.label}</p>
                <p className='text-muted-foreground text-xs'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center'>
        <Button
          className='size-full'
          disabled={isDisabled}
          onClick={onSubmit}
          variant='default'
        >
          Connect <PlugIcon className='size-4' />
        </Button>
      </div>
    </div>
  );
};
