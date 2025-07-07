
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

  // Extract artists from top_artists jsonb field
  const artists = Array.isArray(dbEvent.top_artists) 
    ? dbEvent.top_artists.map((artist: any, index: number) => ({
        id: index,
        name: artist?.name || 'Unknown Artist',
        monthlyListeners: artist?.monthly_listeners || 0,
      }))
    : [];

  // Extract providers from the providers array
  const providers = Array.isArray(dbEvent.providers) ? dbEvent.providers : [];

  return {
    id: dbEvent.id,
    name: dbEvent.name || 'Unknown Event',
    date: dbEvent.date,
    venue: dbEvent.venue_name || 'Unknown Venue',
    city: dbEvent.venue_city || 'Unknown City',
    promoter: 'Unknown', // We'll fix this when promoter data is available
    genre: dbEvent.genre || 'Unknown',
    status: mapStatus(dbEvent.status),
    providers: providers,
    image: '/placeholder.svg', // Default image
    revenue: 0, // Not available in list view
    ticketsSold: 0, // Not available in list view
    capacity: 0, // Not available in list view
    artists: artists,
  };
};
