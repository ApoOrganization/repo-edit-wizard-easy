import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { VenueCalendarResponse, VenueCalendarEvent, VenueCalendarEventData } from '@/types/venue.types';
import { format, getYear, getMonth } from 'date-fns';

// Transform the JSONB calendar response to flat array format for UI
const transformVenueCalendarData = (calendarData: VenueCalendarResponse, venueName: string, venueCity: string): VenueCalendarEventData[] => {
  if (!calendarData) return [];

  console.log('🔄 [VENUE CALENDAR] Raw calendar data sample:', {
    totalDates: Object.keys(calendarData).length,
    firstDate: Object.keys(calendarData)[0],
    firstDateEvents: Object.values(calendarData)[0]?.length || 0,
    sampleEvent: Object.values(calendarData)[0]?.[0] ? {
      id: Object.values(calendarData)[0][0].id,
      idType: typeof Object.values(calendarData)[0][0].id,
      name: Object.values(calendarData)[0][0].name,
      genre: Object.values(calendarData)[0][0].genre,
      status: Object.values(calendarData)[0][0].status
    } : null
  });

  const events: VenueCalendarEventData[] = [];

  Object.entries(calendarData).forEach(([date, dayEvents]) => {
    dayEvents.forEach((event: VenueCalendarEvent) => {
      const transformedEvent = {
        id: String(event.id), // Ensure ID is string
        date: date,
        name: event.name,
        venue: venueName,
        city: venueCity,
        time: event.time || '',
        status: event.status || 'active',
        has_tickets: event.has_tickets,
        genre: event.genre,
        datetime: `${date}T${event.time || '00:00'}:00Z`
      };

      console.log('📝 [VENUE CALENDAR] Transforming event:', {
        originalId: event.id,
        originalIdType: typeof event.id,
        transformedId: transformedEvent.id,
        transformedIdType: typeof transformedEvent.id,
        name: event.name,
        genre: event.genre,
        date: date
      });

      events.push(transformedEvent);
    });
  });

  return events.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
};

// Hook to fetch venue calendar data for a specific month
export const useVenueCalendar = (
  venueId: string | undefined,
  venueName: string = 'Venue',
  venueCity: string = '',
  currentMonth: Date = new Date()
) => {
  const year = getYear(currentMonth);
  const month = getMonth(currentMonth) + 1; // getMonth() returns 0-11, but we need 1-12

  return useQuery<VenueCalendarEventData[]>({
    queryKey: ['venue-calendar', venueId, year, month],
    queryFn: async () => {
      if (!venueId) {
        throw new Error('Venue ID is required');
      }

      console.log('🗓️ [VENUE CALENDAR] Fetching calendar data:', {
        venueId,
        venueName,
        venueCity,
        year,
        month,
        monthDisplay: format(currentMonth, 'MMMM yyyy')
      });

      const { data, error } = await supabase.rpc('get_venue_calendar', {
        venue_uuid: venueId,
        year_param: year,
        month_param: month
      });

      if (error) {
        console.error('❌ [VENUE CALENDAR] Database error:', error);
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      console.log('📥 [VENUE CALENDAR] Raw response:', {
        dataType: typeof data,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        eventCount: data ? Object.values(data).flat().length : 0
      });

      const transformedEvents = transformVenueCalendarData(data as VenueCalendarResponse, venueName, venueCity);

      console.log('✅ [VENUE CALENDAR] Transformed events:', {
        totalEvents: transformedEvents.length,
        year,
        month,
        eventsByDate: transformedEvents.reduce((acc, event) => {
          acc[event.date] = (acc[event.date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        genreDistribution: transformedEvents.reduce((acc, event) => {
          const genre = event.genre || 'No Genre';
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      return transformedEvents;
    },
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('🔄 [VENUE CALENDAR] Retry decision:', {
        failureCount,
        errorMessage: error?.message,
        willRetry: failureCount < 2
      });
      return failureCount < 2;
    }
  });
};

// Hook to get venue calendar events for a specific date
export const useVenueCalendarByDate = (
  venueId: string | undefined,
  venueName: string = 'Venue',
  venueCity: string = '',
  targetDate: Date
) => {
  const year = getYear(targetDate);
  const month = getMonth(targetDate) + 1;

  return useQuery<VenueCalendarEventData[]>({
    queryKey: ['venue-calendar-date', venueId, year, month],
    queryFn: async () => {
      if (!venueId) {
        throw new Error('Venue ID is required');
      }

      const { data, error } = await supabase.rpc('get_venue_calendar', {
        venue_uuid: venueId,
        year_param: year,
        month_param: month
      });

      if (error) {
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      return transformVenueCalendarData(data as VenueCalendarResponse, venueName, venueCity);
    },
    enabled: !!venueId,
    staleTime: 10 * 60 * 1000 // 10 minutes for single date
  });
};