'use client';

import { useScreen } from '@/modules/widget/store/use-screen-store';
import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';
import { WIDGET_SCREENS } from '../../types';

interface WidgetViewProps {
  orgId: string;
}

export const WidgetView = ({ orgId }: WidgetViewProps) => {
  const screen = useScreen();

  const screenComponents = {
    [WIDGET_SCREENS.ERROR]: <div>Error</div>,
    [WIDGET_SCREENS.LOADING]: <div>Loading</div>,
    [WIDGET_SCREENS.SELECTION]: <div>Selection</div>,
    [WIDGET_SCREENS.VOICE]: <div>Voice</div>,
    [WIDGET_SCREENS.AUTH]: <WidgetAuthScreen />,
    [WIDGET_SCREENS.INBOX]: <div>Inbox</div>,
    [WIDGET_SCREENS.CHAT]: <div>Chat</div>,
    [WIDGET_SCREENS.CONTACT]: <div>Contact</div>
  };

  return (
    <main className='bg-muted flex h-full min-h-svh w-full flex-col overflow-hidden rounded-xl border'>
      {screenComponents[screen]}
    </main>
  );
};
