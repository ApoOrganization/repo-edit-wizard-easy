import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  VenueTicketsResponse,
  VenueTicketsError,
  VenueTicketsResult,
  TimeSeriesPoint,
  TicketTotals
} from '@/types/ticketAnalytics';

// Re-export for backward compatibility
export type VenueTimeSeriesPoint = TimeSeriesPoint;
export type VenueTicketTotals = TicketTotals;
export type { VenueTicketsResponse, VenueTicketsError, VenueTicketsResult };

export const useVenueTickets = (venueId: string | undefined) => {
  return useQuery<VenueTicketsResult>({
    queryKey: ['venue-tickets', venueId],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID is required');

      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching venue ticket data for:', venueId);
      }

      // Call the new get-venue-tickets edge function
      const { data, error } = await supabase.functions.invoke('get-venue-tickets', {
        body: { venue_id: venueId }
      });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching venue ticket data:', error);
        }
        throw error;
      }

      if (!data) {
        throw new Error('No venue ticket data received');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Venue ticket data received:', data);
      }
      return data;
    },
    enabled: !!venueId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Helper function to check if response has ticket data (using shared helper)
export const hasVenueTicketData = (result: VenueTicketsResult | undefined): result is VenueTicketsResponse => {
  return result !== undefined && !('error' in result);
};

// Helper function to check if response is an error
export const isVenueTicketError = (result: VenueTicketsResult | undefined): result is VenueTicketsError => {
  return result !== undefined && 'error' in result;
};