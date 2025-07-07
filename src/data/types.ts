
// Core data types for the Entertainment Intelligence Dashboard

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  promoter?: string;
  genre: string;
  status: 'On Sale' | 'Sold Out' | 'Cancelled' | 'Postponed';
  providers: string[];
  image?: string;
  revenue?: number;
  ticketsSold?: number;
  capacity?: number;
  artists: Artist[];
}

export interface Artist {
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
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  type: string;
  events: number;
  revenue: number;
  rating: number;
  image: string;
}

export interface Promoter {
  id: string;
  name: string;
  city: string;
  eventsCount: number;
  revenue: number;
  rating: number;
  specialty: string;
  image: string;
}

export interface MarketData {
  totalMarketSize: number;
  revenueGenerated: number;
  marketOpportunity: number;
  activeEvents: number;
}

export interface ProviderData {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  events: number;
}

export interface GenreDistribution {
  name: string;
  value: number;
  color: string;
}
