import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EventSearchParams, EventSearchResponse, EventListItem } from '@/types/event.types';

export const useEventSearch = (params: EventSearchParams) => {
  return useQuery({
    queryKey: ['events-search', params],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<EventSearchResponse>('search-events', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    keepPreviousData: true, // Important for smooth pagination
  });
};

// Get unique filter options from the database
export const useEventFilterOptions = () => {
  return useQuery({
    queryKey: ['event-filter-options'],
    queryFn: async () => {
      // Get a sample of events to extract filter options
      const { data: events, error } = await supabase
        .from('event_list_summary')
        .select('genre, venue_city, status')
        .limit(1000); // Get enough to have variety
      
      if (error) throw error;
      
      const genres = [...new Set(events?.map(e => e.genre).filter(Boolean) || [])].sort();
      const cities = [...new Set(events?.map(e => e.venue_city).filter(Boolean) || [])].sort();
      const statuses = [...new Set(events?.map(e => e.status).filter(Boolean) || [])].sort();
      
      // For providers, we need to flatten the arrays
      const { data: providerData } = await supabase
        .from('event_list_summary')
        .select('providers')
        .limit(1000);
      
      const providers = [...new Set(
        providerData?.flatMap(e => e.providers || []) || []
      )].sort();
      
      return { genres, cities, statuses, providers };
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};