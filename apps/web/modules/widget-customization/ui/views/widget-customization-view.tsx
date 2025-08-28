import { WidgetCustomization } from '@/modules/widget-customization/ui/components/widget-customization-form';

export const WidgetCustomizationView = () => {
  return (
    <div className='flex h-[calc(100vh-56px)] flex-col overflow-y-auto'>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='px-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            Widget Customization
          </h2>
          <p className='text-muted-foreground text-sm'>
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>
      </div>

      <div className='my-8 flex w-full max-w-screen-md flex-1 flex-col px-4'>
        <WidgetCustomization />
      </div>
    </div>
  );
};
