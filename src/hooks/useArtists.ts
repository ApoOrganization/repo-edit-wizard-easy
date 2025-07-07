import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ArtistSearchParams, ArtistSearchResponse, ArtistFilterOptions } from '@/types/artist.types';

export const useArtistSearch = (params: ArtistSearchParams) => {
  return useQuery<ArtistSearchResponse>({
    queryKey: ['artists-search', params],
    queryFn: async () => {
      console.log('Searching artists with params:', params);

      // Use direct Supabase query (same pattern as Events page)
      let query = supabase
        .from('artist_list_summary')
        .select('*', { count: 'exact' });

      // Apply search term across multiple fields
      if (params.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,agency.ilike.%${params.searchTerm}%,territory.ilike.%${params.searchTerm}%`);
      }

      // Apply genre filter for array field
      if (params.genres && params.genres.length > 0) {
        // Use overlaps operator for array fields - check if any selected genres exist in the artist's genres array
        query = query.overlaps('genres', params.genres);
      }

      // Apply agency filter
      if (params.agencies && params.agencies.length > 0) {
        query = query.in('agency', params.agencies);
      }

      // Apply territory filter
      if (params.territories && params.territories.length > 0) {
        query = query.in('territory', params.territories);
      }

      // Apply minimum listeners filter
      if (params.minListeners) {
        query = query.gte('monthly_listeners', params.minListeners);
      }

      // Apply sorting
      const sortBy = params.sortBy || 'monthly_listeners';
      const sortOrder = params.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }

      console.log('Artists search results:', { 
        count: data?.length, 
        total: count,
        first_artist: data?.[0]?.name 
      });

      return {
        artists: data || [],
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

export const useArtistFilterOptions = () => {
  return useQuery<ArtistFilterOptions>({
    queryKey: ['artist-filter-options'],
    queryFn: async () => {
      console.log('Fetching artist filter options...');

      const { data: artists, error } = await supabase
        .from('artist_list_summary')
        .select('agency, territory, genres');

      if (error) {
        console.error('Error fetching artist filter options:', error);
        throw error;
      }

      // Extract unique values
      const agencies = [...new Set(
        artists
          ?.map(a => a.agency)
          .filter(Boolean)
          .sort()
      )] as string[];

      const territories = [...new Set(
        artists
          ?.map(a => a.territory)
          .filter(Boolean)
          .sort()
      )] as string[];

      const genres = [...new Set(
        artists
          ?.flatMap(a => a.genres || [])
          .filter(Boolean)
          .sort()
      )] as string[];

      console.log('Filter options extracted:', { 
        agencies: agencies.length, 
        territories: territories.length, 
        genres: genres.length 
      });

      return { agencies, territories, genres };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};