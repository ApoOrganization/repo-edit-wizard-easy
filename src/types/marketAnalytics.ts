/**
 * TypeScript interfaces for market analytics data
 * Matches the response from get-market-analytics edge function
 */

export interface MarketAnalyticsTotals {
  revenue_realized: number;
  remaining_revenue: number;
  total_potential_revenue: number;
}

export interface MarketAnalyticsTimeSeriesPoint {
  date: string;
  tickets_sold: number;
  daily_revenue: number;
}

export interface MarketAnalyticsProviderDistribution {
  [providerName: string]: number;
}

export interface MarketAnalyticsGenreItem {
  count: number;
  genre: string;
  percentage: number;
}

export interface MarketAnalyticsResponse {
  totals: MarketAnalyticsTotals;
  timeseries: MarketAnalyticsTimeSeriesPoint[];
  provider_distribution: MarketAnalyticsProviderDistribution;
  genre_distribution: MarketAnalyticsGenreItem[];
}

// Processed data types for dashboard components
export interface ProcessedProviderData {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

export interface ProcessedRevenueChartData {
  date: string;
  revenue: number;
  tickets: number;
  formattedDate: string;
}

export interface ProcessedGenreData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  totalMarketSize: number;
  revenueGenerated: number;
  marketOpportunity: number;
  activeEvents: number;
  growthRate: number;
  totalTicketsSold: number;
}