
import { MarketData, ProviderData, RevenueChartData, GenreDistribution } from './types';

export const marketData: MarketData = {
  totalMarketSize: 1250000,
  revenueGenerated: 875000,
  marketOpportunity: 375000,
  activeEvents: 1247
};

export const providerData: ProviderData[] = [
  { name: 'Biletix', count: 456, color: 'bg-blue-500', percentage: 32.1 },
  { name: 'Biletinial', count: 234, color: 'bg-green-500', percentage: 16.5 },
  { name: 'Passo', count: 189, color: 'bg-purple-500', percentage: 13.3 },
  { name: 'Bugece', count: 167, color: 'bg-orange-500', percentage: 11.7 },
  { name: 'Bubilet', count: 201, color: 'bg-red-500', percentage: 14.2 }
];

export const revenueChartData: RevenueChartData[] = [
  { month: 'Jan', revenue: 4200000, events: 89 },
  { month: 'Feb', revenue: 3800000, events: 76 },
  { month: 'Mar', revenue: 5100000, events: 102 },
  { month: 'Apr', revenue: 4700000, events: 94 },
  { month: 'May', revenue: 6200000, events: 118 },
  { month: 'Jun', revenue: 7800000, events: 145 },
  { month: 'Jul', revenue: 8900000, events: 167 },
  { month: 'Aug', revenue: 8200000, events: 156 },
  { month: 'Sep', revenue: 6800000, events: 134 },
  { month: 'Oct', revenue: 7200000, events: 142 },
  { month: 'Nov', revenue: 5900000, events: 121 },
  { month: 'Dec', revenue: 8400000, events: 178 }
];

export const genreDistribution: GenreDistribution[] = [
  { name: 'Pop', value: 35, color: '#3B82F6' },
  { name: 'Rock', value: 28, color: '#EF4444' },
  { name: 'Hip-Hop', value: 18, color: '#8B5CF6' },
  { name: 'Electronic', value: 12, color: '#10B981' },
  { name: 'Country', value: 7, color: '#F59E0B' }
];
