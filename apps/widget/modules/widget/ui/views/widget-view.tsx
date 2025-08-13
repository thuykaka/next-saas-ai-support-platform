'use client';

import { useScreen } from '@/modules/widget/store/use-screen-store';
import { WIDGET_SCREENS } from '@/modules/widget/types';
import { WidgetAuthScreen } from '@/modules/widget/ui/screens/widget-auth-screen';
import { WidgetChatScreen } from '@/modules/widget/ui/screens/widget-chat-screen';
import { WidgetErrorScreen } from '@/modules/widget/ui/screens/widget-error-screen';
import { WidgetInboxScreen } from '@/modules/widget/ui/screens/widget-inbox-screen';
import { WidgetLoadingScreen } from '@/modules/widget/ui/screens/widget-loading-screen';
import { WidgetSelectionScreen } from '@/modules/widget/ui/screens/widget-selection-screen';

interface WidgetViewProps {
  orgId: string;
}

export const WidgetView = ({ orgId }: WidgetViewProps) => {
  const screen = useScreen();

  const screenComponents = {
    [WIDGET_SCREENS.ERROR]: <WidgetErrorScreen />,
    [WIDGET_SCREENS.LOADING]: <WidgetLoadingScreen orgId={orgId} />,
    [WIDGET_SCREENS.SELECTION]: <WidgetSelectionScreen />,
    [WIDGET_SCREENS.VOICE]: <div>Voice</div>,
    [WIDGET_SCREENS.AUTH]: <WidgetAuthScreen />,
    [WIDGET_SCREENS.INBOX]: <WidgetInboxScreen />,
    [WIDGET_SCREENS.CHAT]: <WidgetChatScreen />,
    [WIDGET_SCREENS.CONTACT]: <div>Contact</div>
  };

  return (
    <main className='bg-muted flex size-full max-h-screen min-h-screen flex-col overflow-hidden rounded-xl border'>
      {screenComponents[screen]}
    </main>
  );
};
