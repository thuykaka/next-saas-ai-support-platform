import { preloadQuery } from 'convex/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { getAuthToken } from '@/lib/auth';
import { WidgetCustomizationForm } from '@/modules/widget-customization/ui/components/widget-customization-form';

export const WidgetCustomizationView = async () => {
  const token = await getAuthToken();

  const preloadedWidgetSettings = await preloadQuery(
    api.private.widgetSettings.getOne,
    {},
    { token }
  );

  const preloadedVapiPlugin = await preloadQuery(
    api.private.plugins.getOne,
    {
      service: 'vapi'
    },
    { token }
  );

  return (
    <>
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

      <div className='mt-8 flex h-full w-full max-w-screen-md flex-1 flex-col px-4'>
        <WidgetCustomizationForm
          preloadedWidgetSettings={preloadedWidgetSettings}
          preloadedVapiPlugin={preloadedVapiPlugin}
        />
      </div>
    </>
  );
};
