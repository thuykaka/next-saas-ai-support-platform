import { WidgetView } from '@/modules/widget/ui/widget-view';

export default function Page() {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Apps/Widget</h1>
        <WidgetView />
      </div>
    </div>
  );
}
