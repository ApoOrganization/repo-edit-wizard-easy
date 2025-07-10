import { EventListItem, TransformedEvent } from '@/types/event.types';

// Utility function to check if an event is in the past
export const isEventInPast = (dateString: string): boolean => {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate < now;
};

// Utility function to filter events by active/past status
export const filterEventsByTimeStatus = (events: TransformedEvent[], showPast: boolean = false): TransformedEvent[] => {
  return events.filter(event => {
    const isPast = isEventInPast(event.date);
    return showPast ? isPast : !isPast;
  });
};

export const transformEventFromDB = (dbEvent: EventListItem): TransformedEvent => {
  // Map status to match existing component expectations
  const mapStatus = (status: string, eventDate: string): TransformedEvent['status'] => {
    // If event is in the past, always mark as 'Past' regardless of original status
    if (isEventInPast(eventDate)) {
      return 'Past';
    }

    switch (status?.toLowerCase()) {
      case 'active':
      case 'onsale':
        return 'On Sale';
      case 'soldout':
        return 'Sold Out';
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
    status: mapStatus(dbEvent.status, dbEvent.date),
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