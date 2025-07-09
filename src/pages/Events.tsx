import { useState, useEffect } from "react";
import { useEventSearch, useEventFilterOptions } from "@/hooks/useEvents";
import { EventSearchParams } from "@/types/event.types";
import { transformEventFromDB } from "@/utils/eventTransformers";
import { useDebouncedCallback } from 'use-debounce';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid2X2, List, Filter as FilterIcon } from "lucide-react";
import FilterPanel from "@/components/Events/FilterPanel";
import EventGridItem from "@/components/Events/EventGridItem";
import EventListItem from "@/components/Events/EventListItem";

interface FilterState {
  search: string;
  genres: string[];
  statuses: string[];
  cities: string[];
  venues: string[];
  artists: string[];
  promoters: string[];
  dateOrder: 'asc' | 'desc';
}

const Events = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useState<EventSearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genres: [],
    statuses: [],
    cities: [],
    venues: [],
    artists: [],
    promoters: [],
    dateOrder: 'desc',
  });

  // Fetch events from backend
  const { data: searchResults, isLoading, error } = useEventSearch(searchParams);
  const events = searchResults?.events || [];
  const pagination = searchResults?.pagination;

  // Get filter options
  const { data: filterOptions } = useEventFilterOptions();

  // Transform events for components
  const transformedEvents = events.map(transformEventFromDB);

  // Debounced search
  const debouncedUpdateSearch = useDebouncedCallback((search: string) => {
    setSearchParams(prev => ({ ...prev, searchTerm: search, page: 1 }));
  }, 300);

  // Update search params when filters change
  useEffect(() => {
    const newParams: EventSearchParams = {
      ...searchParams,
      genres: filters.genres.length > 0 ? filters.genres : undefined,
      status: filters.statuses.length > 0 ? filters.statuses : undefined,
      cities: filters.cities.length > 0 ? filters.cities : undefined,
      venues: filters.venues.length > 0 ? filters.venues : undefined,
      artists: filters.artists.length > 0 ? filters.artists : undefined,
      sortOrder: filters.dateOrder,
      page: searchParams.page, // Preserve current page
    };


    // Don't update if only search changed (handled by debounce)
    if (filters.search !== searchParams.searchTerm) {
      return;
    }

    setSearchParams(newParams);
  }, [filters.genres, filters.statuses, filters.cities, filters.venues, filters.artists, filters.dateOrder]);

  // Handle search separately with debouncing
  useEffect(() => {
    debouncedUpdateSearch(filters.search);
  }, [filters.search]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    // Reset to page 1 when filters change
    setSearchParams(prev => ({ ...prev, page: 1 }));
    setFilters(newFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  // Use real filter options
  const availableGenres = filterOptions?.genres || [];
  const availableStatuses = filterOptions?.statuses || [];
  const availableCities = filterOptions?.cities || [];
  const availableVenues = filterOptions?.venues || [];
  const availableArtists = filterOptions?.artists || [];
  const availablePromoters = []; // TODO: Will be populated when promoter integration is complete

  if (error) {
    return (
      <div className="space-y-6">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-4 font-manrope">Events</h1>
          <p className="text-sm text-red-500">Error loading events. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Keep existing */}
      <div className="flex items-center justify-between">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-manrope">Events</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{pagination?.total || 0} events found</span>
            {(filters.search || filters.genres.length > 0 || filters.statuses.length > 0 || filters.cities.length > 0 || filters.venues.length > 0 || filters.artists.length > 0) && (
              <Badge variant="secondary" className="text-xs">
                Filtered
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-xs px-3 py-2"
          >
            <Grid2X2 className="h-3 w-3 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-xs px-3 py-2"
          >
            <List className="h-3 w-3 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableGenres={availableGenres}
          availableStatuses={availableStatuses}
          availableCities={availableCities}
          availableVenues={availableVenues}
          availableArtists={availableArtists}
          availablePromoters={availablePromoters}
        />

        {/* Events Display Area */}
        <div className="flex-1 min-w-0 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading events...</p>
              </div>
            </div>
          )}

          {!isLoading && transformedEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No events found matching your filters.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  search: '',
                  genres: [],
                  statuses: [],
                  cities: [],
                  venues: [],
                  artists: [],
                  promoters: [],
                  dateOrder: 'desc',
                })}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformedEvents.map((event) => (
                    <EventGridItem key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transformedEvents.map((event) => (
                    <EventListItem key={event.id} event={event} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;