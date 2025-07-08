import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PromoterCalendarResponse, PromoterCalendarEvent, PromoterCalendarEventData } from '@/types/promoter.types';
import { format, getYear, getMonth } from 'date-fns';

// Transform the JSONB calendar response to flat array format for UI
const transformPromoterCalendarData = (calendarData: PromoterCalendarResponse, promoterName: string): PromoterCalendarEventData[] => {
  if (!calendarData) return [];

  console.log('🔄 [PROMOTER CALENDAR] Raw calendar data sample:', {
    totalDates: Object.keys(calendarData).length,
    firstDate: Object.keys(calendarData)[0],
    firstDateEvents: Object.values(calendarData)[0]?.length || 0,
    sampleEvent: Object.values(calendarData)[0]?.[0] ? {
      id: Object.values(calendarData)[0][0].id,
      idType: typeof Object.values(calendarData)[0][0].id,
      name: Object.values(calendarData)[0][0].name,
      venue_name: Object.values(calendarData)[0][0].venue_name,
      venue_city: Object.values(calendarData)[0][0].venue_city,
      genre: Object.values(calendarData)[0][0].genre,
      status: Object.values(calendarData)[0][0].status
    } : null
  });

  const events: PromoterCalendarEventData[] = [];

  Object.entries(calendarData).forEach(([date, dayEvents]) => {
    dayEvents.forEach((event: PromoterCalendarEvent) => {
      const transformedEvent = {
        id: String(event.id), // Ensure ID is string
        date: date,
        name: event.name,
        venue: event.venue_name && event.venue_city ? `${event.venue_name}, ${event.venue_city}` : 'Venue TBA',
        city: event.venue_city,
        time: event.time || '',
        status: event.status || 'active',
        has_tickets: event.has_tickets,
        genre: event.genre,
        venue_name: event.venue_name,
        venue_city: event.venue_city,
        datetime: `${date}T${event.time || '00:00'}:00Z`
      };

      console.log('📝 [PROMOTER CALENDAR] Transforming event:', {
        originalId: event.id,
        originalIdType: typeof event.id,
        transformedId: transformedEvent.id,
        transformedIdType: typeof transformedEvent.id,
        name: event.name,
        venue: event.venue_name && event.venue_city ? `${event.venue_name}, ${event.venue_city}` : 'Venue TBA',
        genre: event.genre,
        date: date
      });

      events.push(transformedEvent);
    });
  });

  return events.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
};

// Hook to fetch promoter calendar data for a specific month
export const usePromoterCalendar = (
  promoterId: string | undefined,
  promoterName: string = 'Promoter',
  currentMonth: Date = new Date()
) => {
  const year = getYear(currentMonth);
  const month = getMonth(currentMonth) + 1; // getMonth() returns 0-11, but we need 1-12

  return useQuery<PromoterCalendarEventData[]>({
    queryKey: ['promoter-calendar', promoterId, year, month],
    queryFn: async () => {
      if (!promoterId) {
        throw new Error('Promoter ID is required');
      }

      console.log('🗓️ [PROMOTER CALENDAR] Fetching calendar data:', {
        promoterId,
        promoterName,
        year,
        month,
        monthDisplay: format(currentMonth, 'MMMM yyyy')
      });

      const { data, error } = await supabase.rpc('get_promoter_calendar', {
        promoter_uuid: promoterId,
        year_param: year,
        month_param: month
      });

      if (error) {
        console.error('❌ [PROMOTER CALENDAR] Database error:', error);
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      console.log('📥 [PROMOTER CALENDAR] Raw response:', {
        dataType: typeof data,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        eventCount: data ? Object.values(data).flat().length : 0
      });

      const transformedEvents = transformPromoterCalendarData(data as PromoterCalendarResponse, promoterName);

      // Calculate venue and genre distributions for analytics
      const venueDistribution = transformedEvents.reduce((acc, event) => {
        const venueKey = `${event.venue_name}, ${event.venue_city}`;
        acc[venueKey] = (acc[venueKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const genreDistribution = transformedEvents.reduce((acc, event) => {
        const genre = event.genre || 'No Genre';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('✅ [PROMOTER CALENDAR] Transformed events:', {
        totalEvents: transformedEvents.length,
        year,
        month,
        eventsByDate: transformedEvents.reduce((acc, event) => {
          acc[event.date] = (acc[event.date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        venueDistribution,
        genreDistribution,
        uniqueVenues: Object.keys(venueDistribution).length,
        uniqueGenres: Object.keys(genreDistribution).length
      });

      return transformedEvents;
    },
    enabled: !!promoterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      console.log('🔄 [PROMOTER CALENDAR] Retry decision:', {
        failureCount,
        errorMessage: error?.message,
        willRetry: failureCount < 2
      });
      return failureCount < 2;
    }
  });
};

// Hook to get promoter calendar events for a specific date
export const usePromoterCalendarByDate = (
  promoterId: string | undefined,
  promoterName: string = 'Promoter',
  targetDate: Date
) => {
  const year = getYear(targetDate);
  const month = getMonth(targetDate) + 1;

  return useQuery<PromoterCalendarEventData[]>({
    queryKey: ['promoter-calendar-date', promoterId, year, month],
    queryFn: async () => {
      if (!promoterId) {
        throw new Error('Promoter ID is required');
      }

      const { data, error } = await supabase.rpc('get_promoter_calendar', {
        promoter_uuid: promoterId,
        year_param: year,
        month_param: month
      });

      if (error) {
        throw new Error(`Failed to fetch calendar data: ${error.message}`);
      }

      return transformPromoterCalendarData(data as PromoterCalendarResponse, promoterName);
    },
    enabled: !!promoterId,
    staleTime: 10 * 60 * 1000 // 10 minutes for single date
  });
};