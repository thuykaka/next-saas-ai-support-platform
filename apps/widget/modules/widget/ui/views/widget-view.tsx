'use client';

import { WidgetFooter } from '../components/widget-footer';
import { WidgetHeader } from '../components/widget-header';

interface WidgetViewProps {
  orgId: string;
}

export const WidgetView = ({ orgId }: WidgetViewProps) => {
  return (
    <main className='bg-muted flex h-full min-h-svh w-full flex-col overflow-hidden rounded-xl border'>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>How can I help you today?</p>
        </div>
      </WidgetHeader>

      <div className='flex flex-1'>Xin chao</div>

      <WidgetFooter />
    </main>
  );
};
