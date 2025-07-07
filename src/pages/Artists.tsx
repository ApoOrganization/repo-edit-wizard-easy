import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, User, Music, Globe, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel, { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";
import { useArtistSearch, useArtistFilterOptions } from "@/hooks/useArtists";
import { ArtistSearchParams } from "@/types/artist.types";
import { transformArtistFromDB } from "@/utils/artistTransformers";
import { useDebouncedCallback } from 'use-debounce';

const Artists = () => {
  const [activeTab, setActiveTab] = useState("internal");
  const [searchParams, setSearchParams] = useState<ArtistSearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'monthly_listeners',
    sortOrder: 'desc'
  });
  
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    genres: [],
    agencies: [],
    territories: [],
  });

  // Fetch data from backend
  const { data: searchResults, isLoading, error } = useArtistSearch(searchParams);
  const { data: filterOptions, isLoading: filterOptionsLoading } = useArtistFilterOptions();
  
  const rawArtists = searchResults?.artists || [];
  const pagination = searchResults?.pagination;

  // Transform raw artists to match component expectations
  const artists = rawArtists.map(transformArtistFromDB);

  // Debounced search to avoid excessive API calls
  const debouncedUpdateSearch = useDebouncedCallback((search: string) => {
    setSearchParams(prev => ({ ...prev, searchTerm: search, page: 1 }));
  }, 300);

  // Update search params when filters change
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      genres: filters.genres as string[],
      agencies: filters.agencies as string[],
      territories: filters.territories as string[],
      page: 1
    }));
  }, [filters.genres, filters.agencies, filters.territories]);

  useEffect(() => {
    debouncedUpdateSearch(filters.search as string);
  }, [filters.search]);

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
      collapsible: false,
    },
    {
      key: "genres",
      title: "Genres",
      type: "checkbox",
      icon: "music",
      options: (filterOptions?.genres || []).map(genre => ({
        value: genre,
        label: genre,
        count: rawArtists.filter(a => a.genres?.includes(genre)).length,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "agencies",
      title: "Agencies",
      type: "checkbox",
      icon: "building",
      options: (filterOptions?.agencies || []).map(agency => ({
        value: agency,
        label: agency,
        count: rawArtists.filter(a => a.agency === agency).length,
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
        label: territory,
        count: rawArtists.filter(a => a.territory === territory).length,
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
                  `Showing ${artists.length} of ${pagination?.total || 0} artists`
                )}
              </p>
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
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
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            <Link to={`/artists/${artist.id}`} className="hover:underline">
                              {artist.name}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{artist.agency}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {artist.genre}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{formatNumber(artist.monthlyListeners)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{formatNumber(artist.followers)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{artist.territory}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{artist.agent}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Top Cities</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.topCities.slice(0, 3).map((city, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {city}
                            </Badge>
                          ))}
                          {artist.topCities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{artist.topCities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="p-2" asChild>
                            <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                              🎵
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" className="p-2" asChild>
                            <a href={`mailto:${artist.email}`}>
                              ✉️
                            </a>
                          </Button>
                        </div>
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