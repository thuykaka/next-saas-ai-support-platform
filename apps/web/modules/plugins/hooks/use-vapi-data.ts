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
    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPhoneNumbers();
        if (cancel) return;
        setData(response);
        setError(null);
      } catch (error) {
        if (cancel) return;
        setError(error as Error);
        toast.error('Failed to fetch phone numbers');
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, []);

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
    let cancel = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAssistants();
        if (cancel) return;
        setData(response);
        setError(null);
      } catch (error) {
        if (cancel) return;
        setError(error as Error);
        toast.error('Failed to fetch assistants');
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, []);

  return { data, loading, error };
};
