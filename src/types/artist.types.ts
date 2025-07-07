export interface ArtistListItem {
  canonical_id: string | null;  // UUID in database
  name: string | null;
  normalized_name: string | null;
  spotify_link: string | null;
  monthly_listeners: number | null;
  followers: number | null;
  agency: string | null;
  territory: string | null;
  booking_emails: string | null;
  social_presence: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  } | null;
  total_events: number | null;
  upcoming_events: number | null;
  past_events: number | null;
  recent_events: number | null;
  unique_venues: number | null;
  cities_performed: number | null;
  top_genres: string[] | null;  // This is the actual column name
  last_performance: string | null;
  next_performance: string | null;
  top_cities: any | null;  // JSONB field
  activity_status: string | null;
  popularity_tier: string | null;
}

export interface TransformedArtist {
  id: number | string;
  name: string;
  agency: string;
  agent: string;
  territory: string;
  monthlyListeners: number;
  followers: number;
  topCities: string[];
  genre: string;
  email: string;
  profileUrl: string;
  spotifyUrl: string;
}

export interface ArtistSearchParams {
  searchTerm?: string;
  genres?: string[];
  agencies?: string[];
  territories?: string[];
  minListeners?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ArtistSearchResponse {
  artists: ArtistListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArtistFilterOptions {
  agencies: string[];
  territories: string[];
  genres: string[];
}