
import { Venue } from './types';

export const mockVenues: Venue[] = [
  {
    id: 'madison-square-garden',
    name: 'Madison Square Garden',
    city: 'New York',
    capacity: 20000,
    type: 'Arena',
    events: 245,
    revenue: 28500000,
    rating: 4.8,
    image: '/placeholder.svg'
  },
  {
    id: 'the-o2-arena',
    name: 'The O2 Arena',
    city: 'London',
    capacity: 20000,
    type: 'Arena',
    events: 189,
    revenue: 22100000,
    rating: 4.7,
    image: '/placeholder.svg'
  },
  {
    id: 'wembley-stadium',
    name: 'Wembley Stadium',
    city: 'London',
    capacity: 90000,
    type: 'Stadium',
    events: 45,
    revenue: 45200000,
    rating: 4.9,
    image: '/placeholder.svg'
  },
  {
    id: 'crypto-com-arena',
    name: 'Crypto.com Arena',
    city: 'Los Angeles',
    capacity: 21000,
    type: 'Arena',
    events: 198,
    revenue: 31200000,
    rating: 4.6,
    image: '/placeholder.svg'
  },
  {
    id: 'forum',
    name: 'Forum',
    city: 'Los Angeles',
    capacity: 17500,
    type: 'Arena',
    events: 156,
    revenue: 18900000,
    rating: 4.5,
    image: '/placeholder.svg'
  },
  {
    id: 'metlife-stadium',
    name: 'MetLife Stadium',
    city: 'New Jersey',
    capacity: 82500,
    type: 'Stadium',
    events: 38,
    revenue: 42300000,
    rating: 4.3,
    image: '/placeholder.svg'
  }
];

// Helper function to get venue ID from name
export const getVenueIdFromName = (venueName: string): string => {
  const venue = mockVenues.find(v => v.name === venueName);
  return venue?.id || venueName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};
