export interface VenueListItem {
  id: string;
  name: string;
  city: string;
  capacity: number | null;
  total_events: number;
  upcoming_events: number;
  recent_events: number;
  avg_ticket_price: number | null;
  top_genres: string[];
}

export interface TransformedVenue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  totalEvents: number;
  upcomingEvents: number;
  recentEvents: number;
  avgPrice: number | null;
  topGenres: string[];
  type: string;
  rating: number;
  utilization: number;
}

export interface VenueSearchParams {
  searchTerm?: string;
  cities?: string[];
  capacityRange?: {
    min?: number;
    max?: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  genres?: string[];
  hasEvents?: boolean;
  sortBy?: 'name' | 'city' | 'capacity' | 'total_events' | 'avg_ticket_price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface VenueSearchResponse {
  venues: VenueListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VenueFilterOptions {
  cities: string[];
  genres: string[];
  capacityRange: {
    min: number;
    max: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

// Venue Analytics Response Interface
export interface VenueAnalyticsResponse {
  venue: VenueDetailsFull;
  analytics: {
    timeRange: string;
    uniqueArtists: number;
    artistReturnRate: number;
    peakDays: Array<{
      day_of_week: string;
      event_count: number;
    }>;
    comparison?: VenueComparison[];
  };
  timeSeries: Array<{
    month: string;
    revenue: number;
    events: number;
    avg_attendance: number;
  }>;
}

// Comprehensive Venue Details Interface
export interface VenueDetailsFull {
  id: string;
  name: string;
  city: string;
  capacity: number;
  event_stats: {
    total_events: number;
    upcoming_events: number;
    recent_events: number;
  };
  utilization_metrics: {
    avg_events_per_month: number;
    capacity_utilization: number;
    peak_months: string[];
  };
  pricing_analytics: {
    avg_ticket_price: number;
    price_range: {
      min: number;
      max: number;
    };
  };
  top_artists: Array<{
    artist_name: string;
    artist_id: string;
    performance_count: number;
  }>;
  top_promoters?: Array<{
    promoter_name: string;
    promoter_id: string;
    event_count: number;
    last_event: string;
  }>;
  genre_distribution?: Array<{
    genre: string;
    count: number;
    percentage: number;
  }>;
  similar_venues?: Array<{
    id: string;
    name: string;
    capacity: number | null;
    event_count: number;
  }>;
  day_of_week_distribution: Array<{
    day_of_week: string;
    event_count: number;
    percentage: number;
  }>;
}

// Venue Comparison Interface
export interface VenueComparison {
  venue_id: string;
  venue_name: string;
  similarity_score: number;
  total_events: number;
  capacity: number;
  avg_ticket_price: number;
}

// Time Series Data Point
export interface VenueTimeSeriesData {
  month: string;
  revenue: number;
  events: number;
  avg_attendance: number;
}

// Venue Analytics Query Parameters
export interface VenueAnalyticsParams {
  venueId: string;
  timeRange?: 'month' | 'quarter' | 'year' | 'all';
  compareWith?: string[];
}

// Peak Day Data
export interface VenuePeakDay {
  day_of_week: string;
  event_count: number;
  percentage?: number;
}

// Top Artist Performance
export interface VenueTopArtist {
  artist_name: string;
  artist_id: string;
  performance_count: number;
  last_performance?: string;
  avg_attendance?: number;
}

// Venue Utilization Metrics
export interface VenueUtilizationMetrics {
  avg_events_per_month: number;
  capacity_utilization: number;
  peak_months: string[];
  occupancy_rate?: number;
  booking_frequency?: number;
}

// Venue Pricing Analytics
export interface VenuePricingAnalytics {
  avg_ticket_price: number;
  price_range: {
    min: number;
    max: number;
  };
  price_trends?: Array<{
    month: string;
    avg_price: number;
  }>;
}

// Venue Calendar Interfaces for get_venue_calendar function
export interface VenueCalendarResponse {
  [date: string]: VenueCalendarEvent[];
}

export interface VenueCalendarEvent {
  id: string;
  name: string;
  time: string;
  genre: string | null;
  status: string;
  has_tickets: boolean;
}

// Transformed format for venue calendar UI component
export interface VenueCalendarEventData {
  id: string;
  date: string;
  name: string;
  venue: string;
  city: string;
  time: string;
  status: string;
  has_tickets: boolean;
  genre: string | null;
  datetime: string;
}

// Legacy interface for backward compatibility
export interface VenueDetails {
  id: string;
  name: string;
  city: string;
  capacity: number;
  totalEvents: number;
  upcomingEvents: number;
  recentEvents: number;
  avgPrice: number | null;
  topGenres: string[];
  type: string;
  rating: number;
  utilization: number;
}