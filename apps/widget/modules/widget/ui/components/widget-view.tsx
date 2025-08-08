'use client';

import { Button } from '@workspace/ui/components/button';
import { useVapi } from '../../hooks/use-vapi';

export const WidgetView = () => {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    stopCall
  } = useVapi();

  return (
    <div className='flex flex-col gap-4'>
      <Button onClick={startCall}>Start Call</Button>
      <Button onClick={stopCall} variant='destructive'>
        Stop Call
      </Button>

      <div className='mt-4 flex flex-col gap-2 text-sm'>
        <span>Is Connected: {isConnected ? 'Yes' : 'No'}</span>
        <span>Is Connecting: {isConnecting ? 'Yes' : 'No'}</span>
        <span>Is Speaking: {isSpeaking ? 'Yes' : 'No'}</span>
      </div>

      <div className='flex flex-col gap-2'>
        {transcript.map((message, index) => (
          <div key={index} className='flex flex-col gap-2'>
            <span className='text-sm text-gray-500'>{message.role}</span>
            <span className='text-sm'>{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
