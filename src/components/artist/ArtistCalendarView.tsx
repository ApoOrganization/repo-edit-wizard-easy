import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCalendar } from '@/components/shared/EnhancedCalendar';
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

  // Transform calendar events to EnhancedCalendar format
  const transformToCalendarFormat = (events: CalendarEventData[]): Event[] => {
    return events.map(event => ({
      id: event.id,
      name: event.name,
      date: event.datetime,
      venue: `${event.venue}, ${event.city}`,
      status: event.status,
      // Add additional properties for display
      artist_role: event.role,
      time: event.time
    }));
  };

  const handleEventClick = (eventId: string) => {
    // Navigate to event detail page
    console.log('🔗 [ARTIST CALENDAR] Event clicked:', { eventId, artistId });
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
        <EnhancedCalendar
          events={events}
          title={calendarTitle}
          entityType="artist"
          onEventClick={handleEventClick}
          onMonthChange={setCurrentMonth}
        />
      </CardContent>
    </Card>
  );
};