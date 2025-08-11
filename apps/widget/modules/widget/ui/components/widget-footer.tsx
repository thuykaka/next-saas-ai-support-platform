import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { HomeIcon, InboxIcon } from 'lucide-react';
import {
  useScreen,
  useScreenActions
} from '@/modules/widget/store/use-screen-store';
import { WIDGET_SCREENS } from '../../types';

export const WidgetFooter = () => {
  const screen = useScreen();
  const { setScreen } = useScreenActions();

  return (
    <footer className='bg-background flex items-center justify-between border-t'>
      <Button
        className='h-14 flex-1 rounded-none'
        onClick={() => setScreen(WIDGET_SCREENS.SELECTION)}
        size='icon'
        variant='ghost'
      >
        <HomeIcon
          className={cn('size-5', screen === 'selection' && 'text-primary')}
        />
      </Button>

      <Button
        className='h-14 flex-1 rounded-none'
        onClick={() => setScreen(WIDGET_SCREENS.INBOX)}
        size='icon'
        variant='ghost'
      >
        <InboxIcon
          className={cn('size-5', screen === 'inbox' && 'text-primary')}
        />
      </Button>
    </footer>
  );
};
