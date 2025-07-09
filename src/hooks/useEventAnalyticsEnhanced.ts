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

export interface SalesDataPoint {
  date: string; // ISO date string
  category: string;
  ticketsSold: number;
  revenue: number; // in TL
  remainingTickets: number;
  cumulativeTicketsSold: number;
  cumulativeRevenue: number;
}

export interface BubiletSalesHistory {
  eventId: string;
  categories: string[]; // Available categories for this event
  salesData: SalesDataPoint[];
  summary: {
    totalTicketsSold: number;
    totalRevenue: number;
    averageDailySales: number;
    salesVelocity: number; // tickets per day
    daysActive: number;
    peakSalesDate: string;
    remainingCapacity: number;
  };
  // Pre-sale and event metadata
  eventStatus: 'pre-sale' | 'on-sale' | 'sold-out' | 'ended';
  listingDate: string; // When event was first listed
  saleStartDate?: string; // When sales are expected to begin
  categoryCapacities: { [category: string]: number }; // Individual category limits
  totalCapacity: number; // Total event capacity
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
  bubiletSalesHistory: BubiletSalesHistory | null; // Sales history data for charts
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

        // Mock data - alternating between pre-sale and active sales based on eventId
        const isPreSale = eventId.endsWith('1') || eventId.endsWith('3') || eventId.endsWith('5');
        
        const mockSalesHistory: BubiletSalesHistory = isPreSale ? {
          // Pre-sale event (no sales yet)
          eventId: eventId,
          categories: ['VIP', 'Standard', 'Student'],
          salesData: [],
          summary: {
            totalTicketsSold: 0,
            totalRevenue: 0,
            averageDailySales: 0,
            salesVelocity: 0,
            daysActive: 7,
            peakSalesDate: '',
            remainingCapacity: 500
          },
          eventStatus: 'pre-sale' as const,
          listingDate: '2024-01-10T09:00:00Z',
          saleStartDate: '2024-01-20T10:00:00Z',
          categoryCapacities: {
            'VIP': 100,
            'Standard': 300,
            'Student': 100
          },
          totalCapacity: 500
        } : {
          // Active sales event
          eventId: eventId,
          categories: ['VIP', 'Standard', 'Student'],
          salesData: [
            { date: '2024-01-15', category: 'VIP', ticketsSold: 25, revenue: 62500, remainingTickets: 75, cumulativeTicketsSold: 25, cumulativeRevenue: 62500 },
            { date: '2024-01-16', category: 'VIP', ticketsSold: 30, revenue: 75000, remainingTickets: 45, cumulativeTicketsSold: 55, cumulativeRevenue: 137500 },
            { date: '2024-01-17', category: 'VIP', ticketsSold: 20, revenue: 50000, remainingTickets: 25, cumulativeTicketsSold: 75, cumulativeRevenue: 187500 },
            { date: '2024-01-15', category: 'Standard', ticketsSold: 50, revenue: 50000, remainingTickets: 150, cumulativeTicketsSold: 50, cumulativeRevenue: 50000 },
            { date: '2024-01-16', category: 'Standard', ticketsSold: 75, revenue: 75000, remainingTickets: 75, cumulativeTicketsSold: 125, cumulativeRevenue: 125000 },
            { date: '2024-01-17', category: 'Standard', ticketsSold: 60, revenue: 60000, remainingTickets: 15, cumulativeTicketsSold: 185, cumulativeRevenue: 185000 },
            { date: '2024-01-15', category: 'Student', ticketsSold: 40, revenue: 20000, remainingTickets: 60, cumulativeTicketsSold: 40, cumulativeRevenue: 20000 },
            { date: '2024-01-16', category: 'Student', ticketsSold: 35, revenue: 17500, remainingTickets: 25, cumulativeTicketsSold: 75, cumulativeRevenue: 37500 },
            { date: '2024-01-17', category: 'Student', ticketsSold: 25, revenue: 12500, remainingTickets: 0, cumulativeTicketsSold: 100, cumulativeRevenue: 50000 }
          ],
          summary: {
            totalTicketsSold: 360,
            totalRevenue: 372500,
            averageDailySales: 120,
            salesVelocity: 130,
            daysActive: 3,
            peakSalesDate: '2024-01-16',
            remainingCapacity: 140
          },
          eventStatus: 'on-sale' as const,
          listingDate: '2024-01-10T09:00:00Z',
          saleStartDate: '2024-01-15T10:00:00Z',
          categoryCapacities: {
            'VIP': 100,
            'Standard': 300,
            'Student': 100
          },
          totalCapacity: 500
        };

        // Return fallback data with mock sales history
        return {
          ...fallbackData,
          providers: {},
          hasBubiletData: true, // Set to true to show chart
          bubiletSalesHistory: mockSalesHistory
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