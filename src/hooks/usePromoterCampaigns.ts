import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PromoterCampaignsResponse, PromoterMetaCampaign, PromoterCampaignsParams } from '@/types/promoter.types';

// Transform database response to UI format
const transformCampaignsResponse = (data: PromoterMetaCampaign[]): PromoterCampaignsResponse => {
  console.log('🔄 [PROMOTER CAMPAIGNS] Transforming campaigns data:', {
    campaignsCount: data?.length || 0,
    hasData: !!data
  });

  if (!data || data.length === 0) {
    return {
      campaigns: [],
      summary: {
        total_campaigns: 0,
        active_campaigns: 0,
        unique_pages: 0,
        date_range: {
          earliest_start: null,
          latest_end: null
        }
      }
    };
  }

  // Calculate summary statistics
  const activeCampaigns = data.filter(campaign => 
    campaign.ad_status?.toLowerCase() === 'active'
  ).length;

  const uniquePages = new Set(
    data.flatMap(campaign => campaign.page_name || [])
  ).size;

  const dates = data
    .map(campaign => ({
      start: campaign.ad_start_date,
      end: campaign.ad_end_date
    }))
    .filter(date => date.start || date.end);

  const earliestStart = dates.length > 0 
    ? dates.reduce((earliest, current) => {
        if (!earliest || (current.start && current.start < earliest)) {
          return current.start;
        }
        return earliest;
      }, dates[0].start)
    : null;

  const latestEnd = dates.length > 0
    ? dates.reduce((latest, current) => {
        if (!latest || (current.end && current.end > latest)) {
          return current.end;
        }
        return latest;
      }, dates[0].end)
    : null;

  const transformed: PromoterCampaignsResponse = {
    campaigns: data,
    summary: {
      total_campaigns: data.length,
      active_campaigns: activeCampaigns,
      unique_pages: uniquePages,
      date_range: {
        earliest_start: earliestStart,
        latest_end: latestEnd
      }
    }
  };

  console.log('✅ [PROMOTER CAMPAIGNS] Campaigns data transformed:', {
    totalCampaigns: transformed.summary.total_campaigns,
    activeCampaigns: transformed.summary.active_campaigns,
    uniquePages: transformed.summary.unique_pages,
    dateRange: transformed.summary.date_range
  });

  return transformed;
};

// Main hook for fetching promoter campaigns
export const usePromoterCampaigns = (
  promoterId: string | undefined,
  params?: Omit<PromoterCampaignsParams, 'promoterId'>
) => {
  return useQuery<PromoterCampaignsResponse>({
    queryKey: ['promoter-campaigns', promoterId, params],
    queryFn: async () => {
      if (!promoterId) {
        throw new Error('Promoter ID is required');
      }

      console.log('📱 [PROMOTER CAMPAIGNS] Fetching campaigns:', {
        promoterId,
        params,
        timestamp: new Date().toISOString()
      });

      try {
        let query = supabase
          .from('promoters_total_campaigns_by_page')
          .select('*')
          .eq('promoter_id', promoterId);

        // Apply filters if provided
        if (params?.status) {
          query = query.eq('ad_status', params.status);
        }

        if (params?.dateRange?.start) {
          query = query.gte('ad_start_date', params.dateRange.start);
        }

        if (params?.dateRange?.end) {
          query = query.lte('ad_end_date', params.dateRange.end);
        }

        // Order by start date descending (most recent first)
        query = query.order('ad_start_date', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('❌ [PROMOTER CAMPAIGNS] Database error:', {
            promoterId,
            error: error.message,
            details: error.details,
            hint: error.hint
          });
          throw new Error(`Failed to fetch campaigns: ${error.message}`);
        }

        console.log('📥 [PROMOTER CAMPAIGNS] Raw data received:', {
          campaignsCount: data?.length || 0,
          hasData: !!data
        });

        return transformCampaignsResponse(data || []);

      } catch (campaignsError: any) {
        console.error('💥 [PROMOTER CAMPAIGNS] Query failed:', {
          promoterId,
          error: campaignsError.message,
          stack: campaignsError.stack
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
      
      // Retry up to 2 times for any error
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 10000);
      console.log('⏳ [PROMOTER CAMPAIGNS] Retry delay:', { attemptIndex, delay: delay + 'ms' });
      return delay;
    }
  });
};

// Hook to check if a promoter has campaign data
export const useHasPromoterCampaigns = (promoterId: string | undefined) => {
  const { data, isLoading, error } = usePromoterCampaigns(promoterId);
  
  const hasCampaigns = !isLoading && !error && data && data.campaigns.length > 0;
  
  console.log('🔍 [PROMOTER CAMPAIGNS] Has campaigns check:', {
    promoterId,
    isLoading,
    hasError: !!error,
    campaignsCount: data?.campaigns?.length || 0,
    hasCampaigns
  });
  
  return {
    hasCampaigns,
    isLoading,
    error,
    campaignsCount: data?.campaigns?.length || 0
  };
};

// Hook to get campaign summary statistics
export const usePromoterCampaignsSummary = (promoterId: string | undefined) => {
  const { data, isLoading, error } = usePromoterCampaigns(promoterId);
  
  return {
    summary: data?.summary,
    isLoading,
    error
  };
};