import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PromoterMetaCampaign } from '@/types/promoter.types';

// Main hook for fetching promoter campaigns using RPC function
export const usePromoterCampaigns = (promoterId: string | undefined) => {
  return useQuery<PromoterMetaCampaign[]>({
    queryKey: ['promoter-campaigns', promoterId],
    queryFn: async () => {
      if (!promoterId) {
        throw new Error('Promoter ID is required');
      }

      console.log('📱 [PROMOTER CAMPAIGNS] Fetching via RPC:', {
        promoterId,
        rpcFunction: 'get_promoter_campaigns'
      });

      try {
        const { data, error } = await supabase.rpc('get_promoter_campaigns', {
          promoter_uuid: promoterId
        });

        if (error) {
          console.error('❌ [PROMOTER CAMPAIGNS] RPC error:', {
            promoterId,
            error: error.message,
            details: error.details,
            hint: error.hint
          });
          throw new Error(`Failed to fetch campaigns: ${error.message}`);
        }

        console.log('📥 [PROMOTER CAMPAIGNS] RPC data received:', {
          campaignsCount: data?.length || 0,
          hasData: !!data,
          sampleCampaign: data?.[0]
        });

        return data || [];

      } catch (campaignsError: any) {
        console.error('💥 [PROMOTER CAMPAIGNS] RPC call failed:', {
          promoterId,
          error: campaignsError.message
        });
        
        throw campaignsError;
      }
    },
    enabled: !!promoterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('🔄 [PROMOTER CAMPAIGNS] Retry decision:', {
        failureCount,
        errorMessage: error?.message,
        willRetry: failureCount < 2
      });
      
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 10000);
      return delay;
    }
  });
};

// Hook to check if a promoter has campaign data
export const useHasPromoterCampaigns = (promoterId: string | undefined) => {
  const { data, isLoading, error } = usePromoterCampaigns(promoterId);
  
  const hasCampaigns = !isLoading && !error && data && data.length > 0;
  
  console.log('🔍 [PROMOTER CAMPAIGNS] Has campaigns check:', {
    promoterId,
    isLoading,
    hasError: !!error,
    campaignsCount: data?.length || 0,
    hasCampaigns
  });
  
  return {
    hasCampaigns,
    isLoading,
    error,
    campaignsCount: data?.length || 0
  };
};