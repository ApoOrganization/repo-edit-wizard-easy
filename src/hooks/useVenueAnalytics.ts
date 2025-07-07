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
  console.log('🔄 [VENUE ANALYTICS] Transforming basic data to analytics format:', {
    hasBasicData: !!basicData,
    basicDataKeys: basicData ? Object.keys(basicData) : [],
    id: basicData?.id,
    name: basicData?.name,
    city: basicData?.city,
    capacity: basicData?.capacity,
    totalEvents: basicData?.total_events,
    avgPrice: basicData?.avg_ticket_price
  });
  
  const transformed = {
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
  
  console.log('✅ [VENUE ANALYTICS] Transformation completed:', {
    venue: transformed.venue.name,
    hasEventStats: !!transformed.venue.event_stats,
    totalEvents: transformed.venue.event_stats.total_events
  });
  
  return transformed;
};

// Main venue analytics hook with enhanced debugging
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
      
      const startTime = Date.now();
      console.log('🏟️ [VENUE ANALYTICS] Starting request:', {
        venueId,
        timeRange,
        compareWith,
        timestamp: new Date().toISOString()
      });
      
      try {
        // Prepare request body
        const requestBody = {
          venueId,
          timeRange,
          compareWith
        };
        
        console.log('📤 [VENUE ANALYTICS] Request body:', JSON.stringify(requestBody, null, 2));
        
        // Try analytics function first
        const requestStartTime = Date.now();
        console.log('🌐 [VENUE ANALYTICS] Making Edge Function request:', {
          url: 'venue-analytics',
          method: 'POST',
          headers: 'Supabase managed',
          bodyStringified: JSON.stringify(requestBody),
          timestamp: new Date().toISOString()
        });
        
        const { data, error } = await supabase.functions.invoke('venue-analytics', {
          body: requestBody
        });
        
        const requestDuration = Date.now() - requestStartTime;
        console.log('⏱️ [VENUE ANALYTICS] Request completed:', {
          duration: requestDuration + 'ms',
          hasError: !!error,
          hasData: !!data,
          errorType: error?.name,
          statusCode: error?.context?.res?.status,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('❌ [VENUE ANALYTICS] Edge Function error:', {
            venueId,
            error: {
              message: error.message,
              name: error.name,
              context: error.context,
              stack: error.stack
            },
            status: error.context?.res?.status,
            headers: error.context?.res?.headers,
            requestDuration
          });
          
          // Check if it's a 500 error or other server error
          if (error.context?.res?.status >= 500) {
            console.warn('🔄 [VENUE ANALYTICS] Server error detected (status >= 500), falling back to basic venue data');
            const fallbackData = await getBasicVenueData(venueId);
            const transformedData = transformToVenueAnalyticsFormat(fallbackData);
            console.log('✅ [VENUE ANALYTICS] Fallback transformation successful:', {
              venue: transformedData.venue.name,
              hasAnalytics: !!transformedData.analytics
            });
            return transformedData;
          }
          
          // Check for CORS or other network errors
          if (error.name === 'FunctionsFetchError') {
            console.error('🌐 [VENUE ANALYTICS] Network/CORS error detected, falling back');
            const fallbackData = await getBasicVenueData(venueId);
            return transformToVenueAnalyticsFormat(fallbackData);
          }
          
          throw new Error(`Venue analytics function failed: ${error.message}`);
        }

        console.log('📥 [VENUE ANALYTICS] Raw response received:', {
          dataType: typeof data,
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          dataStringified: data ? JSON.stringify(data, null, 2).substring(0, 500) + '...' : null,
          dataStructure: data ? {
            hasVenue: !!data.venue,
            hasAnalytics: !!data.analytics,
            hasTimeSeries: !!data.timeSeries,
            venueKeys: data.venue ? Object.keys(data.venue) : [],
            analyticsKeys: data.analytics ? Object.keys(data.analytics) : [],
            timeSeriesLength: data.timeSeries ? data.timeSeries.length : 0,
            venueId: data.venue?.id,
            venueName: data.venue?.name,
            analyticsTimeRange: data.analytics?.timeRange,
            analyticsUniqueArtists: data.analytics?.uniqueArtists
          } : null
        });

        // Validate response structure
        if (!data) {
          console.warn('⚠️ [VENUE ANALYTICS] Null/undefined response, falling back to basic data');
          const fallbackData = await getBasicVenueData(venueId);
          return transformToVenueAnalyticsFormat(fallbackData);
        }

        if (!data.venue) {
          console.warn('⚠️ [VENUE ANALYTICS] No venue property in response, falling back to basic data');
          console.log('📋 [VENUE ANALYTICS] Full response for debugging:', JSON.stringify(data, null, 2));
          const fallbackData = await getBasicVenueData(venueId);
          return transformToVenueAnalyticsFormat(fallbackData);
        }

        // Validate venue data structure
        const venue = data.venue;
        console.log('🏛️ [VENUE ANALYTICS] Venue data validation:', {
          hasId: !!venue.id,
          hasName: !!venue.name,
          hasCity: !!venue.city,
          hasCapacity: venue.capacity !== undefined,
          hasEventStats: !!venue.event_stats,
          hasUtilizationMetrics: !!venue.utilization_metrics,
          hasPricingAnalytics: !!venue.pricing_analytics,
          hasTopArtists: !!venue.top_artists,
          hasDayDistribution: !!venue.day_of_week_distribution
        });

        // Validate analytics data
        const analytics = data.analytics;
        console.log('📊 [VENUE ANALYTICS] Analytics data validation:', {
          hasAnalytics: !!analytics,
          hasTimeRange: analytics?.timeRange,
          hasUniqueArtists: analytics?.uniqueArtists !== undefined,
          hasArtistReturnRate: analytics?.artistReturnRate !== undefined,
          hasPeakDays: !!analytics?.peakDays,
          peakDaysLength: analytics?.peakDays?.length || 0
        });

        // Validate time series data
        const timeSeries = data.timeSeries;
        console.log('📈 [VENUE ANALYTICS] Time series validation:', {
          hasTimeSeries: !!timeSeries,
          isArray: Array.isArray(timeSeries),
          length: timeSeries?.length || 0,
          firstItem: timeSeries?.[0] ? Object.keys(timeSeries[0]) : []
        });

        const totalDuration = Date.now() - startTime;
        console.log('✅ [VENUE ANALYTICS] Analytics data loaded successfully:', {
          venue: venue.name,
          city: venue.city,
          totalEvents: venue.event_stats?.total_events,
          uniqueArtists: analytics?.uniqueArtists,
          timeSeriesPoints: timeSeries?.length,
          totalDuration: totalDuration + 'ms'
        });
        
        // CRITICAL: Log exactly what we're returning to detect fallback later
        console.log('🔍 [VENUE ANALYTICS] FINAL RETURN DATA PREVIEW:', {
          isFromEdgeFunction: true,
          venue: {
            id: data.venue?.id,
            name: data.venue?.name,
            hasEventStats: !!data.venue?.event_stats,
            totalEvents: data.venue?.event_stats?.total_events
          },
          analytics: {
            timeRange: data.analytics?.timeRange,
            uniqueArtists: data.analytics?.uniqueArtists,
            hasNonZeroArtists: (data.analytics?.uniqueArtists || 0) > 0
          },
          timeSeries: {
            length: data.timeSeries?.length || 0,
            hasData: (data.timeSeries?.length || 0) > 0
          }
        });
        
        return data;
        
      } catch (analyticsError: any) {
        const totalDuration = Date.now() - startTime;
        console.error('💥 [VENUE ANALYTICS] Function completely failed:', {
          venueId,
          error: {
            message: analyticsError.message,
            name: analyticsError.name,
            stack: analyticsError.stack
          },
          totalDuration: totalDuration + 'ms'
        });
        
        // Fall back to basic venue data
        try {
          console.log('🔄 [VENUE ANALYTICS] Attempting fallback to basic venue data...');
          const fallbackStartTime = Date.now();
          const fallbackData = await getBasicVenueData(venueId);
          const fallbackDuration = Date.now() - fallbackStartTime;
          
          console.log('📋 [VENUE ANALYTICS] Fallback data received:', {
            hasData: !!fallbackData,
            fallbackKeys: fallbackData ? Object.keys(fallbackData) : [],
            fallbackDuration: fallbackDuration + 'ms'
          });
          
          const transformedData = transformToVenueAnalyticsFormat(fallbackData);
          console.log('✅ [VENUE ANALYTICS] Fallback venue data loaded successfully:', {
            venue: transformedData.venue.name,
            isFallback: true
          });
          return transformedData;
        } catch (fallbackError: any) {
          console.error('💥 [VENUE ANALYTICS] Both analytics and fallback failed:', {
            venueId,
            analyticsError: analyticsError.message,
            fallbackError: fallbackError.message,
            totalDuration: (Date.now() - startTime) + 'ms'
          });
          
          // Return minimal data structure to prevent complete failure
          console.log('🚨 [VENUE ANALYTICS] Returning minimal error data structure');
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
      console.log('🔄 [VENUE ANALYTICS] Retry decision:', {
        failureCount,
        errorStatus: error?.context?.res?.status,
        errorName: error?.name,
        willRetry: !(error?.context?.res?.status >= 400 && error?.context?.res?.status < 500) && failureCount < 3
      });
      
      // Don't retry on 404 or 400 errors (client errors)
      if (error?.context?.res?.status >= 400 && error?.context?.res?.status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
      console.log('⏳ [VENUE ANALYTICS] Retry delay:', { attemptIndex, delay: delay + 'ms' });
      return delay;
    }
  });
};

// Hook to check if venue analytics data is from fallback
export const useIsVenueAnalyticsFallback = (analyticsData: VenueAnalyticsResponse | undefined) => {
  if (!analyticsData) {
    console.log('🔍 [VENUE ANALYTICS] Fallback detection: No data available');
    return true;
  }
  
  // Enhanced fallback detection criteria
  const indicators = {
    unknownVenueName: analyticsData.venue?.name === 'Unknown Venue',
    zeroUniqueArtists: analyticsData.analytics?.uniqueArtists === 0,
    emptyTimeSeries: (analyticsData.timeSeries?.length || 0) === 0,
    missingTopArtists: !analyticsData.venue?.top_artists || analyticsData.venue.top_artists.length === 0,
    missingDayDistribution: !analyticsData.venue?.day_of_week_distribution || analyticsData.venue.day_of_week_distribution.length === 0,
    zeroCapacityUtilization: analyticsData.venue?.utilization_metrics?.capacity_utilization === 0,
    emptyPeakMonths: !analyticsData.venue?.utilization_metrics?.peak_months || analyticsData.venue.utilization_metrics.peak_months.length === 0
  };
  
  // Consider it fallback if multiple indicators are true
  const fallbackIndicatorCount = Object.values(indicators).filter(Boolean).length;
  const isFallback = indicators.unknownVenueName || 
                    (indicators.zeroUniqueArtists && indicators.emptyTimeSeries) ||
                    fallbackIndicatorCount >= 3;
  
  console.log('🔍 [VENUE ANALYTICS] Enhanced fallback detection:', {
    venueName: analyticsData.venue?.name,
    venueId: analyticsData.venue?.id,
    indicators,
    fallbackIndicatorCount,
    isFallback,
    dataSource: isFallback ? 'FALLBACK (venue_list_summary)' : 'EDGE FUNCTION (venue-analytics)'
  });
  
  return isFallback;
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
        // Convert boolean includePast to string time_filter
        const timeFilter = includePast ? 'past' : 'upcoming';
        
        console.log('🎫 [VENUE EVENTS] RPC parameters:', {
          venue_uuid: venueId,
          time_filter: timeFilter,
          limit_count: 10,
          offset_count: 0
        });
        
        // Call venue events RPC function with correct parameters
        const { data, error } = await supabase.rpc('get_venue_events', {
          venue_uuid: venueId,
          time_filter: timeFilter,
          limit_count: 10,
          offset_count: 0
        });

        if (error) {
          console.error('❌ Venue events RPC error:', {
            venueId,
            timeFilter,
            includePast,
            error: error.message,
            fullError: error
          });
          
          // Return empty events instead of failing
          return { events: [] };
        }

        console.log('✅ Venue events loaded successfully:', data?.length || 0, 'events');
        return { events: data || [] };
        
      } catch (eventsError: any) {
        console.error('💥 Venue events fetch completely failed:', {
          venueId,
          timeFilter: includePast ? 'past' : 'upcoming',
          includePast,
          error: eventsError.message,
          stack: eventsError.stack
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