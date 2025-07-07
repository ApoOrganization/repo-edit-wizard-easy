import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ArtistCalendarResponse, ArtistCalendarEvent, CalendarEventData } from '@/types/artist.types';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';

// Transform the JSONB calendar response to flat array format for UI
const transformCalendarData = (calendarData: ArtistCalendarResponse): CalendarEventData[] => {
  if (!calendarData) return [];

  const events: CalendarEventData[] = [];

  Object.entries(calendarData).forEach(([date, dayEvents]) => {
    dayEvents.forEach((event: ArtistCalendarEvent) => {
      events.push({
        id: event.event_id,
        date: date,
        name: event.event_name,
        venue: event.venue_name,
        city: event.city,
        time: event.start_time ? format(parseISO(event.start_time), 'HH:mm') : '',
        status: event.ticket_status || 'Unknown',
        role: event.artist_role || 'Artist',
        datetime: event.start_time || date + 'T00:00:00Z'
      });
    });
  });

  return events.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
};

// Hook to fetch artist calendar data for a specific month
export const useArtistCalendar = (
  artistId: string | undefined,
  currentMonth: Date = new Date()
) => {
  const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

  return useQuery<CalendarEventData[]>({
    queryKey: ['artist-calendar', artistId, startDate, endDate],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }

      console.log('🗓️ [ARTIST CALENDAR] Fetching calendar data:', {
        artistId,
        startDate,
        endDate,
        month: format(currentMonth, 'MMMM yyyy')
      });

      const { data, error } = await supabase.rpc('get_artist_calendar', {
        p_artist_id: artistId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) {
        console.error('❌ [ARTIST CALENDAR] Database error:', error);
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      console.log('📥 [ARTIST CALENDAR] Raw response:', {
        dataType: typeof data,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        eventCount: data ? Object.values(data).flat().length : 0
      });

      const transformedEvents = transformCalendarData(data as ArtistCalendarResponse);

      console.log('✅ [ARTIST CALENDAR] Transformed events:', {
        totalEvents: transformedEvents.length,
        dateRange: `${startDate} to ${endDate}`,
        eventsByDate: transformedEvents.reduce((acc, event) => {
          acc[event.date] = (acc[event.date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      return transformedEvents;
    },
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('🔄 [ARTIST CALENDAR] Retry decision:', {
        failureCount,
        errorMessage: error?.message,
        willRetry: failureCount < 2
      });
      return failureCount < 2;
    }
  });
};

// Hook to get calendar events for a specific date
export const useArtistCalendarByDate = (
  artistId: string | undefined,
  targetDate: Date
) => {
  const startDate = format(targetDate, 'yyyy-MM-dd');
  const endDate = format(targetDate, 'yyyy-MM-dd');

  return useQuery<CalendarEventData[]>({
    queryKey: ['artist-calendar-date', artistId, startDate],
    queryFn: async () => {
      if (!artistId) {
        throw new Error('Artist ID is required');
      }

      const { data, error } = await supabase.rpc('get_artist_calendar', {
        p_artist_id: artistId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) {
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      return transformCalendarData(data as ArtistCalendarResponse);
    },
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000 // 10 minutes for single date
  });
};