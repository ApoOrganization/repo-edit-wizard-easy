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
      case 'past':
        return 'Past';
      default:
        return 'On Sale';
    }
  };

  // Extract artists from top_artists jsonb field
  const artists = Array.isArray(dbEvent.top_artists) 
    ? dbEvent.top_artists.map((artist: any, index: number) => ({
        id: index,
        name: artist?.name || 'Unknown Artist',
        agency: 'Unknown Agency',
        agent: 'Unknown Agent',
        territory: 'Unknown Territory',
        monthlyListeners: artist?.monthly_listeners || 0,
        followers: 0,
        topCities: [],
        genre: dbEvent.genre || 'Unknown',
      }))
    : [];

  // Extract providers from the providers array
  const providers = Array.isArray(dbEvent.providers) ? dbEvent.providers : [];

  return {
    id: dbEvent.id,
    name: dbEvent.name || 'Unknown Event',
    date: dbEvent.date,
    venue: dbEvent.venue_name || 'Unknown Venue',
    venue_id: dbEvent.venue_id,
    city: dbEvent.venue_city || 'Unknown City',
    genre: dbEvent.genre || 'Unknown',
    status: mapStatus(dbEvent.status),
    providers: providers,
    artists: artists,
    // Optional fields - only include if you need them
    // promoter: undefined,
    // image: '/placeholder.svg',
    // revenue: undefined,
    // ticketsSold: undefined,
    // capacity: undefined,
  };
};