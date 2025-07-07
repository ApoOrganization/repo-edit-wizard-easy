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
    
    // Revenue factor (0-2 points)
    const revenueScore = promoter.total_revenue ? Math.min(promoter.total_revenue / 10000000, 1) * 2 : 0;
    score += revenueScore;
    
    // Venue diversity factor (0-1 point)
    const venueScore = Math.min(promoter.venues_used / 50, 1);
    score += venueScore;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  return {
    id: dbPromoter.id,
    name: dbPromoter.name,
    city: dbPromoter.city || 'Unknown',
    specialty: dbPromoter.specialty || 'General',
    eventsCount: dbPromoter.total_events,
    upcomingEvents: dbPromoter.upcoming_events,
    venuesUsed: dbPromoter.venues_used,
    genresPromoted: dbPromoter.genres_promoted,
    revenue: dbPromoter.total_revenue || 0,
    avgEventRevenue: dbPromoter.avg_event_revenue || 0,
    rating: calculateRating(dbPromoter)
  };
};

export const usePromoterSearch = (params: PromoterSearchParams) => {
  return useQuery<PromoterSearchResponse>({
    queryKey: ['promoters-search', params],
    queryFn: async () => {
      console.log('Searching promoters with params:', params);

      // Use direct Supabase query with specific fields to improve performance
      let query = supabase
        .from('promoter_list_summary')
        .select('id, name, normalized_name, city, specialty, total_events, upcoming_events, venues_used, genres_promoted, total_revenue, avg_event_revenue', { count: 'exact' });

      // Search filter across name, city, and specialty
      if (params.searchTerm) {
        const searchTerm = params.searchTerm.trim();
        query = query.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`);
      }

      // City filter
      if (params.cities && params.cities.length > 0) {
        query = query.in('city', params.cities);
      }

      // Specialty filter
      if (params.specialties && params.specialties.length > 0) {
        query = query.in('specialty', params.specialties);
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

      // Revenue range filter (handle nulls)
      if (params.revenueRange) {
        if (params.revenueRange.min !== undefined) {
          query = query.gte('total_revenue', params.revenueRange.min);
        }
        if (params.revenueRange.max !== undefined) {
          query = query.lte('total_revenue', params.revenueRange.max);
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
        .select('city, specialty, total_events, total_revenue')
        .not('city', 'is', null)
        .limit(1000);

      if (error) {
        console.error('Error fetching promoter filter options:', error);
        throw error;
      }

      // Extract unique cities
      const cities = [...new Set(
        promoters
          ?.map(p => p.city)
          .filter(Boolean)
          .sort()
      )] as string[];

      // Extract unique specialties
      const specialties = [...new Set(
        promoters
          ?.map(p => p.specialty)
          .filter(Boolean)
          .sort()
      )] as string[];

      // Calculate event count range
      const eventCounts = promoters
        ?.map(p => p.total_events)
        .filter((c): c is number => c !== null && c !== undefined) || [];
      const minEventCount = eventCounts.length > 0 ? Math.min(...eventCounts) : 0;
      const maxEventCount = eventCounts.length > 0 ? Math.max(...eventCounts) : 1000;

      // Calculate revenue range (excluding nulls)
      const revenues = promoters
        ?.map(p => p.total_revenue)
        .filter((r): r is number => r !== null && r !== undefined) || [];
      const minRevenue = revenues.length > 0 ? Math.min(...revenues) : 0;
      const maxRevenue = revenues.length > 0 ? Math.max(...revenues) : 50000000;

      console.log('Filter options extracted:', { 
        cities: cities.length, 
        specialties: specialties.length,
        eventCountRange: { min: minEventCount, max: maxEventCount },
        revenueRange: { min: minRevenue, max: maxRevenue }
      });

      return {
        cities,
        specialties,
        eventCountRange: { min: minEventCount, max: maxEventCount },
        revenueRange: { min: minRevenue, max: maxRevenue }
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
  
  if (specialtyLower.includes('festival')) return 'default';
  if (specialtyLower.includes('tour')) return 'secondary';
  if (specialtyLower.includes('concert')) return 'outline';
  if (specialtyLower.includes('club')) return 'destructive';
  
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