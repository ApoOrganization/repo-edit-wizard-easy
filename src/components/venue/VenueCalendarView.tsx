import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCalendar } from '@/components/shared/EnhancedCalendar';
import { useVenueCalendar } from '@/hooks/useVenueCalendar';
import { VenueCalendarEventData } from '@/types/venue.types';
import { Event } from '@/data/types';
import { Loader2, Calendar, Music } from 'lucide-react';

interface VenueCalendarViewProps {
  venueId: string;
  venueName?: string;
  venueCity?: string;
}

export const VenueCalendarView: React.FC<VenueCalendarViewProps> = ({
  venueId,
  venueName,
  venueCity
}) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  
  const {
    data: calendarEvents,
    isLoading,
    error
  } = useVenueCalendar(venueId, venueName, venueCity, currentMonth);

  // Transform venue calendar events to EnhancedCalendar format
  const transformToCalendarFormat = (events: VenueCalendarEventData[]): Event[] => {
    console.log('🔄 [VENUE CALENDAR VIEW] Transforming events for calendar:', {
      eventsCount: events.length,
      sampleEvent: events[0] ? {
        id: events[0].id,
        idType: typeof events[0].id,
        name: events[0].name,
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
        // Add venue-specific properties for display
        has_tickets: event.has_tickets,
        time: event.time,
        city: event.city,
        genre: event.genre || 'No Genre', // Venue-specific field
        providers: [], // Not available in calendar function
        artists: [] // Not available in calendar function
      };

      console.log('🎯 [VENUE CALENDAR VIEW] Transformed event:', {
        originalId: event.id,
        transformedId: transformedEvent.id,
        idType: typeof transformedEvent.id,
        name: transformedEvent.name,
        genre: transformedEvent.genre,
        status: transformedEvent.status
      });

      return transformedEvent;
    });
  };

  const handleEventClick = (eventId: string) => {
    console.log('🔗 [VENUE CALENDAR] Event clicked:', { 
      eventId, 
      eventIdType: typeof eventId,
      venueId,
      isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)
    });

    // Validate event ID before navigation
    if (!eventId || eventId === 'NaN' || eventId === 'undefined') {
      console.error('❌ [VENUE CALENDAR] Invalid event ID:', eventId);
      return;
    }

    // Check if it's a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
      console.error('❌ [VENUE CALENDAR] Invalid UUID format:', eventId);
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

  const calendarTitle = `${venueName || 'Venue'} Event Calendar - ${format(currentMonth, 'MMMM yyyy')}`;
  const events = transformToCalendarFormat(calendarEvents || []);

  // Calculate genre distribution for display
  const genreDistribution = events.reduce((acc, event) => {
    const genre = event.genre || 'No Genre';
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('🗓️ [VENUE CALENDAR VIEW] Rendering calendar:', {
    venueId,
    venueName,
    eventsCount: events.length,
    currentMonth: format(currentMonth, 'yyyy-MM'),
    hasEvents: events.length > 0,
    genreDistribution
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Calendar
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {events.length > 0 
              ? `${events.length} events in ${format(currentMonth, 'MMMM yyyy')}`
              : `No events scheduled for ${format(currentMonth, 'MMMM yyyy')}`
            }
          </span>
          {events.length > 0 && Object.keys(genreDistribution).length > 1 && (
            <div className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              <span>{Object.keys(genreDistribution).length} genres</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <EnhancedCalendar
          events={events}
          title={calendarTitle}
          entityType="venue"
          currentMonth={currentMonth}
          onEventClick={handleEventClick}
          onMonthChange={setCurrentMonth}
        />
      </CardContent>
    </Card>
  );
};