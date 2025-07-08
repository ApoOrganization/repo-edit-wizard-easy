export interface ArtistListItem {
  id: string;  // UUID from Edge Function
  name: string;
  eventCount: number;  // Number of events for this artist
  favouritePromoter: string | null;  // Most worked with promoter
  total_count?: number;  // For pagination from Edge Function
}

export interface TransformedArtist {
  id: string;  // UUID only
  name: string;
  agency: string;
  agent: string;
  territory: string;
  monthlyListeners: number;
  followers: number;
  topCities: string[];
  email: string;
  profileUrl: string;
  spotifyUrl: string;
  eventCount: number;  // Real event count from edge function
  favouritePromoter: string | null;  // Real favourite promoter or null
}

export interface ArtistSearchParams {
  searchTerm?: string;
  agencies?: string[];
  territories?: string[];
  minListeners?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Legacy Artist Details Interface (deprecated - use ArtistAnalyticsResponse)
export interface ArtistDetails {
  artist: {
    id: string;
    name: string;
    normalized_name: string;
    spotify_link: string | null;
    created_at: string;
    updated_at: string;
  };
  stats: {
    total_events: number;
    upcoming_events: number;
    past_events: number;
    cities_performed: number;
  };
  recent_events: any[];
  upcoming_events: any[];
  top_venues: any[];
  top_cities: any[];
}

// Comprehensive Artist Analytics Response Interface
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

// Artist Events Response Interface
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

// Individual Event Interface
export interface ArtistEvent {
  event_id: string;
  event_name: string;
  date: string;
  venue_name: string;
  city: string;
  ticket_price: number | null;
  attendance: number | null;
  status: string;
}

// Analytics Metrics Interface
export interface AnalyticsMetrics {
  diversityScore: number;
  touringIntensity: number;
  marketPenetration: number;
  growth: {
    listener_growth_rate: number;
    event_growth_rate: number;
    venue_diversity_trend: number;
  };
}

// Insight Interface
export interface ArtistInsight {
  type: string;
  message: string;
}

// Similar Artist Interface
export interface SimilarArtist {
  artist_id: string;
  artist_name: string;
  similarity_score: number;
  monthly_listeners: number;
  total_events: number;
}

// Search Artists Interface for Edge Function response
export interface SearchArtistsResponse {
  artists: {
    id: string;
    name: string;
    total_events: number;
    upcoming_events: number;
    cities: string[];
  }[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
  filters_applied: {
    search_term: string | null;
    min_events: number | null;
    has_upcoming_events: boolean | null;
  };
}

export interface ArtistFilterOptions {
  agencies: string[];
  territories: string[];
}

// Artist Calendar Interfaces for get_artist_calendar function
export interface ArtistCalendarResponse {
  [date: string]: ArtistCalendarEvent[];
}

export interface ArtistCalendarEvent {
  id: string;
  name: string;
  time: string;
  venue_name: string;
  venue_city: string;
  status: string;
  has_tickets: boolean;
}

// Transformed format for calendar UI component
export interface CalendarEventData {
  id: string;
  date: string;
  name: string;
  venue: string;
  city: string;
  time: string;
  status: string;
  has_tickets: boolean;
  datetime: string;
}