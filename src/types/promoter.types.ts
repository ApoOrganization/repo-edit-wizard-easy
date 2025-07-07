// Promoter List Item Interface (from promoter_list_summary view)
export interface PromoterListItem {
  id: string;
  name: string;
  normalized_name: string;
  city: string | null;
  specialty: string | null;
  total_events: number;
  upcoming_events: number;
  venues_used: number;
  genres_promoted: number;
  total_revenue: number | null;
  avg_event_revenue: number | null;
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

// Search Parameters Interface
export interface PromoterSearchParams {
  searchTerm?: string;
  cities?: string[];
  specialties?: string[];
  eventCountRange?: {
    min?: number;
    max?: number;
  };
  revenueRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'name' | 'total_events' | 'upcoming_events' | 'total_revenue' | 'avg_event_revenue' | 'venues_used';
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

// Filter Options Interface
export interface PromoterFilterOptions {
  cities: string[];
  specialties: string[];
  eventCountRange: {
    min: number;
    max: number;
  };
  revenueRange: {
    min: number;
    max: number;
  };
}

// Promoter Analytics Response Interface (for detail page)
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