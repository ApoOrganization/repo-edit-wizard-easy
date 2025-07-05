
import { Venue } from './types';

export const mockVenues: Venue[] = [
  {
    id: 'msg',
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
    id: 'o2',
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
    id: 'wembley',
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
    id: 'crypto',
    name: 'Crypto.com Arena',
    city: 'Los Angeles',
    capacity: 21000,
    type: 'Arena',
    events: 198,
    revenue: 31200000,
    rating: 4.6,
    image: '/placeholder.svg'
  }
];
