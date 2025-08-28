import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { useVapiSecrets } from '@/modules/widget/store/use-vapi-secrets-store';
import { useWidgetSettings } from '@/modules/widget/store/use-widget-settings-store';

interface TranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const useVapi = () => {
  const vapiPublicKey = useVapiSecrets();
  const widgetSettings = useWidgetSettings();

  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    if (!vapiPublicKey) return;

    const vapiInstance = new Vapi(vapiPublicKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('error', (e) => {
      console.error(e);
      setIsConnecting(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === 'user' ? 'user' : 'assistant',
            text: message.transcript
          }
        ]);
      }
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = async () => {
    if (!vapi || !widgetSettings?.vapiSettings?.assistantId) return;
    setIsConnecting(true);

    await vapi?.start(widgetSettings.vapiSettings.assistantId);
  };

  const stopCall = () => {
    vapi?.stop();
  };

  return {
    transcript,
    isConnected,
    isConnecting,
    isSpeaking,
    startCall,
    stopCall
  };
};
