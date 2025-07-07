import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VenueSearchParams, VenueSearchResponse, VenueFilterOptions } from "@/types/venue.types";

export const useVenueSearch = (params: VenueSearchParams) => {
  return useQuery<VenueSearchResponse>({
    queryKey: ['venues-search', params],
    queryFn: async () => {
      console.log('Searching venues with params:', params);

      // Use direct Supabase query with specific fields to improve performance
      let query = supabase
        .from('venue_list_summary')
        .select('id, name, city, capacity, total_events, upcoming_events, recent_events, avg_ticket_price, top_genres', { count: 'exact' });

      // Search filter across name and city
      if (params.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,city.ilike.%${params.searchTerm}%`);
      }

      // City filter
      if (params.cities && params.cities.length > 0) {
        query = query.in('city', params.cities);
      }

      // Capacity range filter (handle nulls)
      if (params.capacityRange) {
        if (params.capacityRange.min !== undefined) {
          query = query.gte('capacity', params.capacityRange.min);
        }
        if (params.capacityRange.max !== undefined) {
          query = query.lte('capacity', params.capacityRange.max);
        }
      }

      // Price range filter (handle nulls)
      if (params.priceRange) {
        if (params.priceRange.min !== undefined) {
          query = query.gte('avg_ticket_price', params.priceRange.min);
        }
        if (params.priceRange.max !== undefined) {
          query = query.lte('avg_ticket_price', params.priceRange.max);
        }
      }

      // Genre filter - handle array contains
      if (params.genres && params.genres.length > 0) {
        query = query.overlaps('top_genres', params.genres);
      }

      // Filter venues with events
      if (params.hasEvents) {
        query = query.gt('total_events', 0);
      }

      // Sorting with null handling
      const sortBy = params.sortBy || 'name';
      const sortOrder = params.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false });

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching venues:', error);
        throw error;
      }

      console.log('Venues search results:', { 
        count: data?.length, 
        total: count,
        first_venue: data?.[0]?.name 
      });

      return {
        venues: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    retry: 2,
  });
};

export const useVenueFilterOptions = () => {
  return useQuery<VenueFilterOptions>({
    queryKey: ['venue-filter-options'],
    queryFn: async () => {
      console.log('Fetching venue filter options...');

      // Get venues for filter data with limit to prevent timeout
      const { data: venues, error } = await supabase
        .from('venue_list_summary')
        .select('city, capacity, avg_ticket_price, top_genres')
        .not('city', 'is', null)
        .limit(1000);

      if (error) {
        console.error('Error fetching venue filter options:', error);
        throw error;
      }

      // Extract unique cities
      const cities = [...new Set(
        venues
          ?.map(v => v.city)
          .filter(Boolean)
          .sort()
      )] as string[];

      // Extract all genres from top_genres arrays
      const genreSet = new Set<string>();
      venues?.forEach(venue => {
        if (Array.isArray(venue.top_genres)) {
          venue.top_genres.forEach(genre => {
            if (genre && genre.trim()) {
              genreSet.add(genre);
            }
          });
        }
      });
      const genres = Array.from(genreSet).sort();

      // Calculate capacity range (excluding nulls)
      const capacities = venues
        ?.map(v => v.capacity)
        .filter((c): c is number => c !== null && c !== undefined) || [];
      const minCapacity = capacities.length > 0 ? Math.min(...capacities) : 0;
      const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 50000;

      // Calculate price range (excluding nulls)
      const prices = venues
        ?.map(v => v.avg_ticket_price)
        .filter((p): p is number => p !== null && p !== undefined) || [];
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 500;

      console.log('Filter options extracted:', { 
        cities: cities.length, 
        genres: genres.length,
        capacityRange: { min: minCapacity, max: maxCapacity },
        priceRange: { min: minPrice, max: maxPrice }
      });

      return {
        cities,
        genres,
        capacityRange: { min: minCapacity, max: maxCapacity },
        priceRange: { min: minPrice, max: maxPrice }
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};