import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCalendar } from '@/components/shared/EnhancedCalendar';
import { usePromoterCalendar } from '@/hooks/usePromoterCalendar';
import { PromoterCalendarEventData } from '@/types/promoter.types';
import { Event } from '@/data/types';
import { Loader2, Calendar, Music, MapPin, Building2 } from 'lucide-react';

interface PromoterCalendarViewProps {
  promoterId: string;
  promoterName?: string;
}

export const PromoterCalendarView: React.FC<PromoterCalendarViewProps> = ({
  promoterId,
  promoterName
}) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  
  const {
    data: calendarEvents,
    isLoading,
    error
  } = usePromoterCalendar(promoterId, promoterName, currentMonth);

  // Transform promoter calendar events to EnhancedCalendar format
  const transformToCalendarFormat = (events: PromoterCalendarEventData[]): Event[] => {
    console.log('🔄 [PROMOTER CALENDAR VIEW] Transforming events for calendar:', {
      eventsCount: events.length,
      sampleEvent: events[0] ? {
        id: events[0].id,
        idType: typeof events[0].id,
        name: events[0].name,
        venue_name: events[0].venue_name,
        venue_city: events[0].venue_city,
        genre: events[0].genre,
        status: events[0].status,
        has_tickets: events[0].has_tickets
      } : null
    });

    return events.map(event => {
      // Map status from database to valid Event status values
      let eventStatus: 'On Sale' | 'Sold Out' | 'Cancelled' | 'Postponed' = 'On Sale';
      
      if (event.status === 'cancelled') {
        eventStatus = 'Cancelled';
      } else if (event.status === 'sold_out') {
        eventStatus = 'Sold Out';
      } else if (event.status === 'postponed') {
        eventStatus = 'Postponed';
      } else if (event.has_tickets) {
        eventStatus = 'On Sale';
      } else {
        eventStatus = 'Cancelled'; // Default for events without tickets
      }

      const transformedEvent = {
        id: String(event.id), // Ensure ID is string
        name: event.name,
        date: event.datetime,
        venue: event.venue,
        status: eventStatus,
        // Add promoter-specific properties for display
        has_tickets: event.has_tickets,
        time: event.time,
        city: event.city,
        genre: event.genre || 'No Genre', // Promoter handles multiple genres
        venue_name: event.venue_name, // Separate venue name for analysis
        venue_city: event.venue_city, // Separate venue city for analysis
        providers: [], // Not available in calendar function
        artists: [] // Not available in calendar function
      };

      console.log('🎯 [PROMOTER CALENDAR VIEW] Transformed event:', {
        originalId: event.id,
        transformedId: transformedEvent.id,
        idType: typeof transformedEvent.id,
        name: transformedEvent.name,
        venue: transformedEvent.venue,
        genre: transformedEvent.genre,
        status: transformedEvent.status
      });

      return transformedEvent;
    });
  };

  const handleEventClick = (eventId: string) => {
    console.log('🔗 [PROMOTER CALENDAR] Event clicked:', { 
      eventId, 
      eventIdType: typeof eventId,
      promoterId,
      isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)
    });

    // Validate event ID before navigation
    if (!eventId || eventId === 'NaN' || eventId === 'undefined') {
      console.error('❌ [PROMOTER CALENDAR] Invalid event ID:', eventId);
      return;
    }

    // Check if it's a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
      console.error('❌ [PROMOTER CALENDAR] Invalid UUID format:', eventId);
      return;
    }

    // Navigate to event detail page
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground mb-4">
              Failed to load calendar data
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const calendarTitle = `${promoterName || 'Promoter'} Event Calendar - ${format(currentMonth, 'MMMM yyyy')}`;
  const events = transformToCalendarFormat(calendarEvents || []);

  // Calculate venue and genre distributions for display
  const venueDistribution = events.reduce((acc, event) => {
    const venueKey = `${(event as any).venue_name}, ${(event as any).venue_city}`;
    acc[venueKey] = (acc[venueKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreDistribution = events.reduce((acc, event) => {
    const genre = event.genre || 'No Genre';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueVenues = Object.keys(venueDistribution).length;
  const uniqueGenres = Object.keys(genreDistribution).filter(g => g !== 'No Genre').length;

  console.log('🗓️ [PROMOTER CALENDAR VIEW] Rendering calendar:', {
    promoterId,
    promoterName,
    eventsCount: events.length,
    currentMonth: format(currentMonth, 'yyyy-MM'),
    hasEvents: events.length > 0,
    uniqueVenues,
    uniqueGenres,
    venueDistribution,
    genreDistribution
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Calendar
        </CardTitle>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>
            {events.length > 0 
              ? `${events.length} events in ${format(currentMonth, 'MMMM yyyy')}`
              : `No events scheduled for ${format(currentMonth, 'MMMM yyyy')}`
            }
          </span>
          {events.length > 0 && (
            <>
              {uniqueVenues > 0 && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{uniqueVenues} {uniqueVenues === 1 ? 'venue' : 'venues'}</span>
                </div>
              )}
              {uniqueGenres > 0 && (
                <div className="flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  <span>{uniqueGenres} {uniqueGenres === 1 ? 'genre' : 'genres'}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Show top venues and genres if available */}
        {events.length > 0 && (uniqueVenues > 1 || uniqueGenres > 1) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            {uniqueVenues > 1 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="font-medium">Top Venues:</span>
                </div>
                <div className="space-y-1">
                  {Object.entries(venueDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([venue, count]) => (
                      <div key={venue} className="flex justify-between">
                        <span className="truncate">{venue}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {uniqueGenres > 1 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Music className="h-3 w-3" />
                  <span className="font-medium">Top Genres:</span>
                </div>
                <div className="space-y-1">
                  {Object.entries(genreDistribution)
                    .filter(([genre]) => genre !== 'No Genre')
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([genre, count]) => (
                      <div key={genre} className="flex justify-between">
                        <span className="truncate">{genre}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <EnhancedCalendar
          events={events}
          title={calendarTitle}
          entityType="promoter"
          currentMonth={currentMonth}
          onEventClick={handleEventClick}
          onMonthChange={setCurrentMonth}
        />
      </CardContent>
    </Card>
  );
};