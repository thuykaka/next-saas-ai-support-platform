import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { HomeIcon, InboxIcon } from 'lucide-react';

export const WidgetFooter = () => {
  const screen: 'selection' | 'inbox' | undefined = undefined;

  return (
    <footer className='bg-background flex items-center justify-between border-t'>
      <Button
        className='h-14 flex-1 rounded-none'
        onClick={() => {}}
        size='icon'
        variant='ghost'
      >
        <HomeIcon
          className={cn('size-5', screen === 'selection' && 'text-primary')}
        />
      </Button>

      <Button
        className='h-14 flex-1 rounded-none'
        onClick={() => {}}
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
