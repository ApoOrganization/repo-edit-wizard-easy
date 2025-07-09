import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CategoryData {
  name: string;
  price: number | string;
  sold_out: boolean;
  last_update?: string;
}

export interface ProviderData {
  [providerName: string]: CategoryData[];
}

export interface EventAnalyticsEnhancedResponse {
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
  providers: ProviderData;
  hasBubiletData: boolean;
  bubiletSalesHistory: any; // Sales history data for charts
}

export const useEventAnalyticsEnhanced = (eventId: string | undefined) => {
  return useQuery<EventAnalyticsEnhancedResponse>({
    queryKey: ['event-analytics-enhanced', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      console.log('Fetching enhanced analytics for event:', eventId);

      // Call the enhanced analytics edge function
      const { data: analyticsData, error: analyticsError } = await supabase.functions.invoke('event-analytics-enhanced', {
        body: { eventId }
      });

      if (analyticsError) {
        console.error('Error fetching enhanced analytics:', analyticsError);
        
        // Fallback to regular analytics if enhanced fails
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('event-analytics', {
          body: { eventId }
        });

        if (fallbackError) {
          console.error('Error fetching fallback analytics:', fallbackError);
          throw fallbackError;
        }

        // Return fallback data with empty providers
        return {
          ...fallbackData,
          providers: {},
          hasBubiletData: false,
          bubiletSalesHistory: null
        };
      }

      console.log('Enhanced event analytics received:', analyticsData);
      return analyticsData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};