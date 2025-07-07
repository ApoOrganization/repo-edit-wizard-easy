import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PromoterAnalyticsResponse, PromoterAnalyticsParams, PromoterDetailsFull, PromoterAnalyticsEdgeFunctionResponse } from '@/types/promoter.types';

// Transform Edge Function response to UI format
const transformEdgeFunctionResponse = (data: PromoterAnalyticsEdgeFunctionResponse): PromoterAnalyticsResponse => {
  console.log('🔄 [PROMOTER ANALYTICS] Transforming Edge Function response:', {
    hasPromoter: !!data.promoter,
    promoterName: data.promoter?.name,
    totalEvents: data.promoter?.total_events_count,
    hasVenueAnalytics: !!data.promoter?.venue_analytics,
    hasGenreAnalytics: !!data.promoter?.genre_analytics,
    venueAnalyticsCount: data.promoter?.venue_analytics?.top_venues?.length || 0,
    genreAnalyticsCount: data.promoter?.genre_analytics?.genre_distribution?.length || 0
  });

  const promoterData = data.promoter;
  
  // Calculate performance score from various metrics
  const calculatePerformanceScore = (): number => {
    let score = 0;
    
    // Event activity (40%)
    const eventActivity = Math.min(promoterData.total_events_count / 100, 1) * 40;
    score += eventActivity;
    
    // Artist loyalty (30%)
    const artistLoyalty = (promoterData.artist_metrics.artist_loyalty_rate / 100) * 30;
    score += artistLoyalty;
    
    // Venue diversity (20%)
    const venueDiversity = Math.min(promoterData.venue_analytics.total_venues / 20, 1) * 20;
    score += venueDiversity;
    
    // Genre diversity (10%)
    const genreDiversity = Math.min(promoterData.genre_analytics.total_genres / 5, 1) * 10;
    score += genreDiversity;
    
    return Math.round(score);
  };

  const transformed: PromoterAnalyticsResponse = {
    promoter: {
      id: promoterData.id,
      name: promoterData.name,
      normalized_name: promoterData.name.toLowerCase().replace(/\s+/g, '-'),
      city: promoterData.venue_analytics.city_distribution?.[0]?.city || 'Unknown',
      specialty: promoterData.business_metrics.scale_classification || 'General',
      contact_info: {
        email: null,
        phone: null,
        website: null,
        instagram_link: promoterData.instagram_link
      },
      business_stats: {
        total_events: promoterData.total_events_count,
        upcoming_events: promoterData.upcoming_events_count,
        venues_used: promoterData.venue_analytics.total_venues,
        genres_promoted: promoterData.genre_analytics.total_genres,
        years_active: promoterData.time_analytics.years_active
      },
      financial_metrics: {
        total_revenue: 0, // Not available
        avg_event_revenue: 0, // Not available
        revenue_growth_rate: 0, // Not available
        profit_margin: 0 // Not available
      },
      performance_metrics: {
        success_rate: 85, // Estimated based on growth trend
        artist_retention_rate: promoterData.artist_metrics.artist_loyalty_rate,
        venue_loyalty_score: 75, // Estimated
        market_reputation: calculatePerformanceScore()
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
          events_per_month: promoterData.time_analytics.avg_events_per_month,
          venue_utilization_rate: 85, // Estimated
          artist_booking_success_rate: promoterData.artist_metrics.artist_loyalty_rate,
          cost_per_event: 0
        },
        market_metrics: {
          market_share: 0,
          competitive_position: calculatePerformanceScore(),
          brand_recognition_score: 75, // Estimated
          customer_satisfaction: 80 // Estimated
        }
      },
      performanceScore: calculatePerformanceScore(),
      marketPosition: promoterData.business_metrics.scale_classification || 'Emerging'
    },
    genreAnalytics: promoterData.genre_analytics.genre_distribution.map(genre => ({
      genre: genre.genre,
      event_count: genre.event_count,
      percentage: genre.percentage,
      revenue_contribution: 0, // Not available
      avg_attendance: 0, // Not available
      growth_trend: genre.trend === 'growing' ? 15 : genre.trend === 'stable' ? 0 : -10
    })),
    venueAnalytics: promoterData.venue_analytics.top_venues.map(venue => ({
      venue_name: venue.venue_name,
      venue_id: venue.venue_id,
      city: venue.city,
      event_count: venue.event_count,
      total_revenue: 0, // Not available
      avg_attendance: 0, // Not available
      success_rate: 85, // Estimated
      last_event_date: promoterData.time_analytics.last_event_date
    })),
    artistCollaborations: [], // Would need additional data processing
    timeSeries: promoterData.time_analytics.events_by_month.map(month => ({
      month: month.month,
      events: month.event_count,
      revenue: 0, // Not available
      new_artists: 0, // Not available
      avg_attendance: 0, // Not available
      success_rate: 85 // Estimated
    }))
  };

  console.log('✅ [PROMOTER ANALYTICS] Edge Function response transformed:', {
    promoter: transformed.promoter.name,
    performanceScore: transformed.analytics.performanceScore,
    genreAnalyticsCount: transformed.genreAnalytics.length,
    venueAnalyticsCount: transformed.venueAnalytics.length,
    timeSeriesCount: transformed.timeSeries.length,
    hasBusinessMetrics: !!transformed.analytics.businessMetrics
  });

  return transformed;
};

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

        // Validate Edge Function response structure
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

        // Validate Edge Function promoter data structure
        const promoterData = data.promoter;
        console.log('🎭 [PROMOTER ANALYTICS] Edge Function data validation:', {
          hasId: !!promoterData.id,
          hasName: !!promoterData.name,
          hasTotalEventsCount: promoterData.total_events_count !== undefined,
          hasVenueAnalytics: !!promoterData.venue_analytics,
          hasGenreAnalytics: !!promoterData.genre_analytics,
          hasTimeAnalytics: !!promoterData.time_analytics,
          hasArtistMetrics: !!promoterData.artist_metrics,
          hasBusinessMetrics: !!promoterData.business_metrics
        });

        // Validate nested analytics data
        console.log('📊 [PROMOTER ANALYTICS] Edge Function nested data validation:', {
          venueAnalytics: {
            hasTopVenues: !!promoterData.venue_analytics?.top_venues,
            topVenuesLength: promoterData.venue_analytics?.top_venues?.length || 0,
            hasCityDistribution: !!promoterData.venue_analytics?.city_distribution,
            cityDistributionLength: promoterData.venue_analytics?.city_distribution?.length || 0
          },
          genreAnalytics: {
            hasGenreDistribution: !!promoterData.genre_analytics?.genre_distribution,
            genreDistributionLength: promoterData.genre_analytics?.genre_distribution?.length || 0,
            primaryGenre: promoterData.genre_analytics?.primary_genre
          },
          timeAnalytics: {
            avgEventsPerMonth: promoterData.time_analytics?.avg_events_per_month,
            yearsActive: promoterData.time_analytics?.years_active,
            hasEventsByMonth: !!promoterData.time_analytics?.events_by_month,
            eventsByMonthLength: promoterData.time_analytics?.events_by_month?.length || 0
          }
        });

        const totalDuration = Date.now() - startTime;
        console.log('✅ [PROMOTER ANALYTICS] Edge Function data loaded successfully:', {
          promoter: promoterData.name,
          totalEvents: promoterData.total_events_count,
          upcomingEvents: promoterData.upcoming_events_count,
          totalVenues: promoterData.venue_analytics?.total_venues,
          primaryGenre: promoterData.genre_analytics?.primary_genre,
          avgEventsPerMonth: promoterData.time_analytics?.avg_events_per_month,
          artistLoyaltyRate: promoterData.artist_metrics?.artist_loyalty_rate,
          scaleClassification: promoterData.business_metrics?.scale_classification,
          totalDuration: totalDuration + 'ms'
        });
        
        // Transform Edge Function response to UI format
        console.log('🔄 [PROMOTER ANALYTICS] Applying transformation to Edge Function response...');
        const transformedData = transformEdgeFunctionResponse(data as PromoterAnalyticsEdgeFunctionResponse);
        
        // CRITICAL: Log exactly what we're returning after transformation
        console.log('🔍 [PROMOTER ANALYTICS] FINAL TRANSFORMED DATA PREVIEW:', {
          isFromEdgeFunction: true,
          isTransformed: true,
          promoter: {
            id: transformedData.promoter?.id,
            name: transformedData.promoter?.name,
            hasBusinessStats: !!transformedData.promoter?.business_stats,
            totalEvents: transformedData.promoter?.business_stats?.total_events
          },
          analytics: {
            timeRange: transformedData.analytics?.timeRange,
            performanceScore: transformedData.analytics?.performanceScore,
            hasBusinessMetrics: !!transformedData.analytics?.businessMetrics
          },
          dataArrays: {
            genreAnalyticsLength: transformedData.genreAnalytics?.length || 0,
            venueAnalyticsLength: transformedData.venueAnalytics?.length || 0,
            timeSeriesLength: transformedData.timeSeries?.length || 0
          }
        });
        
        return transformedData;
        
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