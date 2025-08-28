import { VapiPlugin } from '@/modules/plugins/ui/components/vapi-plugin';

export const VapiView = () => {
  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='px-4'>
          <h2 className='text-xl font-bold tracking-tight'>VAPI Plugin</h2>
          <p className='text-muted-foreground text-sm'>
            Connect Vapi to enable AI voice calls and phone support
          </p>
        </div>
      </div>

      <div className='mt-8 flex h-full w-full max-w-screen-md flex-1 flex-col px-4'>
        <VapiPlugin />
      </div>
    </>
  );
};
