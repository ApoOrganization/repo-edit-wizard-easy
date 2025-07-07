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