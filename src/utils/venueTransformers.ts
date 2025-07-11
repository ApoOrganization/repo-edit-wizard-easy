import { VenueListItem, TransformedVenue } from "@/types/venue.types";

export const transformVenueFromDB = (dbVenue: VenueListItem): TransformedVenue => {
  return {
    id: dbVenue.id,
    name: dbVenue.name,
    city: dbVenue.city,
    capacity: dbVenue.capacity || 0,
    totalEvents: Number(dbVenue.total_events) || 0,
    upcomingEvents: Number(dbVenue.upcoming_events) || 0,
    recentEvents: Number(dbVenue.recent_events) || 0,
    avgPrice: typeof dbVenue.avg_ticket_price === 'number' ? dbVenue.avg_ticket_price : null,
    topGenres: Array.isArray(dbVenue.top_genres) 
      ? dbVenue.top_genres.filter(g => g && g.trim()) 
      : [],
    // Computed fields
    type: inferVenueType(dbVenue.capacity),
    rating: 4.5, // Default since not in DB
    utilization: calculateUtilization(dbVenue),
  };
};

const inferVenueType = (capacity: number | null): string => {
  if (!capacity || capacity === 0) return 'Venue';
  if (capacity < 500) return 'Club';
  if (capacity < 2000) return 'Theater';
  if (capacity < 10000) return 'Arena';
  return 'Stadium';
};

const calculateUtilization = (venue: VenueListItem): number => {
  // Simple activity calculation based on total events
  const totalEvents = Number(venue.total_events) || 0;
  
  // Since max events are around 100, use that as baseline for 100% activity
  const maxExpectedEvents = 100;
  
  const utilization = (totalEvents / maxExpectedEvents) * 100;
  return Math.min(utilization, 100); // Cap at 100%
};

export const getPriceTier = (avgPrice: number | null): string => {
  if (!avgPrice || avgPrice === 0) return 'Unknown';
  if (avgPrice < 100) return 'Budget';
  if (avgPrice < 300) return 'Mid-tier';
  return 'Premium';
};

export const getPriceTierVariant = (avgPrice: number | null): "secondary" | "default" | "destructive" => {
  if (!avgPrice || avgPrice === 0) return 'secondary';
  if (avgPrice < 100) return 'secondary';
  if (avgPrice < 300) return 'default';
  return 'destructive';
};

export const formatPrice = (price: number | null): string => {
  if (!price || price === 0) return 'N/A';
  return `₺${price.toFixed(0)}`;
};

export const formatCapacity = (capacity: number | null): string => {
  if (!capacity || capacity === 0) return 'N/A';
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(1)}k`;
  }
  return capacity.toLocaleString();
};