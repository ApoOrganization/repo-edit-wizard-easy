
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockData";
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
  promoters: string[];
  dateRange: string;
  revenueRange: string;
  capacityRange: string;
}

const Events = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genres: [],
    statuses: [],
    cities: [],
    promoters: [],
    dateRange: '',
    revenueRange: '',
    capacityRange: '',
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEvents;
    },
  });

  // Advanced filtering logic
  const filteredEvents = events?.filter(event => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = event.name.toLowerCase().includes(searchLower) ||
                           event.city.toLowerCase().includes(searchLower) ||
                           event.venue.toLowerCase().includes(searchLower) ||
                           event.artists.some(artist => artist.name.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Genre filter
    if (filters.genres.length > 0 && !filters.genres.includes(event.genre)) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(event.status)) {
      return false;
    }

    // City filter
    if (filters.cities.length > 0 && !filters.cities.includes(event.city)) {
      return false;
    }

    // Promoter filter
    if (filters.promoters.length > 0 && !filters.promoters.includes(event.promoter)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const eventDate = new Date(event.date);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (eventDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (eventDate < weekAgo || eventDate > now) return false;
          break;
        case 'month':
          if (eventDate.getMonth() !== now.getMonth() || eventDate.getFullYear() !== now.getFullYear()) return false;
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          const eventQuarter = Math.floor(eventDate.getMonth() / 3);
          if (eventQuarter !== quarter || eventDate.getFullYear() !== now.getFullYear()) return false;
          break;
      }
    }

    // Revenue range filter
    if (filters.revenueRange) {
      switch (filters.revenueRange) {
        case '0-100k':
          if (event.revenue > 100000) return false;
          break;
        case '100k-500k':
          if (event.revenue < 100000 || event.revenue > 500000) return false;
          break;
        case '500k-1m':
          if (event.revenue < 500000 || event.revenue > 1000000) return false;
          break;
        case '1m+':
          if (event.revenue < 1000000) return false;
          break;
      }
    }

    // Capacity range filter
    if (filters.capacityRange) {
      switch (filters.capacityRange) {
        case '0-1k':
          if (event.capacity > 1000) return false;
          break;
        case '1k-5k':
          if (event.capacity < 1000 || event.capacity > 5000) return false;
          break;
        case '5k-10k':
          if (event.capacity < 5000 || event.capacity > 10000) return false;
          break;
        case '10k+':
          if (event.capacity < 10000) return false;
          break;
      }
    }

    return true;
  });

  // Extract unique values for filter options
  const availableGenres = [...new Set(events?.map(event => event.genre) || [])];
  const availableStatuses = [...new Set(events?.map(event => event.status) || [])];
  const availableCities = [...new Set(events?.map(event => event.city) || [])];
  const availablePromoters = [...new Set(events?.map(event => event.promoter) || [])];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-4 font-manrope">Events</h1>
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-manrope">Events</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{filteredEvents?.length || 0} events found</span>
            {(filters.search || filters.genres.length > 0 || filters.statuses.length > 0) && (
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
          onFiltersChange={setFilters}
          availableGenres={availableGenres}
          availableStatuses={availableStatuses}
          availableCities={availableCities}
          availablePromoters={availablePromoters}
        />

        {/* Events Display Area */}
        <div className="flex-1 min-w-0">
          {filteredEvents?.length === 0 ? (
            <Card className="media-card">
              <CardContent className="py-12 text-center">
                <FilterIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search criteria or filters.</p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents?.map((event) => (
                <EventGridItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents?.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
