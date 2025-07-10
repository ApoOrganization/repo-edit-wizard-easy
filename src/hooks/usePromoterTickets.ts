import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  PromoterTicketsResponse,
  PromoterTicketsError,
  PromoterTicketsResult,
  TimeSeriesPoint,
  TicketTotals
} from '@/types/ticketAnalytics';

// Re-export for backward compatibility
export type PromoterTimeSeriesPoint = TimeSeriesPoint;
export type PromoterTicketTotals = TicketTotals;
export type { PromoterTicketsResponse, PromoterTicketsError, PromoterTicketsResult };

export const usePromoterTickets = (promoterId: string | undefined) => {
  return useQuery<PromoterTicketsResult>({
    queryKey: ['promoter-tickets', promoterId],
    queryFn: async () => {
      if (!promoterId) throw new Error('Promoter ID is required');

      console.log('Fetching promoter ticket data for:', promoterId);

      // Call the new get-promoter-tickets edge function
      const { data, error } = await supabase.functions.invoke('get-promoter-tickets', {
        body: { promoter_id: promoterId }
      });

      if (error) {
        console.error('Error fetching promoter ticket data:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No promoter ticket data received');
      }

      console.log('Promoter ticket data received:', data);
      return data;
    },
    enabled: !!promoterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Helper function to check if response has ticket data
export const hasPromoterTicketData = (result: PromoterTicketsResult | undefined): result is PromoterTicketsResponse => {
  return result !== undefined && !('error' in result);
};

// Helper function to check if response is an error
export const isPromoterTicketError = (result: PromoterTicketsResult | undefined): result is PromoterTicketsError => {
  return result !== undefined && 'error' in result;
};