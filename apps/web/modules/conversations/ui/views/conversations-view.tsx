import Image from 'next/image';

export const ConversationsView = () => {
  return (
    <div className='bg-muted flex h-full flex-1 flex-col gap-y-4'>
      <div className='flex flex-1 items-center justify-center gap-x-2'>
        <Image alt='Logo' src='/logo.svg' width={40} height={40} />
        <p className='text-lg font-semibold'>Echo</p>
      </div>
    </div>
  );
};
