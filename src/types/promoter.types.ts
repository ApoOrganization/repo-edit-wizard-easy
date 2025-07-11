// Promoter List Item Interface (from promoter_list_summary view - REAL SCHEMA)
export interface PromoterListItem {
  id: string;
  name: string;
  instagram_link: string | null;
  created_at: string;
  total_events: number;
  venues_used: number;
  genres_count: number;
  cities_count: number;
  cities: string[];
  genres_promoted: string[];
  upcoming_events: number;
  past_events: number;
  recent_events: number;
  last_event_date: string | null;
  next_event_date: string | null;
  unique_artists_count: number;
  top_artists: any; // JSONB
  activity_status: string | null;
  scale_tier: string | null;
}

// Transform to UI-friendly format (matching existing mock data structure)
export interface TransformedPromoter {
  id: string;
  name: string;
  city: string;
  specialty: string;
  eventsCount: number;
  upcomingEvents: number;
  venuesUsed: number;
  genresPromoted: number;
  revenue: number;
  avgEventRevenue: number;
  rating: number; // Calculated from performance metrics
}

// Search Parameters Interface (Updated for Real Schema)
export interface PromoterSearchParams {
  searchTerm?: string;
  cities?: string[];
  activityStatuses?: string[];
  scaleTiers?: string[];
  eventCountRange?: {
    min?: number;
    max?: number;
  };
  venuesUsedRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'name' | 'total_events' | 'upcoming_events' | 'venues_used' | 'unique_artists_count' | 'genres_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Search Response Interface
export interface PromoterSearchResponse {
  promoters: PromoterListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Options Interface (Updated for Real Schema)
export interface PromoterFilterOptions {
  cities: string[];
  activityStatuses: string[];
  scaleTiers: string[];
  eventCountRange: {
    min: number;
    max: number;
  };
  venuesUsedRange: {
    min: number;
    max: number;
  };
}

// Actual Edge Function Response Interface (matches real API)
export interface PromoterAnalyticsEdgeFunctionResponse {
  promoter: {
    id: string;
    name: string;
    created_at: string;
    instagram_link: string | null;
    total_events_count: number;
    upcoming_events_count: number;
    past_events_count: number;
    venue_analytics: {
      cities: number;
      total_venues: number;
      top_venues: Array<{
        city: string;
        venue_id: string;
        venue_name: string;
        event_count: number;
      }>;
      city_distribution: Array<{
        city: string;
        percentage: number;
        event_count: number;
      }>;
    };
    genre_analytics: {
      total_genres: number;
      primary_genre: string;
      genre_distribution: Array<{
        genre: string;
        trend: string;
        percentage: number;
        event_count: number;
      }>;
    };
    time_analytics: {
      years_active: number;
      avg_events_per_month: number;
      events_by_month: Array<{
        month: string;
        event_count: number;
      }>;
      day_of_week_preference: Array<{
        day: string;
        count: number;
        percentage: number;
      }>;
      first_event_date: string;
      last_event_date: string;
    };
    artist_metrics: {
      total_artists: number;
      recurring_artists: number;
      artist_loyalty_rate: number;
    };
    business_metrics: {
      events_per_year: number;
      growth_trend: string;
      scale_classification: string;
    };
  };
  events: Array<{
    id: string;
    date: string;
    name: string;
    genre: string;
    venue: {
      id: string;
      city: string;
      name: string;
      capacity: number | null;
    };
    status: string;
    has_tickets: boolean;
    artists: Array<{
      id: string;
      name: string;
      spotify_link: string | null;
    }>;
  }>;
  insights: {
    topPerformingGenre: string;
    bestPerformingCity: string;
    averageEventsPerMonth: number;
    artistLoyaltyRate: number;
    venuePreference: string;
    growthTrend: string;
  };
}

// Transformed Promoter Analytics Response Interface (for UI)
export interface PromoterAnalyticsResponse {
  promoter: PromoterDetailsFull;
  analytics: {
    timeRange: string;
    businessMetrics: PromoterBusinessMetrics;
    performanceScore: number;
    marketPosition: string;
  };
  genreAnalytics: PromoterGenreDistribution[];
  venueAnalytics: PromoterVenueStats[];
  artistCollaborations: PromoterArtistCollaboration[];
  timeSeries: PromoterTimeSeriesData[];
}

// Comprehensive Promoter Details Interface (from promoter_analytics_full view)
export interface PromoterDetailsFull {
  id: string;
  name: string;
  normalized_name: string;
  city: string | null;
  specialty: string | null;
  contact_info: {
    email: string | null;
    phone: string | null;
    website: string | null;
    instagram_link: string | null;
  };
  business_stats: {
    total_events: number;
    upcoming_events: number;
    venues_used: number;
    genres_promoted: number;
    years_active: number;
  };
  financial_metrics: {
    total_revenue: number | null;
    avg_event_revenue: number | null;
    revenue_growth_rate: number | null;
    profit_margin: number | null;
  };
  performance_metrics: {
    success_rate: number;
    artist_retention_rate: number;
    venue_loyalty_score: number;
    market_reputation: number;
  };
  // Raw API fields for direct access
  city_distribution?: Array<{
    city: string;
    percentage: number;
    event_count: number;
  }>;
  day_of_week_preference?: Array<{
    day: string;
    count: number;
    percentage: number;
  }>;
  growth_trend?: string;
  primary_genre?: string;
}

// Business Metrics Interface
export interface PromoterBusinessMetrics {
  revenue_performance: {
    total_revenue: number;
    avg_event_revenue: number;
    revenue_growth_rate: number;
    revenue_per_venue: number;
  };
  operational_efficiency: {
    events_per_month: number;
    venue_utilization_rate: number;
    artist_booking_success_rate: number;
    cost_per_event: number;
  };
  market_metrics: {
    market_share: number;
    competitive_position: number;
    brand_recognition_score: number;
    customer_satisfaction: number;
  };
}

// Genre Distribution Interface
export interface PromoterGenreDistribution {
  genre: string;
  event_count: number;
  percentage: number;
  revenue_contribution: number;
  avg_attendance: number;
  growth_trend: number;
}

// Venue Analytics Interface
export interface PromoterVenueStats {
  venue_name: string;
  venue_id: string;
  city: string;
  event_count: number;
  total_revenue: number;
  avg_attendance: number;
  success_rate: number;
  last_event_date: string;
}

// Artist Collaboration Interface
export interface PromoterArtistCollaboration {
  artist_name: string;
  artist_id: string;
  collaboration_count: number;
  total_revenue: number;
  avg_event_success: number;
  last_collaboration: string;
  loyalty_score: number;
}

// Time Series Data Interface
export interface PromoterTimeSeriesData {
  month: string;
  events: number;
  revenue: number;
  new_artists: number;
  avg_attendance: number;
  success_rate: number;
}

// Promoter Analytics Query Parameters
export interface PromoterAnalyticsParams {
  promoterId: string;
  timeRange?: 'month' | 'quarter' | 'year' | 'all';
  includeComparisons?: boolean;
  includeForecasting?: boolean;
}

// Campaign Data Interface (for future use)
export interface PromoterCampaign {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget: number;
  target_audience: string;
  channels: string[];
  performance_metrics: {
    reach: number;
    engagement_rate: number;
    conversion_rate: number;
    roi: number;
  };
}

// Event Promoter Relationship Interface
export interface EventPromoterRelationship {
  event_id: string;
  promoter_id: string;
  role: 'primary' | 'secondary' | 'sponsor';
  commission_rate: number;
  responsibility_areas: string[];
  performance_bonus: number | null;
}

// Promoter Calendar Interfaces for get_promoter_calendar function
export interface PromoterCalendarResponse {
  [date: string]: PromoterCalendarEvent[];
}

export interface PromoterCalendarEvent {
  id: string;
  name: string;
  time: string;
  venue_name: string;
  venue_city: string;
  genre: string | null;
  status: string;
  has_tickets: boolean;
}

// Transformed format for promoter calendar UI component
export interface PromoterCalendarEventData {
  id: string;
  date: string;
  name: string;
  venue: string;
  city: string;
  time: string;
  status: string;
  has_tickets: boolean;
  genre: string | null;
  venue_name: string;
  venue_city: string;
  datetime: string;
}

// Legacy interface for backward compatibility (matching existing mock data)
export interface MockPromoter {
  id: string;
  name: string;
  city: string;
  specialty: string;
  eventsCount: number;
  revenue: number;
  rating: number;
}

// Marketing Campaigns (Meta Ads) Interfaces - RPC Response
export interface PromoterMetaCampaign {
  id: number;
  ad_status: string;
  page_name: string[];
  ad_caption: string;
  ad_end_date: string;
  promoter_id: string;
  ad_archive_id: string;
  ad_start_date: string;
  promoter_name: string;
}