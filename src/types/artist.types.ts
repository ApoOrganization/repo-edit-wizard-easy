export interface ArtistListItem {
  id: string;  // UUID from Edge Function
  name: string;
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

// Artist Details Interface for Edge Function response
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