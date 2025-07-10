import { 
  MarketAnalyticsResponse, 
  MarketAnalyticsTimeSeriesPoint,
  MarketAnalyticsProviderDistribution,
  MarketAnalyticsGenreItem,
  ProcessedProviderData,
  ProcessedRevenueChartData,
  ProcessedGenreData,
  DashboardMetrics
} from '@/types/marketAnalytics';

// Color palettes for consistent styling
const PROVIDER_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500'
];

const GENRE_COLORS = [
  '#3B82F6', '#EF4444', '#8B5CF6', '#10B981', '#F59E0B',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  '#06B6D4', '#8B5A2B', '#DC2626', '#7C3AED', '#059669',
  '#D97706', '#BE185D', '#4338CA', '#0891B2', '#65A30D',
  '#0284C7', '#92400E', '#B91C1C', '#6D28D9', '#047857',
  '#C2410C', '#A21CAF', '#3730A3', '#0E7490', '#4D7C0F'
];

/**
 * Calculate growth rate from timeseries data
 */
export const calculateGrowthRate = (timeseries: MarketAnalyticsTimeSeriesPoint[]): number => {
  if (timeseries.length < 2) return 0;
  
  // Filter out zero revenue days for more accurate growth calculation
  const nonZeroRevenueDays = timeseries.filter(day => day.daily_revenue > 0);
  
  if (nonZeroRevenueDays.length < 2) return 0;
  
  // Sort by date to ensure chronological order
  const sortedDays = nonZeroRevenueDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Take first and last periods for growth calculation
  const firstPeriod = sortedDays.slice(0, Math.ceil(sortedDays.length / 3));
  const lastPeriod = sortedDays.slice(-Math.ceil(sortedDays.length / 3));
  
  const firstPeriodAvg = firstPeriod.reduce((sum, day) => sum + day.daily_revenue, 0) / firstPeriod.length;
  const lastPeriodAvg = lastPeriod.reduce((sum, day) => sum + day.daily_revenue, 0) / lastPeriod.length;
  
  if (firstPeriodAvg === 0) return 0;
  
  return ((lastPeriodAvg - firstPeriodAvg) / firstPeriodAvg) * 100;
};

/**
 * Calculate total tickets sold from timeseries
 */
export const calculateTotalTicketsSold = (timeseries: MarketAnalyticsTimeSeriesPoint[]): number => {
  return timeseries.reduce((total, day) => total + day.tickets_sold, 0);
};

/**
 * Transform provider distribution object to array format for components
 */
export const formatProviderData = (distribution: MarketAnalyticsProviderDistribution): ProcessedProviderData[] => {
  const totalEvents = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(distribution)
    .map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      count,
      color: PROVIDER_COLORS[index % PROVIDER_COLORS.length],
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

/**
 * Process timeseries data for revenue chart
 */
export const processTimeSeriesForChart = (timeseries: MarketAnalyticsTimeSeriesPoint[]): ProcessedRevenueChartData[] => {
  // Filter out zero revenue days and sort by date
  return timeseries
    .filter(day => day.daily_revenue > 0) // Only include days with revenue
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(day => ({
      date: day.date,
      revenue: day.daily_revenue,
      tickets: day.tickets_sold,
      formattedDate: new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }));
};

/**
 * Process genre distribution for pie chart
 */
export const processGenreDistribution = (genres: MarketAnalyticsGenreItem[]): ProcessedGenreData[] => {
  return genres
    .slice(0, 10) // Take top 10 genres for readability
    .map((genre, index) => ({
      name: genre.genre,
      value: genre.percentage,
      color: GENRE_COLORS[index % GENRE_COLORS.length]
    }));
};

/**
 * Calculate dashboard metrics from market analytics data
 */
export const calculateDashboardMetrics = (data: MarketAnalyticsResponse): DashboardMetrics => {
  const totalTicketsSold = calculateTotalTicketsSold(data.timeseries);
  const growthRate = calculateGrowthRate(data.timeseries);
  const activeEvents = Object.values(data.provider_distribution).reduce((sum, count) => sum + count, 0);
  
  return {
    totalMarketSize: data.totals.total_potential_revenue,
    revenueGenerated: data.totals.revenue_realized,
    marketOpportunity: data.totals.remaining_revenue,
    activeEvents,
    growthRate,
    totalTicketsSold
  };
};

/**
 * Format currency values for display
 */
export const formatCurrency = (value: number, currency: string = '₺'): string => {
  if (value >= 1000000000) {
    return `${currency}${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${currency}${(value / 1000).toFixed(1)}K`;
  }
  return `${currency}${value.toFixed(0)}`;
};

/**
 * Format large numbers for display
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};