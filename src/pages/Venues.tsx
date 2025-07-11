import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Calendar, Music, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel from "@/components/shared/UniversalFilterPanel";
import type { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";
import { useVenueSearch, useVenueFilterOptions } from "@/hooks/useVenues";
import { VenueSearchParams } from "@/types/venue.types";
import { transformVenueFromDB, getPriceTier, getPriceTierVariant, formatPrice, formatCapacity } from "@/utils/venueTransformers";
import { useDebouncedCallback } from 'use-debounce';

const Venues = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchParams, setSearchParams] = useState<VenueSearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    capacityRange: [],
    cities: [],
    priceTiers: [],
    genres: [],
    activityLevel: [],
  });

  // Fetch data from backend
  const { data: searchResults, isLoading, error } = useVenueSearch(searchParams);
  const { data: filterOptions, isLoading: filterOptionsLoading } = useVenueFilterOptions();

  const rawVenues = searchResults?.venues || [];
  const pagination = searchResults?.pagination;

  // Transform raw venues to match component expectations
  const transformedVenues = rawVenues.map(transformVenueFromDB);
  
  // Apply client-side activity level filtering
  const venues = transformedVenues.filter(venue => {
    const activityLevels = filters.activityLevel as string[];
    if (activityLevels.length === 0) return true;
    
    return activityLevels.some(level => {
      switch(level) {
        case 'high': return venue.totalEvents >= 50;
        case 'medium': return venue.totalEvents >= 20 && venue.totalEvents < 50;
        case 'low': return venue.totalEvents >= 5 && venue.totalEvents < 20;
        case 'minimal': return venue.totalEvents >= 1 && venue.totalEvents < 5;
        case 'none': return venue.totalEvents === 0;
        default: return true;
      }
    });
  });

  // Debounced search to avoid excessive API calls
  const debouncedUpdateSearch = useDebouncedCallback((search: string) => {
    setSearchParams(prev => ({ ...prev, searchTerm: search, page: 1 }));
  }, 300);

  // Update search params when filters change
  useEffect(() => {
    const newParams: VenueSearchParams = {
      ...searchParams,
      cities: filters.cities.length > 0 ? filters.cities as string[] : undefined,
      genres: filters.genres.length > 0 ? filters.genres as string[] : undefined,
      page: 1
    };

    // Handle capacity range
    if (filters.capacityRange && (filters.capacityRange as number[]).length === 2) {
      newParams.capacityRange = {
        min: (filters.capacityRange as number[])[0],
        max: (filters.capacityRange as number[])[1]
      };
    }

    // Handle price tiers - convert to price range
    if (filters.priceTiers && (filters.priceTiers as string[]).length > 0) {
      const priceTiers = filters.priceTiers as string[];
      let minPrice = 0;
      let maxPrice = 1000;
      
      if (priceTiers.length === 1) {
        if (priceTiers[0] === 'budget') { minPrice = 0; maxPrice = 100; }
        else if (priceTiers[0] === 'mid') { minPrice = 100; maxPrice = 300; }
        else if (priceTiers[0] === 'premium') { minPrice = 300; maxPrice = 1000; }
      } else {
        // Multiple tiers selected - find range
        if (priceTiers.includes('budget')) minPrice = 0;
        if (priceTiers.includes('premium')) maxPrice = 1000;
      }
      
      newParams.priceRange = { min: minPrice, max: maxPrice };
    }

    setSearchParams(newParams);
  }, [filters.cities, filters.genres, filters.capacityRange, filters.priceTiers]);

  // Handle search separately
  useEffect(() => {
    debouncedUpdateSearch(filters.search as string);
  }, [filters.search]);

  // Filter sections with real data
  const filterSections: FilterSection[] = [
    {
      key: "search",
      title: "Search",
      type: "search",
      placeholder: "Search venues by name or city...",
      collapsible: false,
    },
    {
      key: "capacityRange",
      title: "Capacity",
      type: "range",
      range: {
        min: filterOptions?.capacityRange.min || 0,
        max: filterOptions?.capacityRange.max || 50000,
        step: 1000,
        formatLabel: (value) => formatCapacity(value)
      },
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "activityLevel",
      title: "Activity Level",
      type: "checkbox",
      icon: "activity",
      options: [
        { 
          value: "high", 
          label: "High Activity (50+ events)", 
          count: transformedVenues.filter(v => v.totalEvents >= 50).length 
        },
        { 
          value: "medium", 
          label: "Medium Activity (20-49 events)", 
          count: transformedVenues.filter(v => v.totalEvents >= 20 && v.totalEvents < 50).length 
        },
        { 
          value: "low", 
          label: "Low Activity (5-19 events)", 
          count: transformedVenues.filter(v => v.totalEvents >= 5 && v.totalEvents < 20).length 
        },
        { 
          value: "minimal", 
          label: "Minimal Activity (1-4 events)", 
          count: transformedVenues.filter(v => v.totalEvents >= 1 && v.totalEvents < 5).length 
        },
        { 
          value: "none", 
          label: "No Events", 
          count: transformedVenues.filter(v => v.totalEvents === 0).length 
        },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "cities",
      title: "Cities",
      type: "checkbox",
      options: (filterOptions?.cities || []).map(city => ({
        value: city,
        label: city,
        count: rawVenues.filter(v => v.city === city).length
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "priceTiers",
      title: "Price Tiers",
      type: "checkbox",
      options: [
        { 
          value: "budget", 
          label: "Budget (Under ₺100)", 
          count: rawVenues.filter(v => v.avg_ticket_price && v.avg_ticket_price < 100).length 
        },
        { 
          value: "mid", 
          label: "Mid-tier (₺100-₺300)", 
          count: rawVenues.filter(v => v.avg_ticket_price && v.avg_ticket_price >= 100 && v.avg_ticket_price <= 300).length 
        },
        { 
          value: "premium", 
          label: "Premium (Over ₺300)", 
          count: rawVenues.filter(v => v.avg_ticket_price && v.avg_ticket_price > 300).length 
        },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "genres",
      title: "Top Genres",
      type: "checkbox",
      options: (filterOptions?.genres || []).map(genre => ({
        value: genre,
        label: genre,
        count: rawVenues.filter(v => v.top_genres && v.top_genres.includes(genre)).length
      })),
      collapsible: true,
      defaultOpen: false,
    },
  ];

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="Venues" 
          subtitle="Error loading venues"
        />
        <div className="mt-8 text-center">
          <div className="text-red-600 mb-4">
            <Building2 className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Venues</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load venues data'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader 
        title="Venues" 
        subtitle={`${pagination?.total || 0} venues across Turkey`}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Filter Panel */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <UniversalFilterPanel
            sections={filterSections}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={filterOptionsLoading}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Sort Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Loading venues...'
                ) : (
                  `Showing ${venues.length} of ${pagination?.total || 0} venues`
                )}
              </p>
            </div>
            
            <select
              className="px-3 py-1 border rounded-md text-sm bg-background"
              value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setSearchParams(prev => ({
                  ...prev,
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                  page: 1
                }));
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="total_events-desc">Most Events</option>
              <option value="total_events-asc">Least Events</option>
              <option value="capacity-desc">Largest First</option>
              <option value="capacity-asc">Smallest First</option>
              <option value="avg_ticket_price-desc">Highest Price</option>
              <option value="avg_ticket_price-asc">Lowest Price</option>
            </select>
          </div>

          {/* Venue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="media-card">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : venues.length > 0 ? (
              venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No venues found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Venue Card Component
const VenueCard = ({ venue }: { venue: any }) => {
  return (
    <Link to={`/venues/${venue.id}`}>
      <Card className="media-card group hover:shadow-lg transition-all duration-200 h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {venue.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{venue.city}</span>
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              {venue.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-semibold flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formatCapacity(venue.capacity)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Ticket</p>
              <Badge variant={getPriceTierVariant(venue.avgPrice)}>
                {formatPrice(venue.avgPrice)}
              </Badge>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {venue.upcomingEvents > 0 && `${venue.upcomingEvents} upcoming • `}
              {venue.totalEvents} total events
            </span>
          </div>

          {/* Genres */}
          {venue.topGenres.length > 0 && (
            <div className="flex items-start gap-2">
              <Music className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {venue.topGenres.slice(0, 3).map((genre: string) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {venue.topGenres.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{venue.topGenres.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Activity Bar with Level Badge */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Activity</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    venue.totalEvents >= 50 ? "default" : 
                    venue.totalEvents >= 20 ? "secondary" : 
                    venue.totalEvents >= 5 ? "outline" : "secondary"
                  }
                  className="text-xs"
                >
                  {venue.totalEvents >= 50 ? "High" : 
                   venue.totalEvents >= 20 ? "Medium" : 
                   venue.totalEvents >= 5 ? "Low" : 
                   venue.totalEvents > 0 ? "Minimal" : "None"}
                </Badge>
                <span className="text-xs font-medium">{venue.totalEvents} events</span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all ${
                  venue.totalEvents >= 50 ? "bg-green-500" :
                  venue.totalEvents >= 20 ? "bg-yellow-500" :
                  venue.totalEvents >= 5 ? "bg-orange-500" :
                  venue.totalEvents > 0 ? "bg-red-500" : "bg-gray-300"
                }`}
                style={{ width: `${Math.min(venue.utilization, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Venues;