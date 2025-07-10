import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MarketAnalyticsResponse } from '@/types/marketAnalytics';

export const useMarketAnalytics = () => {
  return useQuery<MarketAnalyticsResponse>({
    queryKey: ['market-analytics'],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching market analytics data...');
      }

      const { data, error } = await supabase.functions.invoke('get-market-analytics');

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching market analytics:', error);
        }
        throw error;
      }

      if (!data) {
        throw new Error('No market analytics data received');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Market analytics data received:', data);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Helper function to check if response has market analytics data
export const hasMarketAnalyticsData = (data: MarketAnalyticsResponse | undefined): data is MarketAnalyticsResponse => {
  return data !== undefined && 
         data.totals !== undefined && 
         Array.isArray(data.timeseries) &&
         data.provider_distribution !== undefined &&
         Array.isArray(data.genre_distribution);
};