import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Artist Analytics Response Interface
export interface ArtistAnalyticsResponse {
  artist: {
    id: string;
    name: string;
    normalized_name: string;
    genres: string[];
    agency: string | null;
    territory: string | null;
    spotify_link: string | null;
    booking_emails: string | null;
    monthly_listeners: number | null;
    followers: number | null;
    description: string | null;
    top_cities: Array<{
      city: string;
      listeners: number;
    }> | null;
    event_stats: {
      total_events: number;
      avg_ticket_price: number;
    };
    performance_cities: Array<{
      city_name: string;
      event_count: number;
      avg_attendance: number;
    }>;
    favorite_venues: Array<{
      venue_name: string;
      city: string;
      performance_count: number;
    }>;
    genre_distribution: Array<{
      genre: string;
      percentage: number;
    }>;
    day_of_week_preferences: Array<{
      day: string;
      event_count: number;
      percentage: number;
    }>;
    social_presence: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      website?: string;
      youtube?: string;
    } | null;
    social_links: {
      twitter: string | null;
      youtube: string | null;
      facebook: string | null;
      instagram: string | null;
      wikipedia: string | null;
      soundcloud: string | null;
      apple_music: string | null;
    } | null;
  };
  analytics: {
    diversityScore: number;
    touringIntensity: number;
    marketPenetration: number;
    growth: {
      listener_growth_rate: number;
      event_growth_rate: number;
      venue_diversity_trend: number;
    };
  };
  insights: Array<{
    type: string;
    message: string;
  }>;
  comparisons: Array<{
    artist_id: string;
    artist_name: string;
    similarity_score: number;
    monthly_listeners: number;
    total_events: number;
  }>;
}

// Actual database function return interface
interface DatabaseEventResponse {
  id: string;
  name: string;
  date: string;
  venue_name: string;
  venue_city: string;
  status: string;
}

// Events Response Interface for frontend (transformed)
export interface ArtistEventsResponse {
  events: Array<{
    event_id: string;
    event_name: string;
    date: string;
    venue_name: string;
    city: string;
    ticket_price: number | null;
    attendance: number | null;
    status: string;
  }>;
}

// Fallback function to get basic artist data
const getBasicArtistData = async (artistId: string) => {
  const { data, error } = await supabase.functions.invoke('get-artist-details', {
    body: { artistId }
  });
  
  if (error) {
    console.error('Fallback get-artist-details error:', error);
    throw error;
  }
  
  return data;
};

// Transform basic artist data to analytics format
const transformToAnalyticsFormat = (basicData: any): ArtistAnalyticsResponse => {
  const artist = basicData?.artist;
  
  return {
    artist: {
      id: artist?.id || '',
      name: artist?.name || 'Unknown Artist',
      normalized_name: artist?.normalized_name || '',
      genres: ['Artist'], // Default fallback
      agency: null,
      territory: null,
      spotify_link: artist?.spotify_link || null,
      booking_emails: null,
      monthly_listeners: null,
      followers: null,
      description: null,
      top_cities: null,
      event_stats: {
        total_events: basicData?.stats?.total_events || 0,
        avg_ticket_price: 0
      },
      performance_cities: [],
      favorite_venues: [],
      genre_distribution: [],
      day_of_week_preferences: [],
      social_presence: null,
      social_links: null
    },
    analytics: {
      diversityScore: 0,
      touringIntensity: 0,
      marketPenetration: 0,
      growth: {
        listener_growth_rate: 0,
        event_growth_rate: 0,
        venue_diversity_trend: 0
      }
    },
    insights: [
      {
        type: 'info',
        message: 'Analytics data temporarily unavailable. Showing basic information.'
      }
    ],
    comparisons: []
  };
};

// Main artist analytics hook with robust error handling
export const useArtistAnalytics = (artistId: string | undefined) => {
  return useQuery<ArtistAnalyticsResponse>({
    queryKey: ['artist-analytics', artistId],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }
      
      console.log('🔍 Fetching analytics for artist:', artistId);
      
      try {
        // Try analytics function first
        const { data, error } = await supabase.functions.invoke('artist-analytics', {
          body: {
            artistId,
            includeComparisons: true,
            timeRange: 'year'
          }
        });

        if (error) {
          console.error('❌ Analytics function error:', {
            artistId,
            error: error.message,
            status: error.context?.res?.status
          });
          
          // Check if it's a 500 error or other server error
          if (error.context?.res?.status >= 500) {
            console.warn('🔄 Server error detected, falling back to basic data');
            const fallbackData = await getBasicArtistData(artistId);
            return transformToAnalyticsFormat(fallbackData);
          }
          
          throw new Error(`Analytics function failed: ${error.message}`);
        }

        if (!data || !data.artist) {
          console.warn('⚠️ No artist data returned, falling back to basic data');
          const fallbackData = await getBasicArtistData(artistId);
          return transformToAnalyticsFormat(fallbackData);
        }

        console.log('✅ Analytics data loaded successfully for:', data.artist.name);
        return data;
        
      } catch (analyticsError: any) {
        console.error('💥 Analytics function completely failed:', {
          artistId,
          error: analyticsError.message
        });
        
        // Fall back to basic artist data
        try {
          console.log('🔄 Attempting fallback to basic artist data...');
          const fallbackData = await getBasicArtistData(artistId);
          console.log('✅ Fallback data loaded successfully');
          return transformToAnalyticsFormat(fallbackData);
        } catch (fallbackError: any) {
          console.error('💥 Both analytics and fallback failed:', {
            artistId,
            analyticsError: analyticsError.message,
            fallbackError: fallbackError.message
          });
          
          // Return minimal data structure to prevent complete failure
          return {
            artist: {
              id: artistId,
              name: 'Artist Not Found',
              normalized_name: '',
              genres: ['Unknown'],
              agency: null,
              territory: null,
              spotify_link: null,
              booking_emails: null,
              monthly_listeners: null,
              followers: null,
              description: null,
              top_cities: null,
              event_stats: { total_events: 0, avg_ticket_price: 0 },
              performance_cities: [],
              favorite_venues: [],
              genre_distribution: [],
              day_of_week_preferences: [],
              social_presence: null,
              social_links: null
            },
            analytics: {
              diversityScore: 0,
              touringIntensity: 0,
              marketPenetration: 0,
              growth: {
                listener_growth_rate: 0,
                event_growth_rate: 0,
                venue_diversity_trend: 0
              }
            },
            insights: [
              {
                type: 'error',
                message: 'Unable to load artist data. Please try again later.'
              }
            ],
            comparisons: []
          };
        }
      }
    },
    enabled: !!artistId,
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

// Transform database response to frontend format
const transformDatabaseEvents = (dbEvents: DatabaseEventResponse[]): ArtistEventsResponse['events'] => {
  return dbEvents.map(event => ({
    event_id: event.id,
    event_name: event.name,
    date: event.date,
    venue_name: event.venue_name,
    city: event.venue_city,
    ticket_price: null, // Not available in database function
    attendance: null, // Not available in database function
    status: event.status
  }));
};

// Filter events by past/upcoming
const filterEventsByTime = (events: ArtistEventsResponse['events'], includePast: boolean) => {
  const now = new Date();
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return includePast ? eventDate < now : eventDate >= now;
  });
};

// Events data hook (lazy loading for Events tab) with error handling
export const useArtistEvents = (artistId: string | undefined, includePast: boolean = false, enabled: boolean = false) => {
  return useQuery<ArtistEventsResponse>({
    queryKey: ['artist-events', artistId, includePast],
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required');
      
      console.log('🎫 Fetching events for artist:', { artistId, includePast });
      
      try {
        // Call RPC with only the artist_uuid parameter (matching database function)
        const { data, error } = await supabase.rpc('get_artist_events', {
          artist_uuid: artistId
        });

        if (error) {
          console.error('❌ Events RPC error:', {
            artistId,
            error: error.message,
            details: error
          });
          throw new Error(`Failed to fetch artist events: ${error.message}`);
        }

        console.log('✅ Raw events from database:', data?.length || 0, 'total events');
        
        // Transform database response to frontend format
        const transformedEvents = transformDatabaseEvents(data || []);
        
        // Filter by past/upcoming in frontend
        const filteredEvents = filterEventsByTime(transformedEvents, includePast);
        
        // Limit to 10 events
        const limitedEvents = filteredEvents.slice(0, 10);
        
        console.log('✅ Events processed:', {
          total: transformedEvents.length,
          filtered: filteredEvents.length,
          final: limitedEvents.length,
          includePast
        });
        
        return {
          events: limitedEvents
        };
      } catch (eventsError: any) {
        console.error('💥 Events fetch completely failed:', {
          artistId,
          includePast,
          error: eventsError.message
        });
        
        // Return empty events instead of failing completely
        return {
          events: []
        };
      }
    },
    enabled: !!artistId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Upcoming events hook
export const useArtistUpcomingEvents = (artistId: string | undefined, enabled: boolean = false) => {
  return useArtistEvents(artistId, false, enabled);
};

// Past events hook
export const useArtistPastEvents = (artistId: string | undefined, enabled: boolean = false) => {
  return useArtistEvents(artistId, true, enabled);
};

// Hook to check if analytics data is from fallback
export const useIsAnalyticsFallback = (analyticsData: ArtistAnalyticsResponse | undefined) => {
  return analyticsData?.insights?.some(insight => 
    insight.type === 'info' && 
    insight.message?.includes('temporarily unavailable')
  ) || false;
};

// Hook to check if analytics data is error state
export const useIsAnalyticsError = (analyticsData: ArtistAnalyticsResponse | undefined) => {
  return analyticsData?.insights?.some(insight => 
    insight.type === 'error'
  ) || false;
};