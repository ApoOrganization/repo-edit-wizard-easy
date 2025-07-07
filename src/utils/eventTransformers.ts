import { EventListItem, TransformedEvent } from '@/types/event.types';

export const transformEventFromDB = (dbEvent: EventListItem): TransformedEvent => {
  // Map status to match existing component expectations
  const mapStatus = (status: string): TransformedEvent['status'] => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'onsale':
        return 'On Sale';
      case 'soldout':
        return 'Sold Out';
      case 'cancelled':
        return 'Cancelled';
      case 'postponed':
        return 'Postponed';
      default:
        return 'On Sale';
    }
  };

  return {
    id: dbEvent.id,
    name: dbEvent.name,
    date: dbEvent.date,
    venue: dbEvent.venue_name,
    city: dbEvent.venue_city,
    promoter: 'Unknown', // We'll fix this when promoter data is available
    genre: dbEvent.genre || 'Unknown',
    status: mapStatus(dbEvent.status),
    providers: dbEvent.providers || [],
    image: '/placeholder.svg', // Default image
    revenue: 0, // Not available in list view
    ticketsSold: 0, // Not available in list view
    capacity: 0, // Not available in list view
    artists: dbEvent.top_artists?.map((artist, index) => ({
      id: index, // Temporary ID
      name: artist.name || 'Unknown Artist',
      monthlyListeners: artist.monthly_listeners || 0,
    })) || [],
  };
};