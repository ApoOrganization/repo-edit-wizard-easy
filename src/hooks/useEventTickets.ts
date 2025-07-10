import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface TicketCategory {
  price: number;
  is_sold_out: boolean;
  sellout_duration_days: number | null;
}

export interface TimeSeriesDataPoint {
  date: string;
  avg_price: number;
  by_category: {
    [categoryName: string]: {
      price: number;
      remaining: number;
      revenue: number;
      tickets_sold: number;
    };
  };
  total_remaining: number;
  daily_revenue: number;
  tickets_sold: number;
}

export interface BubiletSales {
  timeseries: TimeSeriesDataPoint[];
  last_snapshot: {
    by_category: {
      [categoryName: string]: {
        price: number;
        remaining: number;
      };
    };
    total_remaining: number;
  };
  unique_event_id: string;
  revenue_realized: number;
  remaining_revenue: number;
  total_potential_revenue: number;
}

export interface EventTicketsResponse {
  event_id: string;
  tickets: {
    bubilet?: {
      [categoryName: string]: TicketCategory;
    } | null;
    passo?: {
      [categoryName: string]: TicketCategory;
    } | null;
    biletix?: {
      [categoryName: string]: TicketCategory;
    } | null;
    biletinial?: {
      [categoryName: string]: TicketCategory;
    } | null;
  };
  bubilet_sales: BubiletSales | null;
}

export const useEventTickets = (eventId: string | undefined) => {
  return useQuery<EventTicketsResponse>({
    queryKey: ['event-tickets', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      console.log('Fetching ticket data for event:', eventId);

      // Call the new get-event-tickets edge function
      const { data, error } = await supabase.functions.invoke('get-event-tickets', {
        body: { uuid: eventId }
      });

      if (error) {
        console.error('Error fetching ticket data:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No ticket data received');
      }

      console.log('Ticket data received:', data);
      return data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};