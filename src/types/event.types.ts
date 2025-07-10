export interface EventListItem {
  id: string;
  name: string;
  date: string;
  status: string;
  genre: string | null;
  venue_id: string;
  venue_name: string;
  venue_city: string;
  artist_count: number;
  top_artists: Array<{
    id: string;
    name: string;
    monthly_listeners: number | null;
  }>;
  price_range: {
    min_price: number;
    max_price: number;
    has_tickets: boolean;
  };
  ticket_availability: {
    passo: boolean;
    bugece: boolean;
    biletix: boolean;
    bubilet: boolean;
    biletinial: boolean;
    any_available: boolean;
  };
  providers: string[];
  date_category: string;
  days_until_event: string;
}

export interface EventSearchParams {
  searchTerm?: string;
  genres?: string[];
  status?: string[];
  cities?: string[];
  venues?: string[];
  artists?: string[];
  providers?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EventSearchResponse {
  events: EventListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// For transforming to match existing component expectations
export interface TransformedEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  venue_id: string;
  city: string;
  promoter?: string;
  genre: string;
  status: 'On Sale' | 'Sold Out' | 'Postponed' | 'Past';
  providers: string[];
  image?: string;
  revenue?: number;
  ticketsSold?: number;
  capacity?: number;
  artists: Array<{
    id: number;
    name: string;
    agency: string;
    agent: string;
    territory: string;
    monthlyListeners: number;
    followers: number;
    topCities: string[];
    genre: string;
    email?: string;
    profileUrl?: string;
    spotifyUrl?: string;
  }>;
}