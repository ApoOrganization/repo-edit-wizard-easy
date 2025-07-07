
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EventSearchParams, EventSearchResponse, EventListItem } from '@/types/event.types';

export const useEventSearch = (params: EventSearchParams) => {
  return useQuery({
    queryKey: ['events-search', params],
    queryFn: async (): Promise<EventSearchResponse> => {
      let query = supabase
        .from('event_list_summary')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (params.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,venue_name.ilike.%${params.searchTerm}%,venue_city.ilike.%${params.searchTerm}%`);
      }

      // Apply genre filter
      if (params.genres && params.genres.length > 0) {
        query = query.in('genre', params.genres);
      }

      // Apply status filter
      if (params.status && params.status.length > 0) {
        query = query.in('status', params.status);
      }

      // Apply city filter
      if (params.cities && params.cities.length > 0) {
        query = query.in('venue_city', params.cities);
      }

      // Apply venue filter
      if (params.venues && params.venues.length > 0) {
        query = query.in('venue_name', params.venues);
      }

      // Apply artist filter
      if (params.artists && params.artists.length > 0) {
        // Check if any of the specified artists are in the top_artists array
        const artistConditions = params.artists.map(artist => 
          `top_artists->0->>name.eq."${artist}" or top_artists->1->>name.eq."${artist}" or top_artists->2->>name.eq."${artist}"`
        ).join(' or ');
        query = query.or(artistConditions);
      }

      // Apply provider filter
      if (params.providers && params.providers.length > 0) {
        // Check if any of the specified providers are available
        const providerConditions = params.providers.map(provider => 
          `ticket_availability->>\'${provider}\' = \'true\'`
        ).join(' or ');
        query = query.or(providerConditions);
      }

      // Apply date range filter
      if (params.dateRange) {
        query = query.gte('date', params.dateRange.start).lte('date', params.dateRange.end);
      }

      // Apply price range filter
      if (params.priceRange) {
        if (params.priceRange.min) {
          query = query.gte('price_range->>min_price', params.priceRange.min);
        }
        if (params.priceRange.max) {
          query = query.lte('price_range->>max_price', params.priceRange.max);
        }
      }

      // Apply sorting
      const sortBy = params.sortBy || 'date';
      const sortOrder = params.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        events: (data || []) as EventListItem[],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    },
    placeholderData: (previousData) => previousData,
  });
};

// Get unique filter options from the database
export const useEventFilterOptions = () => {
  return useQuery({
    queryKey: ['event-filter-options'],
    queryFn: async () => {
      // Get genres
      const { data: genreData, error: genreError } = await supabase
        .from('event_list_summary')
        .select('genre')
        .not('genre', 'is', null)
        .limit(1000);
      
      if (genreError) throw genreError;
      
      const genres = [...new Set(genreData?.map(e => e.genre).filter(Boolean) || [])].sort();

      // Get cities
      const { data: cityData, error: cityError } = await supabase
        .from('event_list_summary')
        .select('venue_city')
        .not('venue_city', 'is', null)
        .limit(1000);
      
      if (cityError) throw cityError;
      
      const cities = [...new Set(cityData?.map(e => e.venue_city).filter(Boolean) || [])].sort();

      // Get statuses
      const { data: statusData, error: statusError } = await supabase
        .from('event_list_summary')
        .select('status')
        .not('status', 'is', null)
        .limit(1000);
      
      if (statusError) throw statusError;
      
      const statuses = [...new Set(statusData?.map(e => e.status).filter(Boolean) || [])].sort();

      // Get venues
      const { data: venueData, error: venueError } = await supabase
        .from('event_list_summary')
        .select('venue_name')
        .not('venue_name', 'is', null)
        .limit(1000);
      
      if (venueError) throw venueError;
      
      const venues = [...new Set(venueData?.map(e => e.venue_name).filter(Boolean) || [])].sort();

      // Get artists from top_artists jsonb field
      const { data: artistData, error: artistError } = await supabase
        .from('event_list_summary')
        .select('top_artists')
        .not('top_artists', 'is', null)
        .limit(1000);
      
      if (artistError) throw artistError;
      
      const artistSet = new Set<string>();
      artistData?.forEach(item => {
        if (Array.isArray(item.top_artists)) {
          item.top_artists.forEach((artist: any) => {
            if (artist?.name) {
              artistSet.add(artist.name);
            }
          });
        }
      });
      
      const artists = Array.from(artistSet).sort();

      // Get providers from ticket_availability jsonb field
      const { data: providerData, error: providerError } = await supabase
        .from('event_list_summary')
        .select('ticket_availability')
        .not('ticket_availability', 'is', null)
        .limit(1000);
      
      if (providerError) throw providerError;
      
      const providerSet = new Set<string>();
      providerData?.forEach(item => {
        if (item.ticket_availability && typeof item.ticket_availability === 'object') {
          Object.keys(item.ticket_availability).forEach(key => {
            if (key !== 'any_available' && item.ticket_availability[key] === true) {
              providerSet.add(key);
            }
          });
        }
      });
      
      const providers = Array.from(providerSet).sort();
      
      return { genres, cities, venues, artists, statuses, providers };
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};
