import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PromoterSearchParams, PromoterSearchResponse, PromoterFilterOptions, PromoterListItem, TransformedPromoter } from "@/types/promoter.types";

// Transform database promoter to UI-friendly format
export const transformPromoterFromDB = (dbPromoter: PromoterListItem): TransformedPromoter => {
  // Calculate a rating based on performance metrics (0-5 scale)
  const calculateRating = (promoter: PromoterListItem): number => {
    let score = 0;
    
    // Event count factor (0-2 points)
    const eventScore = Math.min(promoter.total_events / 500, 1) * 2;
    score += eventScore;
    
    // Venue diversity factor (0-2 points)
    const venueScore = Math.min(promoter.venues_used / 50, 1) * 2;
    score += venueScore;
    
    // Artist diversity factor (0-1 point)
    const artistScore = Math.min(promoter.unique_artists_count / 100, 1);
    score += artistScore;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  return {
    id: dbPromoter.id,
    name: dbPromoter.name,
    city: dbPromoter.cities?.[0] || 'Unknown',
    specialty: dbPromoter.scale_tier || dbPromoter.activity_status || 'General',
    eventsCount: dbPromoter.total_events,
    upcomingEvents: dbPromoter.upcoming_events,
    venuesUsed: dbPromoter.venues_used,
    genresPromoted: dbPromoter.genres_count,
    revenue: 0, // Not available in real schema
    avgEventRevenue: 0, // Not available in real schema
    rating: calculateRating(dbPromoter)
  };
};

export const usePromoterSearch = (params: PromoterSearchParams) => {
  return useQuery<PromoterSearchResponse>({
    queryKey: ['promoters-search', params],
    queryFn: async () => {
      console.log('Searching promoters with params:', params);

      // Use direct Supabase query with correct fields from real schema
      let query = supabase
        .from('promoter_list_summary')
        .select('id, name, instagram_link, created_at, total_events, upcoming_events, past_events, recent_events, venues_used, genres_count, cities_count, cities, genres_promoted, unique_artists_count, top_artists, activity_status, scale_tier, last_event_date, next_event_date', { count: 'exact' });

      // Search filter across name and activity status
      if (params.searchTerm) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`name.ilike.%${searchTerm}%,activity_status.ilike.%${searchTerm}%,scale_tier.ilike.%${searchTerm}%`);
      }

      // City filter (searches within cities array)
      if (params.cities && params.cities.length > 0) {
        // For array columns, we need to use overlap operator
        query = query.overlaps('cities', params.cities);
      }

      // Activity Status filter
      if (params.activityStatuses && params.activityStatuses.length > 0) {
        query = query.in('activity_status', params.activityStatuses);
      }

      // Scale Tier filter
      if (params.scaleTiers && params.scaleTiers.length > 0) {
        query = query.in('scale_tier', params.scaleTiers);
      }

      // Event count range filter
      if (params.eventCountRange) {
        if (params.eventCountRange.min !== undefined) {
          query = query.gte('total_events', params.eventCountRange.min);
        }
        if (params.eventCountRange.max !== undefined) {
          query = query.lte('total_events', params.eventCountRange.max);
        }
      }

      // Venues used range filter
      if (params.venuesUsedRange) {
        if (params.venuesUsedRange.min !== undefined) {
          query = query.gte('venues_used', params.venuesUsedRange.min);
        }
        if (params.venuesUsedRange.max !== undefined) {
          query = query.lte('venues_used', params.venuesUsedRange.max);
        }
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
        console.error('Error fetching promoters:', error);
        throw error;
      }

      console.log('Promoters search results:', { 
        count: data?.length, 
        total: count,
        first_promoter: data?.[0]?.name 
      });

      return {
        promoters: data || [],
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

export const usePromoterFilterOptions = () => {
  return useQuery<PromoterFilterOptions>({
    queryKey: ['promoter-filter-options'],
    queryFn: async () => {
      console.log('Fetching promoter filter options...');

      // Get promoters for filter data with limit to prevent timeout
      const { data: promoters, error } = await supabase
        .from('promoter_list_summary')
        .select('cities, activity_status, scale_tier, total_events, venues_used')
        .not('activity_status', 'is', null)
        .limit(1000);

      if (error) {
        console.error('Error fetching promoter filter options:', error);
        throw error;
      }

      // Extract unique cities from cities arrays
      const citySet = new Set<string>();
      promoters?.forEach(promoter => {
        if (Array.isArray(promoter.cities)) {
          promoter.cities.forEach(city => {
            if (city && city.trim()) {
              citySet.add(city);
            }
          });
        }
      });
      const cities = Array.from(citySet).sort();

      // Extract unique activity statuses
      const activityStatuses = [...new Set(
        promoters
          ?.map(p => p.activity_status)
          .filter(Boolean)
          .sort()
      )] as string[];

      // Extract unique scale tiers
      const scaleTiers = [...new Set(
        promoters
          ?.map(p => p.scale_tier)
          .filter(Boolean)
          .sort()
      )] as string[];

      // Calculate event count range
      const eventCounts = promoters
        ?.map(p => p.total_events)
        .filter((c): c is number => c !== null && c !== undefined) || [];
      const minEventCount = eventCounts.length > 0 ? Math.min(...eventCounts) : 0;
      const maxEventCount = eventCounts.length > 0 ? Math.max(...eventCounts) : 1000;

      // Calculate venues used range
      const venuesUsed = promoters
        ?.map(p => p.venues_used)
        .filter((v): v is number => v !== null && v !== undefined) || [];
      const minVenuesUsed = venuesUsed.length > 0 ? Math.min(...venuesUsed) : 0;
      const maxVenuesUsed = venuesUsed.length > 0 ? Math.max(...venuesUsed) : 100;

      console.log('Filter options extracted:', { 
        cities: cities.length, 
        activityStatuses: activityStatuses.length,
        scaleTiers: scaleTiers.length,
        eventCountRange: { min: minEventCount, max: maxEventCount },
        venuesUsedRange: { min: minVenuesUsed, max: maxVenuesUsed }
      });

      return {
        cities,
        activityStatuses,
        scaleTiers,
        eventCountRange: { min: minEventCount, max: maxEventCount },
        venuesUsedRange: { min: minVenuesUsed, max: maxVenuesUsed }
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook to get transformed promoters (UI-friendly format)
export const useTransformedPromoters = (params: PromoterSearchParams) => {
  const { data, isLoading, error } = usePromoterSearch(params);
  
  const transformedData = data ? {
    promoters: data.promoters.map(transformPromoterFromDB),
    pagination: data.pagination
  } : undefined;

  return {
    data: transformedData,
    isLoading,
    error
  };
};

// Utility functions for promoter data
export const formatRevenue = (revenue: number | null): string => {
  if (!revenue || revenue === 0) return '$0';
  
  if (revenue >= 1000000) {
    return `$${(revenue / 1000000).toFixed(1)}M`;
  } else if (revenue >= 1000) {
    return `$${(revenue / 1000).toFixed(0)}K`;
  } else {
    return `$${revenue.toLocaleString()}`;
  }
};

export const getPromoterSpecialtyBadgeVariant = (specialty: string | null) => {
  if (!specialty) return 'outline';
  
  const specialtyLower = specialty.toLowerCase();
  
  // Map scale_tier and activity_status to badge variants
  if (specialtyLower.includes('large') || specialtyLower.includes('major')) return 'default';
  if (specialtyLower.includes('medium') || specialtyLower.includes('active')) return 'secondary';
  if (specialtyLower.includes('small') || specialtyLower.includes('emerging')) return 'outline';
  if (specialtyLower.includes('inactive') || specialtyLower.includes('dormant')) return 'destructive';
  
  return 'outline';
};

export const calculatePromoterPerformanceScore = (promoter: TransformedPromoter): number => {
  // Performance score based on multiple factors (0-100 scale)
  let score = 0;
  
  // Event activity (40% weight)
  const eventActivity = Math.min(promoter.eventsCount / 200, 1) * 40;
  score += eventActivity;
  
  // Revenue performance (30% weight)
  const revenuePerformance = Math.min(promoter.revenue / 5000000, 1) * 30;
  score += revenuePerformance;
  
  // Venue diversity (20% weight)
  const venueDiversity = Math.min(promoter.venuesUsed / 30, 1) * 20;
  score += venueDiversity;
  
  // Genre diversity (10% weight)
  const genreDiversity = Math.min(promoter.genresPromoted / 10, 1) * 10;
  score += genreDiversity;
  
  return Math.round(score);
};