import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PromoterTimeSeriesPoint } from '@/hooks/usePromoterTickets';
import { formatCurrency } from '@/utils/formatters';
import { parseEventName, getEventDisplayName } from '@/utils/eventFormatters';
import { Calendar, TrendingUp, Star, Activity, MapPin } from 'lucide-react';

interface EventPortfolioAnalyticsProps {
  timeseries: PromoterTimeSeriesPoint[];
  eventsPresent?: { [eventId: string]: string };
  isLoading?: boolean;
}

interface EventMetrics {
  eventId: string;
  totalRevenue: number;
  totalTickets: number;
  activeDays: number;
  avgDailyRevenue: number;
  avgDailyTickets: number;
  peakRevenue: number;
  revenueShare: number;
}

export const EventPortfolioAnalytics: React.FC<EventPortfolioAnalyticsProps> = ({
  timeseries,
  eventsPresent = {},
  isLoading = false
}) => {
  const eventMetrics = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return [];

    // Calculate metrics for each event
    const eventStats: { [eventId: string]: EventMetrics } = {};
    const totalPromoterRevenue = timeseries.reduce((sum, day) => sum + day.daily_revenue, 0);

    // Process each day's data
    timeseries.forEach(day => {
      day.events.forEach(eventId => {
        if (!eventStats[eventId]) {
          eventStats[eventId] = {
            eventId,
            totalRevenue: 0,
            totalTickets: 0,
            activeDays: 0,
            avgDailyRevenue: 0,
            avgDailyTickets: 0,
            peakRevenue: 0,
            revenueShare: 0
          };
        }

        // For simplicity, we'll distribute the day's revenue/tickets equally among active events
        // In a real scenario, you'd want event-specific data
        const eventsCount = day.events.length;
        const eventDayRevenue = eventsCount > 0 ? day.daily_revenue / eventsCount : 0;
        const eventDayTickets = eventsCount > 0 ? day.tickets_sold / eventsCount : 0;

        eventStats[eventId].totalRevenue += eventDayRevenue;
        eventStats[eventId].totalTickets += eventDayTickets;
        eventStats[eventId].activeDays += 1;
        eventStats[eventId].peakRevenue = Math.max(eventStats[eventId].peakRevenue, eventDayRevenue);
      });
    });

    // Calculate derived metrics
    Object.values(eventStats).forEach(event => {
      event.avgDailyRevenue = event.activeDays > 0 ? event.totalRevenue / event.activeDays : 0;
      event.avgDailyTickets = event.activeDays > 0 ? event.totalTickets / event.activeDays : 0;
      event.revenueShare = totalPromoterRevenue > 0 ? (event.totalRevenue / totalPromoterRevenue) * 100 : 0;
    });

    // Convert to array and sort by total revenue
    return Object.values(eventStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 8); // Show top 8 events
  }, [timeseries]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Event Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-2 w-full bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!eventMetrics || eventMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Event Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No event data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceBadge = (revenueShare: number) => {
    if (revenueShare >= 30) return { variant: 'default' as const, label: 'Top Performer' };
    if (revenueShare >= 15) return { variant: 'secondary' as const, label: 'High Performer' };
    if (revenueShare >= 5) return { variant: 'outline' as const, label: 'Good Performer' };
    return { variant: 'outline' as const, label: 'Contributing' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Star className="h-4 w-4" />
          Event Portfolio Performance
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Revenue contribution from {eventMetrics.length} events in the portfolio
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventMetrics.map((event, index) => {
            const badge = getPerformanceBadge(event.revenueShare);
            
            return (
              <div key={event.eventId} className="space-y-2 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                {/* Event Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/events/${event.eventId}`}
                          className="text-sm font-medium text-primary hover:underline truncate"
                          title={eventsPresent[event.eventId] || event.eventId}
                        >
                          {eventsPresent[event.eventId] ? 
                            parseEventName(eventsPresent[event.eventId]).title : 
                            `Event ${event.eventId.slice(0, 8)}...`
                          }
                        </Link>
                        <Badge variant={badge.variant} className="text-xs flex-shrink-0">
                          {badge.label}
                        </Badge>
                      </div>
                      {eventsPresent[event.eventId] && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {parseEventName(eventsPresent[event.eventId]).presenter && (
                            <span>{parseEventName(eventsPresent[event.eventId]).presenter}</span>
                          )}
                          {parseEventName(eventsPresent[event.eventId]).location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {parseEventName(eventsPresent[event.eventId]).location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold">
                      {formatCurrency(event.totalRevenue, '₺')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.revenueShare.toFixed(1)}% of total
                    </div>
                  </div>
                </div>

                {/* Revenue Progress Bar */}
                <Progress 
                  value={event.revenueShare} 
                  className="h-2"
                  style={{
                    background: event.revenueShare >= 20 ? 'rgb(220 252 231)' : 'rgb(243 244 246)',
                  }}
                />

                {/* Event Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{event.totalTickets.toFixed(0)}</div>
                    <div className="text-muted-foreground">Total Tickets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{event.activeDays}</div>
                    <div className="text-muted-foreground">Active Days</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatCurrency(event.avgDailyRevenue, '₺')}</div>
                    <div className="text-muted-foreground">Avg Daily Rev</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatCurrency(event.peakRevenue, '₺')}</div>
                    <div className="text-muted-foreground">Peak Day Rev</div>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{event.avgDailyTickets.toFixed(1)} tickets/day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Active {event.activeDays} days</span>
                    </div>
                  </div>
                  
                  {event.revenueShare >= 15 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">High Impact</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{eventMetrics.length}</div>
              <div className="text-xs text-muted-foreground">Events Tracked</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {Math.max(...eventMetrics.map(e => e.activeDays))}
              </div>
              <div className="text-xs text-muted-foreground">Longest Run</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {formatCurrency(Math.max(...eventMetrics.map(e => e.peakRevenue)), '₺')}
              </div>
              <div className="text-xs text-muted-foreground">Best Day</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {(eventMetrics.reduce((sum, e) => sum + e.totalTickets, 0)).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Tickets</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};