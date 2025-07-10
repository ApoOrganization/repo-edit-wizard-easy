/**
 * Shared TypeScript interfaces for ticket analytics
 * Used by both promoter and venue ticket analytics components
 */

export interface TimeSeriesPoint {
  date: string;
  events: string[]; // Event IDs active on this date
  tickets_sold: number;
  daily_revenue: number;
}

export interface TicketTotals {
  revenue_realized: number;
  remaining_revenue: number;
  total_potential_revenue: number;
}

export interface TicketAnalyticsResponse<T extends string> {
  totals: TicketTotals;
  timeseries: TimeSeriesPoint[];
  events_present: { [eventId: string]: string }; // Event ID to event name mapping
} & {
  [K in T]: string; // Dynamic entity_id property (promoter_id | venue_id)
}

export interface TicketAnalyticsError<T extends string> {
  error: 'no_bubilet_data';
} & {
  [K in T]: string; // Dynamic entity_id property (promoter_id | venue_id)
}

export type TicketAnalyticsResult<T extends string> = 
  | TicketAnalyticsResponse<T> 
  | TicketAnalyticsError<T>;

// Specific type aliases for promoter and venue
export type PromoterTicketsResponse = TicketAnalyticsResponse<'promoter_id'>;
export type PromoterTicketsError = TicketAnalyticsError<'promoter_id'>;
export type PromoterTicketsResult = TicketAnalyticsResult<'promoter_id'>;

export type VenueTicketsResponse = TicketAnalyticsResponse<'venue_id'>;
export type VenueTicketsError = TicketAnalyticsError<'venue_id'>;
export type VenueTicketsResult = TicketAnalyticsResult<'venue_id'>;

// Helper function to check if response has ticket data
export const hasTicketData = <T extends string>(
  result: TicketAnalyticsResult<T> | undefined
): result is TicketAnalyticsResponse<T> => {
  return result !== undefined && !('error' in result);
};

// Helper function to check if response is an error
export const isTicketError = <T extends string>(
  result: TicketAnalyticsResult<T> | undefined
): result is TicketAnalyticsError<T> => {
  return result !== undefined && 'error' in result;
};

// Entity types for shared components
export type EntityType = 'promoter' | 'venue';

// Chart mode type for time series charts
export type ChartMode = 'revenue' | 'sales' | 'events';

// Entity-specific configuration for shared components
export interface EntityConfig {
  type: EntityType;
  icon: React.ComponentType<{ className?: string }>;
  displayName: string;
  chartTitle: {
    revenue: string;
    sales: string;
    events: string;
  };
  chartDescription: {
    revenue: string;
    sales: string;
    events: string;
  };
  revenueCardText: {
    totalPotential: string;
  };
}