import { useRealtimeData } from './useRealtimeData';
import { RealtimeEventWithId } from '@/lib/firebase/realtime-types';

/**
 * Hook for subscribing to real-time updates of a specific event
 * @param eventId - The ID of the event to subscribe to
 * @returns The current event data and loading state
 */
export function useRealtimeEvent(eventId: string | null): {
  event: RealtimeEventWithId | null;
  loading: boolean;
  error: Error | null;
} {
  const path = eventId ? `events/${eventId}` : null;
  const { data, loading, error } = useRealtimeData<RealtimeEventWithId>(path);

  return {
    event: data,
    loading,
    error
  };
}

export function useRealtimeEventDetails(eventId: string | null): {
  eventDetailsData: RealtimeEventWithId | null;
  loading: boolean;
  error: Error | null;
} {
  const path = eventId ? `weddingDetails/${eventId}` : null;
  const { data, loading, error } = useRealtimeData<RealtimeEventWithId>(path);

  return {
    eventDetailsData: data,
    loading,
    error
  };
}