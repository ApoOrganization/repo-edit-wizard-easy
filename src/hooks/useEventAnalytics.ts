import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface EventAnalytics {
  event: any; // Event details from view
  analytics: {
    overview: {
      daysOnSale: number;
      salesStarted: string;
      eventDate: string;
      status: string;
      providers: string[];
      totalCapacity?: number;
      ticketsSold?: number;
      remaining?: number;
      soldPercentage?: string;
    };
    salesVelocity?: {
      ticketsPerDay: string;
      estimatedSelloutDays: number | null;
    };
    priceComparison?: {
      marketAverage: number;
      currentPrice: number;
      difference: number;
      percentageDiff: string;
    };
    priceHistory: Array<{
      date: string;
      provider: string;
      min_price: number;
      max_price: number;
      avg_price: number;
    }>;
    similarEvents: Array<{
      id: string;
      name: string;
      date: string;
      venue: string;
      avgPrice: number;
    }>;
  };
}

export const useEventAnalytics = (eventId: string | undefined) => {
  return useQuery<EventAnalytics>({
    queryKey: ['event-analytics', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      console.log('Fetching analytics for event:', eventId);

      const { data, error } = await supabase.functions.invoke('get_event_analytics', {
        body: { eventId }
      });

      if (error) {
        console.error('Error fetching event analytics:', error);
        throw error;
      }

      console.log('Event analytics received:', data);
      return data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};