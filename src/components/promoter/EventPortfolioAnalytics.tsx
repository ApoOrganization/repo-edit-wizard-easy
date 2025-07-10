import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PromoterTimeSeriesPoint } from '@/hooks/usePromoterTickets';
import { formatCurrency } from '@/utils/formatters';
import { parseEventName, getEventDisplayName } from '@/utils/eventFormatters';
import { Calendar, Star, MapPin } from 'lucide-react';

interface EventPortfolioAnalyticsProps {
  timeseries: PromoterTimeSeriesPoint[];
  eventsPresent?: { [eventId: string]: string };
  isLoading?: boolean;
}

interface EventMetrics {
  eventId: string;
  activeDays: number;
}

export const EventPortfolioAnalytics: React.FC<EventPortfolioAnalyticsProps> = ({
  timeseries,
  eventsPresent = {},
  isLoading = false
}) => {
  const eventMetrics = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return [];

    // Calculate basic metrics for each event
    const eventStats: { [eventId: string]: EventMetrics } = {};

    // Process each day's data to count active days per event
    timeseries.forEach(day => {
      day.events.forEach(eventId => {
        if (!eventStats[eventId]) {
          eventStats[eventId] = {
            eventId,
            activeDays: 0
          };
        }
        eventStats[eventId].activeDays += 1;
      });
    });

    // Convert to array and sort by active days
    return Object.values(eventStats)
      .sort((a, b) => b.activeDays - a.activeDays)
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
          <CardTitle className="text-sm font-semibold">Associated Events</CardTitle>
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


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Star className="h-4 w-4" />
          Associated Events
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {eventMetrics.length} events associated with this promoter
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventMetrics.map((event, index) => {
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
                    <div className="text-sm font-medium text-muted-foreground">
                      Click for details
                    </div>
                  </div>
                </div>

                {/* Basic Event Info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{event.activeDays}</div>
                    <div className="text-muted-foreground">Days Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-muted-foreground">Event Details</div>
                  </div>
                </div>

                {/* Basic Event Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Active {event.activeDays} days</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{eventMetrics.length}</div>
              <div className="text-xs text-muted-foreground">Events Listed</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {Math.max(...eventMetrics.map(e => e.activeDays))}
              </div>
              <div className="text-xs text-muted-foreground">Longest Run</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};