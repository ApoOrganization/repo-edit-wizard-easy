import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ArtistSearchParams, ArtistFilterOptions, ArtistListItem, SearchArtistsResponse } from '@/types/artist.types';

// Artists list using new Edge Function with backend filtering
export const useArtistsList = (params: { 
  searchQuery?: string; 
  page?: number; 
  pageSize?: number; 
  agencyFilter?: string | null;
  minEvents?: number | null;
  promoterFilter?: string;
}) => {
  return useQuery<{ artists: ArtistListItem[]; totalCount: number; pagination: any }>({
    queryKey: ['artists-list', params],
    queryFn: async () => {
      console.log('Fetching artists list with params:', params);

      const { data, error } = await supabase.functions.invoke('get-artists-list', {
        body: {
          searchQuery: params.searchQuery || null,
          page: params.page || 1,
          pageSize: params.pageSize || 50,
          agencyFilter: params.agencyFilter || null,
          minEvents: params.minEvents || null,
          promoterFilter: params.promoterFilter || null
        }
      });

      if (error) {
        console.error('Error fetching artists list:', error);
        throw new Error(`Failed to fetch artists: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data.error || 'Invalid response format from artists list API');
      }

      if (!data.artists || !Array.isArray(data.artists)) {
        throw new Error('Artists array not found in response');
      }

      const artists = data.artists.map((item: any) => ({
        id: item.id,
        name: item.name,
        eventCount: item.eventCount || 0,
        favouritePromoter: item.favouritePromoter || null,
        agency: item.agency || null
      }));

      console.log('Artists list results:', { 
        count: artists.length, 
        total: data.pagination?.totalCount || 0,
        first_artist: artists[0]?.name,
        filters_applied: {
          searchQuery: params.searchQuery,
          agencyFilter: params.agencyFilter,
          minEvents: params.minEvents,
          promoterFilter: params.promoterFilter
        }
      });

      return {
        artists,
        totalCount: data.pagination?.totalCount || 0,
        pagination: data.pagination
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
      console.log('Using static artist filter options...');

      // Static agency list as provided by user
      const agencies = [
        'Marshall Arts',
        'ITB',
        '13 Artists', 
        'Red Light Management',
        'Primariy Talent',
        'Cobra Agency',
        'Wasserman',
        'WME',
        'High Road Touring',
        'United Talent Agency',
        'Onefiinix'
      ];

      // Still fetch territories dynamically if needed
      const { data: artists, error } = await supabase
        .from('artist_list_summary')
        .select('territory')
        .not('territory', 'is', null)
        .limit(500);

      let territories: string[] = [];
      if (!error && artists) {
        territories = [...new Set(
          artists
            .map(a => a.territory)
            .filter(Boolean)
            .sort()
        )] as string[];
      }

      console.log('Filter options:', { 
        agencies: agencies.length, 
        territories: territories.length
      });

      return { agencies, territories };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};