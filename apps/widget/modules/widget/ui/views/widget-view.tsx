'use client';

import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';

interface WidgetViewProps {
  orgId: string;
}

export const WidgetView = ({ orgId }: WidgetViewProps) => {
  return (
    <main className='bg-muted flex h-full min-h-svh w-full flex-col overflow-hidden rounded-xl border'>
      <WidgetAuthScreen />
    </main>
  );
};
