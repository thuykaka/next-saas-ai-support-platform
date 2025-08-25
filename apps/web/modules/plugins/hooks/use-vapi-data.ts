import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAction } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;
type Assistants = typeof api.private.vapi.getAssistants._returnType;

export const useVapiPhoneNumbers = (): {
  data: PhoneNumbers;
  loading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<PhoneNumbers>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPhoneNumbers();
        setData(response);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error('Failed to fetch phone numbers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getPhoneNumbers]);

  return { data, loading, error };
};

export const useVapiAssistants = (): {
  data: Assistants;
  loading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<Assistants>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAssistants = useAction(api.private.vapi.getAssistants);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAssistants();
        setData(response);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error('Failed to fetch assistants');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAssistants]);

  return { data, loading, error };
};
