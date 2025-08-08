import { AlertCircleIcon } from 'lucide-react';
import { useScreenError } from '@/modules/widget/store/use-screen-store';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';

export const WidgetErrorScreen = () => {
  const error = useScreenError();

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col justify-between gap-y-2 px-2 py-6'>
          <p className='text-3xl'>Hi there! 👋</p>
          <p className='text-lg'>Let's get you started</p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-4 p-4'>
        <AlertCircleIcon className='text-destructive' />
        <p className='text-sm'>
          {error || 'Something went wrong. Please try again later.'}
        </p>
      </div>
    </>
  );
};
