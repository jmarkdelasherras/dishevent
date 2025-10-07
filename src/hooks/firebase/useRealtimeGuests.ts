import { useEffect, useState } from 'react';
import { subscribeToGuests } from '@/lib/firebase/realtime-db';
import { RealtimeGuestWithId } from '@/lib/firebase/realtime-types';
import { DatabaseReference } from 'firebase/database';

/**
 * Hook for subscribing to real-time updates of guests for a specific event
 * @param eventId - The ID of the event to get guests for
 * @returns The current guest list and loading state
 */
export function useRealtimeGuests(eventId: string | null): {
  guests: RealtimeGuestWithId[];
  loading: boolean;
  error: Error | null;
} {
  const [guests, setGuests] = useState<RealtimeGuestWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [reference, setReference] = useState<DatabaseReference | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ref = subscribeToGuests(eventId, (newGuests) => {
        setGuests(newGuests);
        setLoading(false);
      });

      setReference(ref);

      // Clean up subscription when component unmounts or eventId changes
      return () => {
        if (ref) {
          // Unsubscribe from the real-time updates
          // Already handled by unsubscribeFromData in the subscribeToGuests function
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setLoading(false);
    }
  }, [eventId]);

  return { guests, loading, error };
}