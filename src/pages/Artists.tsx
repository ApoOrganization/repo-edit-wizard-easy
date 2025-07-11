import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, User, Music, Globe, Loader2, Calendar, Star } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel, { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";
import { useArtistsList, useArtistFilterOptions } from "@/hooks/useArtists";
import { ArtistSearchParams } from "@/types/artist.types";
import { transformArtistFromDB } from "@/utils/artistTransformers";
import { useDebouncedCallback } from 'use-debounce';

const Artists = () => {
  const [activeTab, setActiveTab] = useState("internal");
  const [searchParams, setSearchParams] = useState({
    searchQuery: '',
    page: 1,
    pageSize: 20,
    agencyFilter: '',
    minEvents: null as number | null,
    promoterFilter: ''
  });
  
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    agencies: [],
    territories: [],
    activityLevels: [],
    hasPromoter: []
  });

  // Fetch data from backend with filters
  const { data: searchResults, isLoading, error } = useArtistsList(searchParams);
  const { data: filterOptions, isLoading: filterOptionsLoading } = useArtistFilterOptions();
  
  const rawArtists = searchResults?.artists || [];
  const totalCount = searchResults?.totalCount || 0;
  const pagination = {
    page: searchParams.page,
    limit: searchParams.pageSize,
    total: totalCount,
    totalPages: Math.ceil(totalCount / searchParams.pageSize)
  };

  // Transform raw artists to match component expectations
  const artists = rawArtists.map(transformArtistFromDB);
  
  // Debug logging
  console.log('🎭 Artists from backend:', { 
    count: artists.length, 
    total: totalCount,
    searchParams,
    filters 
  });

  // Debounced search to avoid excessive API calls
  const debouncedUpdateSearch = useDebouncedCallback((search: string) => {
    setSearchParams(prev => ({ ...prev, searchQuery: search, page: 1 }));
  }, 300);

  // Convert filter state to API parameters
  const convertFiltersToParams = (currentFilters: UniversalFilterState) => {
    // Agency filter - handle special "No Agency / Local Artists" case
    const selectedAgencies = currentFilters.agencies as string[];
    let agencyFilter = '';
    
    if (selectedAgencies?.length > 0) {
      const hasNoAgency = selectedAgencies.includes('No Agency / Local Artists');
      const regularAgencies = selectedAgencies.filter(agency => agency !== 'No Agency / Local Artists');
      
      if (hasNoAgency && regularAgencies.length > 0) {
        // Both null agencies and regular agencies selected
        agencyFilter = `NULL|${regularAgencies.join('|')}`;
      } else if (hasNoAgency) {
        // Only null agencies selected
        agencyFilter = 'NULL';
      } else {
        // Only regular agencies selected
        agencyFilter = regularAgencies.join('|');
      }
    }
    
    // Activity level filter - convert to minEvents
    const activityLevels = currentFilters.activityLevels as string[];
    let minEvents: number | null = null;
    if (activityLevels.length > 0) {
      // Use the lowest threshold from selected activity levels
      const thresholds = activityLevels.map(level => {
        switch(level) {
          case 'very_active': return 50;
          case 'active': return 20;
          case 'moderate': return 5;
          case 'emerging': return 1;
          case 'no_events': return 0;
          default: return null;
        }
      }).filter(t => t !== null);
      minEvents = thresholds.length > 0 ? Math.min(...thresholds) : null;
    }
    
    // Promoter filter - convert has/no promoter to search logic
    const hasPromoterFilter = currentFilters.hasPromoter as string[];
    let promoterFilter = '';
    if (hasPromoterFilter.includes('has_promoter') && !hasPromoterFilter.includes('no_promoter')) {
      promoterFilter = '%'; // Search for any non-null promoter
    } else if (hasPromoterFilter.includes('no_promoter') && !hasPromoterFilter.includes('has_promoter')) {
      promoterFilter = 'NULL'; // Special case for null promoters
    }
    
    return {
      searchQuery: currentFilters.search as string || '',
      agencyFilter,
      minEvents,
      promoterFilter
    };
  };

  // Debounced filter updates
  const debouncedUpdateFilters = useDebouncedCallback((newFilters: UniversalFilterState) => {
    const apiParams = convertFiltersToParams(newFilters);
    setSearchParams(prev => ({ 
      ...prev, 
      ...apiParams,
      page: 1 // Reset to first page when filters change
    }));
  }, 300);

  // Update search params when filters change
  useEffect(() => {
    debouncedUpdateFilters(filters);
  }, [filters, debouncedUpdateFilters]);

  // Format numbers helper
  const formatNumber = (num: number | null) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Update filter sections with real data
  const filterSections: FilterSection[] = [
    {
      key: "search",
      title: "Search",
      type: "search",
      placeholder: "Search artists, agencies, territories...",
      icon: "search",
      collapsible: false,
    },
    {
      key: "activityLevels",
      title: "Activity Level",
      type: "checkbox",
      icon: "users",
      options: [
        { value: "very_active", label: "Very Active (50+ events)" },
        { value: "active", label: "Active (20-49 events)" },
        { value: "moderate", label: "Moderate (5-19 events)" },
        { value: "emerging", label: "Emerging (1-4 events)" },
        { value: "no_events", label: "No Events" },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "hasPromoter",
      title: "Promoter Status",
      type: "checkbox",
      icon: "users",
      options: [
        { value: "has_promoter", label: "Has Favourite Promoter" },
        { value: "no_promoter", label: "No Favourite Promoter" },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "agencies",
      title: "Agencies",
      type: "checkbox",
      icon: "building",
      options: (filterOptions?.agencies || []).map(agency => ({
        value: agency,
        label: agency
      })),
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "territories",
      title: "Territories",
      type: "checkbox",
      icon: "globe",
      options: (filterOptions?.territories || []).map(territory => ({
        value: territory,
        label: territory
      })),
      collapsible: true,
      defaultOpen: false,
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="Artists" 
          subtitle="Discover and connect with talented artists worldwide"
        />
        <div className="mt-8 text-center">
          <div className="text-red-600 mb-4">
            <User className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Artists</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load artists data'}
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
        title="Artists" 
        subtitle="Discover and connect with talented artists worldwide"
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
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("internal")}
              className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
                activeTab === "internal"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Internal Artists
            </button>
            <button
              onClick={() => setActiveTab("external")}
              className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
                activeTab === "external"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              External Database
            </button>
          </div>

          {/* Results Count and Loading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Loading artists...'
                ) : (
                  `Showing ${artists.length} of ${totalCount} artists`
                )}
              </p>
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, searchParams.page - 1))}
                  disabled={searchParams.page <= 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {searchParams.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, searchParams.page + 1))}
                  disabled={searchParams.page >= pagination.totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Artists Grid */}
          {activeTab === "internal" && (
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
              ) : artists.length > 0 ? (
                artists.map((artist) => (
                  <Card key={artist.id} className="media-card group hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            <Link to={`/artists/${artist.id}`} className="hover:underline">
                              {artist.name}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {artist.agency && (
                              <Badge variant="outline" className="text-xs">
                                {artist.agency}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Artist
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {artist.eventCount !== null && artist.eventCount > 0 
                              ? `${artist.eventCount} event${artist.eventCount !== 1 ? 's' : ''}`
                              : 'No events'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {artist.favouritePromoter || 'No promoter history'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t border-border">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/artists/${artist.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No artists found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "external" && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">External Database</h3>
              <p className="text-muted-foreground">
                External artist database integration coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artists;