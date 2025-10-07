import { useEffect, useState } from 'react';
import { subscribeToData, unsubscribeFromData } from '@/lib/firebase/realtime-db';
import { RealtimeData } from '@/lib/firebase/realtime-types';
import { DatabaseReference } from 'firebase/database';

/**
 * Hook for subscribing to real-time updates from a specific path in the database
 * @param path - The path to listen to
 * @returns The current data and loading state
 */
export function useRealtimeData<T = RealtimeData>(path: string | null): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [reference, setReference] = useState<DatabaseReference | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ref = subscribeToData(path, (newData) => {
        setData(newData as T);
        setLoading(false);
      });

      setReference(ref);

      // Clean up subscription when component unmounts or path changes
      return () => {
        if (ref) {
          unsubscribeFromData(ref);
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}