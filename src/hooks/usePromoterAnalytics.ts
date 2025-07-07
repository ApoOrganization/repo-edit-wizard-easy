import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PromoterAnalyticsResponse, PromoterAnalyticsParams, PromoterDetailsFull } from '@/types/promoter.types';

// Fallback function to get basic promoter data
const getBasicPromoterData = async (promoterId: string) => {
  const { data, error } = await supabase
    .from('promoter_list_summary')
    .select('*')
    .eq('id', promoterId)
    .single();
  
  if (error) {
    console.error('Fallback promoter data error:', error);
    throw error;
  }
  
  return data;
};

// Transform basic promoter data to analytics format
const transformToPromoterAnalyticsFormat = (basicData: any): PromoterAnalyticsResponse => {
  console.log('🔄 [PROMOTER ANALYTICS] Transforming basic data to analytics format:', {
    hasBasicData: !!basicData,
    basicDataKeys: basicData ? Object.keys(basicData) : [],
    id: basicData?.id,
    name: basicData?.name,
    city: basicData?.city,
    specialty: basicData?.specialty,
    totalEvents: basicData?.total_events,
    totalRevenue: basicData?.total_revenue
  });
  
  const transformed = {
    promoter: {
      id: basicData?.id || '',
      name: basicData?.name || 'Unknown Promoter',
      normalized_name: basicData?.normalized_name || '',
      city: basicData?.city || 'Unknown City',
      specialty: basicData?.specialty || 'General',
      contact_info: {
        email: null,
        phone: null,
        website: null,
        instagram_link: null
      },
      business_stats: {
        total_events: basicData?.total_events || 0,
        upcoming_events: basicData?.upcoming_events || 0,
        venues_used: basicData?.venues_used || 0,
        genres_promoted: basicData?.genres_promoted || 0,
        years_active: 1
      },
      financial_metrics: {
        total_revenue: basicData?.total_revenue || 0,
        avg_event_revenue: basicData?.avg_event_revenue || 0,
        revenue_growth_rate: 0,
        profit_margin: 0
      },
      performance_metrics: {
        success_rate: 0,
        artist_retention_rate: 0,
        venue_loyalty_score: 0,
        market_reputation: 0
      }
    },
    analytics: {
      timeRange: 'year',
      businessMetrics: {
        revenue_performance: {
          total_revenue: basicData?.total_revenue || 0,
          avg_event_revenue: basicData?.avg_event_revenue || 0,
          revenue_growth_rate: 0,
          revenue_per_venue: basicData?.venues_used ? (basicData?.total_revenue || 0) / basicData.venues_used : 0
        },
        operational_efficiency: {
          events_per_month: (basicData?.total_events || 0) / 12,
          venue_utilization_rate: 0,
          artist_booking_success_rate: 0,
          cost_per_event: 0
        },
        market_metrics: {
          market_share: 0,
          competitive_position: 0,
          brand_recognition_score: 0,
          customer_satisfaction: 0
        }
      },
      performanceScore: 0,
      marketPosition: 'Emerging'
    },
    genreAnalytics: [],
    venueAnalytics: [],
    artistCollaborations: [],
    timeSeries: []
  };
  
  console.log('✅ [PROMOTER ANALYTICS] Transformation completed:', {
    promoter: transformed.promoter.name,
    hasBusinessStats: !!transformed.promoter.business_stats,
    totalEvents: transformed.promoter.business_stats.total_events
  });
  
  return transformed;
};

// Main promoter analytics hook with enhanced debugging
export const usePromoterAnalytics = (
  promoterId: string | undefined,
  timeRange: 'month' | 'quarter' | 'year' | 'all' = 'year',
  includeComparisons: boolean = false
) => {
  return useQuery<PromoterAnalyticsResponse>({
    queryKey: ['promoter-analytics', promoterId, timeRange, includeComparisons],
    queryFn: async () => {
      if (!promoterId) {
        throw new Error('Promoter ID is required');
      }
      
      const startTime = Date.now();
      console.log('🎭 [PROMOTER ANALYTICS] Starting request:', {
        promoterId,
        timeRange,
        includeComparisons,
        timestamp: new Date().toISOString()
      });
      
      try {
        // Prepare request body
        const requestBody = {
          promoterId,
          timeRange,
          includeComparisons
        };
        
        console.log('📤 [PROMOTER ANALYTICS] Request body:', JSON.stringify(requestBody, null, 2));
        
        // Try analytics function first
        const requestStartTime = Date.now();
        console.log('🌐 [PROMOTER ANALYTICS] Making Edge Function request:', {
          url: 'promoter-analytics',
          method: 'POST',
          headers: 'Supabase managed',
          bodyStringified: JSON.stringify(requestBody),
          timestamp: new Date().toISOString()
        });
        
        const { data, error } = await supabase.functions.invoke('promoter-analytics', {
          body: requestBody
        });
        
        const requestDuration = Date.now() - requestStartTime;
        console.log('⏱️ [PROMOTER ANALYTICS] Request completed:', {
          duration: requestDuration + 'ms',
          hasError: !!error,
          hasData: !!data,
          errorType: error?.name,
          statusCode: error?.context?.res?.status,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('❌ [PROMOTER ANALYTICS] Edge Function error:', {
            promoterId,
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
            console.warn('🔄 [PROMOTER ANALYTICS] Server error detected (status >= 500), falling back to basic promoter data');
            const fallbackData = await getBasicPromoterData(promoterId);
            const transformedData = transformToPromoterAnalyticsFormat(fallbackData);
            console.log('✅ [PROMOTER ANALYTICS] Fallback transformation successful:', {
              promoter: transformedData.promoter.name,
              hasAnalytics: !!transformedData.analytics
            });
            return transformedData;
          }
          
          // Check for CORS or other network errors
          if (error.name === 'FunctionsFetchError') {
            console.error('🌐 [PROMOTER ANALYTICS] Network/CORS error detected, falling back');
            const fallbackData = await getBasicPromoterData(promoterId);
            return transformToPromoterAnalyticsFormat(fallbackData);
          }
          
          throw new Error(`Promoter analytics function failed: ${error.message}`);
        }

        console.log('📥 [PROMOTER ANALYTICS] Raw response received:', {
          dataType: typeof data,
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          dataStringified: data ? JSON.stringify(data, null, 2).substring(0, 500) + '...' : null,
          dataStructure: data ? {
            hasPromoter: !!data.promoter,
            hasAnalytics: !!data.analytics,
            hasGenreAnalytics: !!data.genreAnalytics,
            hasVenueAnalytics: !!data.venueAnalytics,
            promoterKeys: data.promoter ? Object.keys(data.promoter) : [],
            analyticsKeys: data.analytics ? Object.keys(data.analytics) : [],
            genreAnalyticsLength: data.genreAnalytics ? data.genreAnalytics.length : 0,
            venueAnalyticsLength: data.venueAnalytics ? data.venueAnalytics.length : 0
          } : null
        });

        // Validate response structure
        if (!data) {
          console.warn('⚠️ [PROMOTER ANALYTICS] Null/undefined response, falling back to basic data');
          const fallbackData = await getBasicPromoterData(promoterId);
          return transformToPromoterAnalyticsFormat(fallbackData);
        }

        if (!data.promoter) {
          console.warn('⚠️ [PROMOTER ANALYTICS] No promoter property in response, falling back to basic data');
          console.log('📋 [PROMOTER ANALYTICS] Full response for debugging:', JSON.stringify(data, null, 2));
          const fallbackData = await getBasicPromoterData(promoterId);
          return transformToPromoterAnalyticsFormat(fallbackData);
        }

        // Validate promoter data structure
        const promoter = data.promoter;
        console.log('🎭 [PROMOTER ANALYTICS] Promoter data validation:', {
          hasId: !!promoter.id,
          hasName: !!promoter.name,
          hasCity: !!promoter.city,
          hasSpecialty: !!promoter.specialty,
          hasBusinessStats: !!promoter.business_stats,
          hasFinancialMetrics: !!promoter.financial_metrics,
          hasPerformanceMetrics: !!promoter.performance_metrics,
          hasContactInfo: !!promoter.contact_info
        });

        // Validate analytics data
        const analytics = data.analytics;
        console.log('📊 [PROMOTER ANALYTICS] Analytics data validation:', {
          hasAnalytics: !!analytics,
          hasBusinessMetrics: !!analytics?.businessMetrics,
          hasPerformanceScore: analytics?.performanceScore !== undefined,
          hasMarketPosition: !!analytics?.marketPosition,
          timeRange: analytics?.timeRange
        });

        // Validate additional analytics data
        console.log('📈 [PROMOTER ANALYTICS] Additional data validation:', {
          hasGenreAnalytics: !!data.genreAnalytics,
          genreAnalyticsLength: data.genreAnalytics?.length || 0,
          hasVenueAnalytics: !!data.venueAnalytics,
          venueAnalyticsLength: data.venueAnalytics?.length || 0,
          hasArtistCollaborations: !!data.artistCollaborations,
          artistCollaborationsLength: data.artistCollaborations?.length || 0,
          hasTimeSeries: !!data.timeSeries,
          timeSeriesLength: data.timeSeries?.length || 0
        });

        const totalDuration = Date.now() - startTime;
        console.log('✅ [PROMOTER ANALYTICS] Analytics data loaded successfully:', {
          promoter: promoter.name,
          city: promoter.city,
          specialty: promoter.specialty,
          totalEvents: promoter.business_stats?.total_events,
          totalRevenue: promoter.financial_metrics?.total_revenue,
          performanceScore: analytics?.performanceScore,
          genreAnalyticsCount: data.genreAnalytics?.length || 0,
          venueAnalyticsCount: data.venueAnalytics?.length || 0,
          totalDuration: totalDuration + 'ms'
        });
        
        // CRITICAL: Log exactly what we're returning to detect fallback later
        console.log('🔍 [PROMOTER ANALYTICS] FINAL RETURN DATA PREVIEW:', {
          isFromEdgeFunction: true,
          promoter: {
            id: data.promoter?.id,
            name: data.promoter?.name,
            hasBusinessStats: !!data.promoter?.business_stats,
            totalEvents: data.promoter?.business_stats?.total_events
          },
          analytics: {
            timeRange: data.analytics?.timeRange,
            performanceScore: data.analytics?.performanceScore,
            hasBusinessMetrics: !!data.analytics?.businessMetrics
          },
          dataArrays: {
            genreAnalyticsLength: data.genreAnalytics?.length || 0,
            venueAnalyticsLength: data.venueAnalytics?.length || 0,
            timeSeriesLength: data.timeSeries?.length || 0
          }
        });
        
        return data;
        
      } catch (analyticsError: any) {
        const totalDuration = Date.now() - startTime;
        console.error('💥 [PROMOTER ANALYTICS] Function completely failed:', {
          promoterId,
          error: {
            message: analyticsError.message,
            name: analyticsError.name,
            stack: analyticsError.stack
          },
          totalDuration: totalDuration + 'ms'
        });
        
        // Fall back to basic promoter data
        try {
          console.log('🔄 [PROMOTER ANALYTICS] Attempting fallback to basic promoter data...');
          const fallbackStartTime = Date.now();
          const fallbackData = await getBasicPromoterData(promoterId);
          const fallbackDuration = Date.now() - fallbackStartTime;
          
          console.log('📋 [PROMOTER ANALYTICS] Fallback data received:', {
            hasData: !!fallbackData,
            fallbackKeys: fallbackData ? Object.keys(fallbackData) : [],
            fallbackDuration: fallbackDuration + 'ms'
          });
          
          const transformedData = transformToPromoterAnalyticsFormat(fallbackData);
          console.log('✅ [PROMOTER ANALYTICS] Fallback promoter data loaded successfully:', {
            promoter: transformedData.promoter.name,
            isFallback: true
          });
          return transformedData;
        } catch (fallbackError: any) {
          console.error('💥 [PROMOTER ANALYTICS] Both analytics and fallback failed:', {
            promoterId,
            analyticsError: analyticsError.message,
            fallbackError: fallbackError.message,
            totalDuration: (Date.now() - startTime) + 'ms'
          });
          
          // Return minimal data structure to prevent complete failure
          console.log('🚨 [PROMOTER ANALYTICS] Returning minimal error data structure');
          return {
            promoter: {
              id: promoterId,
              name: 'Promoter Not Found',
              normalized_name: '',
              city: 'Unknown',
              specialty: 'Unknown',
              contact_info: {
                email: null,
                phone: null,
                website: null,
                instagram_link: null
              },
              business_stats: {
                total_events: 0,
                upcoming_events: 0,
                venues_used: 0,
                genres_promoted: 0,
                years_active: 0
              },
              financial_metrics: {
                total_revenue: 0,
                avg_event_revenue: 0,
                revenue_growth_rate: 0,
                profit_margin: 0
              },
              performance_metrics: {
                success_rate: 0,
                artist_retention_rate: 0,
                venue_loyalty_score: 0,
                market_reputation: 0
              }
            },
            analytics: {
              timeRange: 'year',
              businessMetrics: {
                revenue_performance: {
                  total_revenue: 0,
                  avg_event_revenue: 0,
                  revenue_growth_rate: 0,
                  revenue_per_venue: 0
                },
                operational_efficiency: {
                  events_per_month: 0,
                  venue_utilization_rate: 0,
                  artist_booking_success_rate: 0,
                  cost_per_event: 0
                },
                market_metrics: {
                  market_share: 0,
                  competitive_position: 0,
                  brand_recognition_score: 0,
                  customer_satisfaction: 0
                }
              },
              performanceScore: 0,
              marketPosition: 'Unknown'
            },
            genreAnalytics: [],
            venueAnalytics: [],
            artistCollaborations: [],
            timeSeries: []
          };
        }
      }
    },
    enabled: !!promoterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('🔄 [PROMOTER ANALYTICS] Retry decision:', {
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
      console.log('⏳ [PROMOTER ANALYTICS] Retry delay:', { attemptIndex, delay: delay + 'ms' });
      return delay;
    }
  });
};

// Hook to check if promoter analytics data is from fallback
export const useIsPromoterAnalyticsFallback = (analyticsData: PromoterAnalyticsResponse | undefined) => {
  if (!analyticsData) {
    console.log('🔍 [PROMOTER ANALYTICS] Fallback detection: No data available');
    return true;
  }
  
  // Enhanced fallback detection criteria
  const indicators = {
    unknownPromoterName: analyticsData.promoter?.name === 'Unknown Promoter',
    zeroTotalEvents: analyticsData.promoter?.business_stats?.total_events === 0,
    emptyGenreAnalytics: !analyticsData.genreAnalytics || analyticsData.genreAnalytics.length === 0,
    emptyVenueAnalytics: !analyticsData.venueAnalytics || analyticsData.venueAnalytics.length === 0,
    emptyTimeSeries: !analyticsData.timeSeries || analyticsData.timeSeries.length === 0,
    zeroPerformanceScore: analyticsData.analytics?.performanceScore === 0,
    unknownMarketPosition: analyticsData.analytics?.marketPosition === 'Emerging' || analyticsData.analytics?.marketPosition === 'Unknown'
  };
  
  // Consider it fallback if multiple indicators are true
  const fallbackIndicatorCount = Object.values(indicators).filter(Boolean).length;
  const isFallback = indicators.unknownPromoterName || 
                    (indicators.zeroTotalEvents && indicators.emptyGenreAnalytics && indicators.emptyVenueAnalytics) ||
                    fallbackIndicatorCount >= 4;
  
  console.log('🔍 [PROMOTER ANALYTICS] Enhanced fallback detection:', {
    promoterName: analyticsData.promoter?.name,
    promoterId: analyticsData.promoter?.id,
    indicators,
    fallbackIndicatorCount,
    isFallback,
    dataSource: isFallback ? 'FALLBACK (promoter_list_summary)' : 'EDGE FUNCTION (promoter-analytics)'
  });
  
  return isFallback;
};

// Hook to check if promoter analytics data is error state
export const useIsPromoterAnalyticsError = (analyticsData: PromoterAnalyticsResponse | undefined) => {
  return analyticsData?.promoter?.name === 'Promoter Not Found';
};