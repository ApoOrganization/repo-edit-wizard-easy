import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface VenueTimeSeriesPoint {
  date: string;
  events: string[]; // Event IDs active on this date
  tickets_sold: number;
  daily_revenue: number;
}

export interface VenueTicketTotals {
  revenue_realized: number;
  remaining_revenue: number;
  total_potential_revenue: number;
}

export interface VenueTicketsResponse {
  totals: VenueTicketTotals;
  timeseries: VenueTimeSeriesPoint[];
  venue_id: string;
  events_present: { [eventId: string]: string }; // Event ID to event name mapping
}

export interface VenueTicketsError {
  error: 'no_bubilet_data';
  venue_id: string;
}

export type VenueTicketsResult = VenueTicketsResponse | VenueTicketsError;

export const useVenueTickets = (venueId: string | undefined) => {
  return useQuery<VenueTicketsResult>({
    queryKey: ['venue-tickets', venueId],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID is required');

      console.log('Fetching venue ticket data for:', venueId);

      // Call the new get-venue-tickets edge function
      const { data, error } = await supabase.functions.invoke('get-venue-tickets', {
        body: { venue_id: venueId }
      });

      if (error) {
        console.error('Error fetching venue ticket data:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No venue ticket data received');
      }

      console.log('Venue ticket data received:', data);
      return data;
    },
    enabled: !!venueId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Helper function to check if response has ticket data
export const hasVenueTicketData = (result: VenueTicketsResult | undefined): result is VenueTicketsResponse => {
  return result !== undefined && !('error' in result);
};

// Helper function to check if response is an error
export const isVenueTicketError = (result: VenueTicketsResult | undefined): result is VenueTicketsError => {
  return result !== undefined && 'error' in result;
};