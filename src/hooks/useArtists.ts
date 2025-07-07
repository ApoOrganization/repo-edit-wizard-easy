import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ArtistSearchParams, ArtistFilterOptions, ArtistListItem, SearchArtistsResponse } from '@/types/artist.types';

// Simple artists list using Edge Function
export const useArtistsList = (params: { searchQuery?: string; page?: number; pageSize?: number }) => {
  return useQuery<{ artists: ArtistListItem[]; totalCount: number }>({
    queryKey: ['artists-list', params],
    queryFn: async () => {
      console.log('Fetching artists list with params:', params);

      const { data, error } = await supabase.functions.invoke('get-artists-list', {
        body: {
          searchQuery: params.searchQuery || '',
          page: params.page || 1,
          pageSize: params.pageSize || 50
        }
      });

      if (error) {
        console.error('Error fetching artists list:', error);
        throw new Error(`Failed to fetch artists: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error('Invalid response format from artists list API');
      }

      if (!data.artists || !Array.isArray(data.artists)) {
        throw new Error('Artists array not found in response');
      }

      const totalCount = data.pagination?.totalCount || 0;
      const artists = data.artists.map((item: any) => ({
        id: item.id,
        name: item.name
      }));

      console.log('Artists list results:', { 
        count: artists.length, 
        total: totalCount,
        first_artist: artists[0]?.name 
      });

      return {
        artists,
        totalCount
      };
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    retry: 2,
  });
};

// Search artists using Edge Function
export const useArtistSearch = (params: ArtistSearchParams) => {
  return useQuery<SearchArtistsResponse>({
    queryKey: ['artists-search', params],
    queryFn: async () => {
      console.log('Searching artists with params:', params);

      const { data, error } = await supabase.functions.invoke('search-artists', {
        body: {
          search_term: params.searchTerm || null,
          min_events: params.minListeners || null,
          has_upcoming_events: null,
          page: params.page || 1,
          page_size: params.limit || 50
        }
      });

      if (error) {
        console.error('Error searching artists:', error);
        throw new Error(`Failed to search artists: ${error.message}`);
      }

      if (!data || !data.artists || !Array.isArray(data.artists)) {
        throw new Error('Invalid response format from artists search API');
      }

      console.log('Artists search results:', { 
        count: data.artists.length, 
        total: data.pagination?.total_count || 0,
        first_artist: data.artists[0]?.name 
      });

      return data;
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

      // Use correct column names based on actual schema with aggressive limiting
      const { data: artists, error } = await supabase
        .from('artist_list_summary')
        .select('agency, territory, top_genres')
        .not('agency', 'is', null)
        .not('territory', 'is', null)
        .limit(500); // Reduced limit to prevent timeout

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

      console.log('Filter options extracted:', { 
        agencies: agencies.length, 
        territories: territories.length
      });

      return { agencies, territories };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};