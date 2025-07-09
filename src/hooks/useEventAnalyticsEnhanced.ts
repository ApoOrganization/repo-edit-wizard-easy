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
}

export const useEventAnalyticsEnhanced = (eventId: string | undefined) => {
  return useQuery<EventAnalyticsEnhancedResponse>({
    queryKey: ['event-analytics-enhanced', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      console.log('Fetching enhanced analytics for event:', eventId);

      // For now, we'll extend the existing analytics with mock provider data
      // In production, this would come from the edge function
      const { data: analyticsData, error: analyticsError } = await supabase.functions.invoke('event-analytics', {
        body: { eventId }
      });

      if (analyticsError) {
        console.error('Error fetching event analytics:', analyticsError);
        throw analyticsError;
      }

      // Mock provider data structure - in production this would come from the API
      const mockProviders: ProviderData = {
        'biletix': [
          { name: 'VIP', price: 2500, sold_out: false, last_update: new Date().toISOString() },
          { name: 'Backstage', price: 1800, sold_out: false, last_update: new Date().toISOString() },
          { name: 'Premium', price: 1200, sold_out: true, last_update: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Standard', price: 800, sold_out: true, last_update: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        'bubilet': [
          { name: 'VIP', price: 2400, sold_out: false, last_update: new Date().toISOString() },
          { name: 'Normal', price: 1000, sold_out: false, last_update: new Date().toISOString() },
          { name: 'Student', price: 600, sold_out: true, last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        'passo': [
          { name: 'Early Bird VIP', price: 2200, sold_out: true, last_update: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Regular VIP', price: 2600, sold_out: false, last_update: new Date().toISOString() },
          { name: 'General Admission', price: 900, sold_out: false, last_update: new Date().toISOString() }
        ]
      };

      // Return enhanced data structure
      const enhancedData: EventAnalyticsEnhancedResponse = {
        ...analyticsData,
        providers: mockProviders
      };

      console.log('Enhanced event analytics received:', enhancedData);
      return enhancedData;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};