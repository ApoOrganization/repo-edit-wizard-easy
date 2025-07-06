
import { Promoter } from './types';

export const mockPromoters: Promoter[] = [
  {
    id: 'ln',
    name: 'Live Nation',
    city: 'Multiple',
    eventsCount: 1247,
    revenue: 125000000,
    rating: 4.5,
    specialty: 'Major Tours',
    image: '/placeholder.svg'
  },
  {
    id: 'aeg',
    name: 'AEG Presents',
    city: 'Multiple',
    eventsCount: 892,
    revenue: 89200000,
    rating: 4.3,
    specialty: 'Festivals & Venues',
    image: '/placeholder.svg'
  },
  {
    id: 'mtg',
    name: 'Messina Touring Group',
    city: 'Nashville',
    eventsCount: 156,
    revenue: 34500000,
    rating: 4.7,
    specialty: 'Country & Pop',
    image: '/placeholder.svg'
  }
];

// Helper function to get promoter ID from name
export const getPromoterIdFromName = (promoterName: string): string => {
  const promoter = mockPromoters.find(p => p.name === promoterName);
  return promoter?.id || promoterName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};
