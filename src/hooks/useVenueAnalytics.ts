import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { VenueAnalyticsResponse, VenueAnalyticsParams, VenueDetailsFull } from '@/types/venue.types';

// Fallback function to get basic venue data
const getBasicVenueData = async (venueId: string) => {
  const { data, error } = await supabase
    .from('venue_list_summary')
    .select('*')
    .eq('id', venueId)
    .single();
  
  if (error) {
    console.error('Fallback venue data error:', error);
    throw error;
  }
  
  return data;
};

// Transform basic venue data to analytics format
const transformToVenueAnalyticsFormat = (basicData: any): VenueAnalyticsResponse => {
  return {
    venue: {
      id: basicData?.id || '',
      name: basicData?.name || 'Unknown Venue',
      city: basicData?.city || 'Unknown City',
      capacity: basicData?.capacity || 0,
      event_stats: {
        total_events: basicData?.total_events || 0,
        upcoming_events: basicData?.upcoming_events || 0,
        recent_events: basicData?.recent_events || 0
      },
      utilization_metrics: {
        avg_events_per_month: 0,
        capacity_utilization: 0,
        peak_months: []
      },
      pricing_analytics: {
        avg_ticket_price: basicData?.avg_ticket_price || 0,
        price_range: {
          min: 0,
          max: basicData?.avg_ticket_price || 0
        }
      },
      top_artists: [],
      day_of_week_distribution: []
    },
    analytics: {
      timeRange: 'year',
      uniqueArtists: 0,
      artistReturnRate: 0,
      peakDays: []
    },
    timeSeries: []
  };
};

// Main venue analytics hook with robust error handling
export const useVenueAnalytics = (
  venueId: string | undefined,
  timeRange: 'month' | 'quarter' | 'year' | 'all' = 'year',
  compareWith: string[] = []
) => {
  return useQuery<VenueAnalyticsResponse>({
    queryKey: ['venue-analytics', venueId, timeRange, compareWith],
    queryFn: async () => {
      if (!venueId) {
        throw new Error('Venue ID is required');
      }
      
      console.log('🏟️ Fetching analytics for venue:', { venueId, timeRange, compareWith });
      
      try {
        // Try analytics function first
        const { data, error } = await supabase.functions.invoke('venue-analytics', {
          body: {
            venueId,
            timeRange,
            compareWith
          }
        });

        if (error) {
          console.error('❌ Venue analytics function error:', {
            venueId,
            error: error.message,
            status: error.context?.res?.status
          });
          
          // Check if it's a 500 error or other server error
          if (error.context?.res?.status >= 500) {
            console.warn('🔄 Server error detected, falling back to basic venue data');
            const fallbackData = await getBasicVenueData(venueId);
            return transformToVenueAnalyticsFormat(fallbackData);
          }
          
          throw new Error(`Venue analytics function failed: ${error.message}`);
        }

        if (!data || !data.venue) {
          console.warn('⚠️ No venue data returned, falling back to basic data');
          const fallbackData = await getBasicVenueData(venueId);
          return transformToVenueAnalyticsFormat(fallbackData);
        }

        console.log('✅ Venue analytics data loaded successfully for:', data.venue.name);
        return data;
        
      } catch (analyticsError: any) {
        console.error('💥 Venue analytics function completely failed:', {
          venueId,
          error: analyticsError.message
        });
        
        // Fall back to basic venue data
        try {
          console.log('🔄 Attempting fallback to basic venue data...');
          const fallbackData = await getBasicVenueData(venueId);
          console.log('✅ Fallback venue data loaded successfully');
          return transformToVenueAnalyticsFormat(fallbackData);
        } catch (fallbackError: any) {
          console.error('💥 Both analytics and fallback failed:', {
            venueId,
            analyticsError: analyticsError.message,
            fallbackError: fallbackError.message
          });
          
          // Return minimal data structure to prevent complete failure
          return {
            venue: {
              id: venueId,
              name: 'Venue Not Found',
              city: 'Unknown',
              capacity: 0,
              event_stats: { total_events: 0, upcoming_events: 0, recent_events: 0 },
              utilization_metrics: { avg_events_per_month: 0, capacity_utilization: 0, peak_months: [] },
              pricing_analytics: { avg_ticket_price: 0, price_range: { min: 0, max: 0 } },
              top_artists: [],
              day_of_week_distribution: []
            },
            analytics: {
              timeRange: 'year',
              uniqueArtists: 0,
              artistReturnRate: 0,
              peakDays: []
            },
            timeSeries: []
          };
        }
      }
    },
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or 400 errors (client errors)
      if (error?.context?.res?.status >= 400 && error?.context?.res?.status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// Hook to check if venue analytics data is from fallback
export const useIsVenueAnalyticsFallback = (analyticsData: VenueAnalyticsResponse | undefined) => {
  return analyticsData?.venue?.name === 'Unknown Venue' || 
         analyticsData?.analytics?.uniqueArtists === 0 && 
         analyticsData?.timeSeries?.length === 0;
};

// Hook to check if venue analytics data is error state
export const useIsVenueAnalyticsError = (analyticsData: VenueAnalyticsResponse | undefined) => {
  return analyticsData?.venue?.name === 'Venue Not Found';
};

// Hook for venue events (if separate RPC function exists)
export const useVenueEvents = (
  venueId: string | undefined, 
  includePast: boolean = false, 
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['venue-events', venueId, includePast],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID is required');
      
      console.log('🎫 Fetching events for venue:', { venueId, includePast });
      
      try {
        // Try to call venue events RPC function if it exists
        const { data, error } = await supabase.rpc('get_venue_events', {
          venue_uuid: venueId,
          include_past: includePast,
          limit_count: 10
        });

        if (error) {
          console.error('❌ Venue events RPC error:', {
            venueId,
            includePast,
            error: error.message
          });
          
          // Return empty events instead of failing
          return { events: [] };
        }

        console.log('✅ Venue events loaded successfully:', data?.length || 0, 'events');
        return { events: data || [] };
        
      } catch (eventsError: any) {
        console.error('💥 Venue events fetch completely failed:', {
          venueId,
          includePast,
          error: eventsError.message
        });
        
        // Return empty events instead of failing completely
        return { events: [] };
      }
    },
    enabled: !!venueId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Venue upcoming events hook
export const useVenueUpcomingEvents = (venueId: string | undefined, enabled: boolean = false) => {
  return useVenueEvents(venueId, false, enabled);
};

// Venue past events hook
export const useVenuePastEvents = (venueId: string | undefined, enabled: boolean = false) => {
  return useVenueEvents(venueId, true, enabled);
};