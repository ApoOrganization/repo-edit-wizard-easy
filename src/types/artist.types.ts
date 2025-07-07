export interface ArtistListItem {
  id: string;
  name: string;
  normalized_name: string;
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
  total_events: number;
  upcoming_events: number;
  past_events: number;
  genres: string[];
}

export interface TransformedArtist {
  id: number;
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