import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mockArtists } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Music, User } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel, { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";

const Artists = () => {
  const [activeTab, setActiveTab] = useState("internal");
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    genres: [],
    agencies: [],
    territories: [],
  });

  const { data: artists, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockArtists;
    },
  });

  const agencies = [...new Set(artists?.map(artist => artist.agency) || [])];
  const genres = [...new Set(artists?.map(artist => artist.genre) || [])];
  const territories = [...new Set(artists?.map(artist => artist.territory) || [])];
  
  const filteredArtists = artists?.filter(artist => {
    const searchValue = (filters.search as string) || '';
    const matchesSearch = searchValue === '' || 
                         artist.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         artist.agency.toLowerCase().includes(searchValue.toLowerCase()) ||
                         artist.territory.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesGenre = (filters.genres as string[]).length === 0 || 
                        (filters.genres as string[]).includes(artist.genre);
    
    const matchesAgency = (filters.agencies as string[]).length === 0 || 
                         (filters.agencies as string[]).includes(artist.agency);
    
    const matchesTerritory = (filters.territories as string[]).length === 0 || 
                            (filters.territories as string[]).includes(artist.territory);
    
    return matchesSearch && matchesGenre && matchesAgency && matchesTerritory;
  });

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
      options: genres.map(genre => ({
        value: genre,
        label: genre,
        count: artists?.filter(a => a.genre === genre).length || 0,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "agencies",
      title: "Agencies",
      type: "checkbox",
      icon: "building",
      options: agencies.map(agency => ({
        value: agency,
        label: agency,
        count: artists?.filter(a => a.agency === agency).length || 0,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "territories",
      title: "Territories",
      type: "checkbox",
      icon: "location",
      options: territories.map(territory => ({
        value: territory,
        label: territory,
        count: artists?.filter(a => a.territory === territory).length || 0,
      })),
      collapsible: true,
      defaultOpen: false,
    },
  ];

  const activeFiltersCount = (filters.search ? 1 : 0) +
                            (filters.genres as string[]).length + 
                            (filters.agencies as string[]).length + 
                            (filters.territories as string[]).length;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const clearFilters = () => {
    setFilters({ search: '', genres: [], agencies: [], territories: [] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Artists" 
          subtitle="Loading artists..." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <PageHeader 
        title="Artists" 
        subtitle="Comprehensive artist database with agency relationships and performance metrics" 
      />

      {/* Tab Navigation */}
      <div className="px-8 py-6 border-b border-border">
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'internal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('internal')}
            className="rounded-full px-4"
          >
            <Users className="h-4 w-4 mr-2" />
            Internal Artists
          </Button>
          <Button 
            variant={activeTab === 'agencies' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('agencies')}
            className="rounded-full px-4"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Agencies
          </Button>
          <Button 
            variant={activeTab === 'spotify' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('spotify')}
            className="rounded-full px-4"
          >
            <Music className="h-4 w-4 mr-2" />
            Spotify View
          </Button>
        </div>
      </div>

      <div className="flex">
        {activeTab === 'internal' && (
          <div className="px-8 py-6">
            <UniversalFilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              sections={filterSections}
            />
          </div>
        )}
        
        <div className="flex-1 px-8 py-6">
          {activeTab === 'internal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredArtists?.length || 0} artists found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredArtists?.map((artist) => (
                  <Link key={artist.id} to={`/artists/${artist.id}`}>
                    <Card className="media-card hover-lift cursor-pointer transition-all duration-200 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="text-xs w-fit">{artist.genre}</Badge>
                        <CardTitle className="text-sm font-bold">{artist.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{artist.territory}</p>
                      </CardHeader>
                      
                      <CardContent className="pt-0 space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Agency</span>
                            <span className="font-medium">{artist.agent}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Monthly Listeners</span>
                            <span className="font-medium">{formatNumber(artist.monthlyListeners)}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-3 w-3 mr-2" />
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'agencies' && (
            <div className="space-y-6">
              {agencies.map(agency => {
                const agencyArtists = artists?.filter(a => a.agency === agency) || [];
                return (
                  <Card key={agency} className="media-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {agency}
                        <Badge variant="outline">{agencyArtists.length} artists</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agencyArtists.slice(0, 6).map(artist => (
                          <Link key={artist.id} to={`/artists/${artist.id}`}>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                              <div className="flex-1">
                                <p className="font-semibold text-sm hover:text-primary">{artist.name}</p>
                                <p className="text-xs text-muted-foreground">{formatNumber(artist.monthlyListeners)} listeners</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {agencyArtists.length > 6 && (
                        <Button variant="outline" className="w-full mt-4">
                          Show {agencyArtists.length - 6} more artists
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'spotify' && (
            <div className="space-y-6">
              <Card className="media-card">
                <CardHeader>
                  <CardTitle>Spotify Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 font-manrope">
                        {formatNumber(artists?.reduce((sum, artist) => sum + artist.monthlyListeners, 0) || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Monthly Listeners</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 font-manrope">
                        {formatNumber(artists?.reduce((sum, artist) => sum + artist.followers, 0) || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600 font-manrope">
                        {artists?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Artists Tracked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600 font-manrope">
                        {agencies.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Agencies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artists;
