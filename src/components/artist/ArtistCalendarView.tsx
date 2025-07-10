import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCalendar } from '@/components/shared/EventCalendar';
import { useArtistCalendar } from '@/hooks/useArtistCalendar';
import { CalendarEventData } from '@/types/artist.types';
import { Event } from '@/data/types';
import { Loader2, Calendar } from 'lucide-react';

interface ArtistCalendarViewProps {
  artistId: string;
  artistName?: string;
}

export const ArtistCalendarView: React.FC<ArtistCalendarViewProps> = ({
  artistId,
  artistName
}) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  
  const {
    data: calendarEvents,
    isLoading,
    error
  } = useArtistCalendar(artistId, currentMonth);

  // Transform calendar events to EventCalendar format
  const transformToCalendarFormat = (events: CalendarEventData[]): Event[] => {
    console.log('🔄 [ARTIST CALENDAR VIEW] Transforming events for calendar:', {
      eventsCount: events.length,
      sampleEvent: events[0] ? {
        id: events[0].id,
        idType: typeof events[0].id,
        name: events[0].name,
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
        // Add additional properties for display
        has_tickets: event.has_tickets,
        time: event.time,
        city: event.city,
        genre: '', // Not available in calendar function
        providers: [], // Not available in calendar function
        artists: [] // Not available in calendar function
      };

      console.log('🎯 [ARTIST CALENDAR VIEW] Transformed event:', {
        originalId: event.id,
        transformedId: transformedEvent.id,
        idType: typeof transformedEvent.id,
        name: transformedEvent.name,
        status: transformedEvent.status
      });

      return transformedEvent;
    });
  };

  const handleEventClick = (eventId: string) => {
    console.log('🔗 [ARTIST CALENDAR] Event clicked:', { 
      eventId, 
      eventIdType: typeof eventId,
      artistId,
      isValidUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)
    });

    // Validate event ID before navigation
    if (!eventId || eventId === 'NaN' || eventId === 'undefined') {
      console.error('❌ [ARTIST CALENDAR] Invalid event ID:', eventId);
      return;
    }

    // Check if it's a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
      console.error('❌ [ARTIST CALENDAR] Invalid UUID format:', eventId);
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

  const calendarTitle = `${artistName || 'Artist'} Event Calendar - ${format(currentMonth, 'MMMM yyyy')}`;
  const events = transformToCalendarFormat(calendarEvents || []);

  console.log('🗓️ [ARTIST CALENDAR VIEW] Rendering calendar:', {
    artistId,
    artistName,
    eventsCount: events.length,
    currentMonth: format(currentMonth, 'yyyy-MM'),
    hasEvents: events.length > 0
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Calendar
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {events.length > 0 
            ? `${events.length} events in ${format(currentMonth, 'MMMM yyyy')}`
            : `No events scheduled for ${format(currentMonth, 'MMMM yyyy')}`
          }
        </p>
      </CardHeader>
      <CardContent>
        <EventCalendar
          events={events}
          title={calendarTitle}
          entityType="artist"
          currentMonth={currentMonth}
          onEventClick={handleEventClick}
          onMonthChange={setCurrentMonth}
        />
      </CardContent>
    </Card>
  );
};