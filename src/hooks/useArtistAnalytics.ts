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
    booking_emails: string[];
    monthly_listeners: number | null;
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

// Events Response Interface for RPC calls
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

// Main artist analytics hook
export const useArtistAnalytics = (artistId: string | undefined) => {
  return useQuery<ArtistAnalyticsResponse>({
    queryKey: ['artist-analytics', artistId],
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required');
      
      const { data, error } = await supabase.functions.invoke('artist-analytics', {
        body: {
          artistId,
          includeComparisons: true,
          timeRange: 'year'
        }
      });

      if (error) {
        console.error('Error fetching artist analytics:', error);
        throw new Error(`Failed to fetch artist analytics: ${error.message}`);
      }

      if (!data || !data.artist) {
        throw new Error('Artist not found');
      }

      return data;
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Events data hook (lazy loading for Events tab)
export const useArtistEvents = (artistId: string | undefined, includePast: boolean = false, enabled: boolean = false) => {
  return useQuery<ArtistEventsResponse>({
    queryKey: ['artist-events', artistId, includePast],
    queryFn: async () => {
      if (!artistId) throw new Error('Artist ID is required');
      
      const { data, error } = await supabase.rpc('get_artist_events', {
        artist_uuid: artistId,
        include_past: includePast,
        limit_count: 10
      });

      if (error) {
        console.error('Error fetching artist events:', error);
        throw new Error(`Failed to fetch artist events: ${error.message}`);
      }

      return {
        events: data || []
      };
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