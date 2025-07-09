import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronDown, ChevronUp, X, Calendar, MapPin, Users, Music, Filter } from "lucide-react";

interface FilterState {
  search: string;
  genres: string[];
  statuses: string[];
  cities: string[];
  venues: string[];
  artists: string[];
  promoters: string[];
  providers: string[];
  dateOrder: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableGenres: string[];
  availableStatuses: string[];
  availableCities: string[];
  availableVenues: string[];
  availableArtists: string[];
  availablePromoters: string[];
  availableProviders: string[];
}

const FilterPanel = ({
  filters,
  onFiltersChange,
  availableGenres,
  availableStatuses,
  availableCities,
  availableVenues,
  availableArtists,
  availablePromoters,
  availableProviders,
}: FilterPanelProps) => {
  const [openSections, setOpenSections] = useState({
    basic: true,
    genre: true,
    status: true,
    city: false,
    venue: false,
    artist: false,
    promoter: false,
    provider: false,
  });

  // Search states for each filter section
  const [sectionSearches, setSectionSearches] = useState({
    genre: '',
    status: '',
    cities: '',
    venues: '',
    artists: '',
    promoters: '',
    providers: '',
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const updateSectionSearch = (section: keyof typeof sectionSearches, value: string) => {
    setSectionSearches(prev => ({ ...prev, [section]: value }));
  };

  const toggleArrayFilter = (key: keyof Pick<FilterState, 'genres' | 'statuses' | 'cities' | 'venues' | 'artists' | 'promoters' | 'providers'>, value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      genres: [],
      statuses: [],
      cities: [],
      venues: [],
      artists: [],
      promoters: [],
      providers: [],
      dateOrder: 'desc',
    });
    // Clear section searches too
    setSectionSearches({
      genre: '',
      status: '',
      cities: '',
      venues: '',
      artists: '',
      promoters: '',
      providers: '',
    });
  };

  const getActiveFilterCount = () => {
    return (
      (filters.search ? 1 : 0) +
      filters.genres.length +
      filters.statuses.length +
      filters.cities.length +
      filters.venues.length +
      filters.artists.length +
      filters.promoters.length +
      filters.providers.length +
      (filters.dateOrder !== 'desc' ? 1 : 0)
    );
  };

  // Filter functions for each section
  const getFilteredGenres = () => {
    return availableGenres.filter(genre => 
      genre.toLowerCase().includes(sectionSearches.genre.toLowerCase())
    );
  };

  const getFilteredStatuses = () => {
    return availableStatuses.filter(status => 
      status.toLowerCase().includes(sectionSearches.status.toLowerCase())
    );
  };

  const getFilteredCities = () => {
    return availableCities.filter(city => 
      city.toLowerCase().includes(sectionSearches.cities.toLowerCase())
    );
  };

  const getFilteredVenues = () => {
    return availableVenues.filter(venue => 
      venue.toLowerCase().includes(sectionSearches.venues.toLowerCase())
    );
  };

  const getFilteredArtists = () => {
    return availableArtists.filter(artist => 
      artist.toLowerCase().includes(sectionSearches.artists.toLowerCase())
    );
  };

  const getFilteredPromoters = () => {
    return availablePromoters.filter(promoter => 
      promoter.toLowerCase().includes(sectionSearches.promoters.toLowerCase())
    );
  };

  const getFilteredProviders = () => {
    return availableProviders.filter(provider => 
      provider.toLowerCase().includes(sectionSearches.providers.toLowerCase())
    );
  };

  return (
    <div className="w-80 flex-shrink-0 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-xs px-2 py-1 h-6"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Date Order Control */}
      <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sort by Date</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateFilters({ dateOrder: filters.dateOrder === 'desc' ? 'asc' : 'desc' })}
          className="flex items-center space-x-1 h-7 px-2 text-xs hover:bg-background"
        >
          <span className="font-medium">{filters.dateOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          {filters.dateOrder === 'desc' ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Basic Search */}
      <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium text-sm">Search</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.basic ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events, venues, or cities..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Genre Filter */}
      <Collapsible open={openSections.genre} onOpenChange={() => toggleSection('genre')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium text-sm">Genre</span>
            <div className="flex items-center space-x-2">
              {filters.genres.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.genres.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.genre ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {availableGenres.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                placeholder="Search genres..."
                value={sectionSearches.genre}
                onChange={(e) => updateSectionSearch('genre', e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
          )}
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-3">
              {getFilteredGenres().map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={() => toggleArrayFilter('genres', genre)}
                  />
                  <label htmlFor={`genre-${genre}`} className="text-sm">{genre}</label>
                </div>
              ))}
              {getFilteredGenres().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No genres found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Status Filter */}
      <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium text-sm">Status</span>
            <div className="flex items-center space-x-2">
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.statuses.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {getFilteredStatuses().map(status => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.statuses.includes(status)}
                onCheckedChange={() => toggleArrayFilter('statuses', status)}
              />
              <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* City Filter */}
      <Collapsible open={openSections.city} onOpenChange={() => toggleSection('city')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span className="font-medium text-sm">City</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.cities.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.cities.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.city ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              placeholder="Search cities..."
              value={sectionSearches.cities}
              onChange={(e) => updateSectionSearch('cities', e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>
          <ScrollArea className="h-40">
            <div className="space-y-2 pr-3">
              {getFilteredCities().map(city => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={`city-${city}`}
                    checked={filters.cities.includes(city)}
                    onCheckedChange={() => toggleArrayFilter('cities', city)}
                  />
                  <label htmlFor={`city-${city}`} className="text-sm">{city}</label>
                </div>
              ))}
              {getFilteredCities().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No cities found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Venue Filter */}
      <Collapsible open={openSections.venue} onOpenChange={() => toggleSection('venue')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span className="font-medium text-sm">Venue</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.venues.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.venues.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.venue ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              placeholder="Search venues..."
              value={sectionSearches.venues}
              onChange={(e) => updateSectionSearch('venues', e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>
          <ScrollArea className="h-40">
            <div className="space-y-2 pr-3">
              {getFilteredVenues().map(venue => (
                <div key={venue} className="flex items-center space-x-2">
                  <Checkbox
                    id={`venue-${venue}`}
                    checked={filters.venues.includes(venue)}
                    onCheckedChange={() => toggleArrayFilter('venues', venue)}
                  />
                  <label htmlFor={`venue-${venue}`} className="text-sm">{venue}</label>
                </div>
              ))}
              {getFilteredVenues().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No venues found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Promoter Filter */}
      <Collapsible open={openSections.promoter} onOpenChange={() => toggleSection('promoter')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3" />
              <span className="font-medium text-sm">Promoter</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.promoters.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.promoters.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.promoter ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {availablePromoters.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                placeholder="Search promoters..."
                value={sectionSearches.promoters}
                onChange={(e) => updateSectionSearch('promoters', e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
          )}
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-3">
              {getFilteredPromoters().map(promoter => (
                <div key={promoter} className="flex items-center space-x-2">
                  <Checkbox
                    id={`promoter-${promoter}`}
                    checked={filters.promoters.includes(promoter)}
                    onCheckedChange={() => toggleArrayFilter('promoters', promoter)}
                  />
                  <label htmlFor={`promoter-${promoter}`} className="text-sm text-left">{promoter}</label>
                </div>
              ))}
              {getFilteredPromoters().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No promoters found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Provider Filter */}
      <Collapsible open={openSections.provider} onOpenChange={() => toggleSection('provider')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Music className="h-3 w-3" />
              <span className="font-medium text-sm">Ticketing Provider</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.providers.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.providers.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.provider ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {availableProviders.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                placeholder="Search providers..."
                value={sectionSearches.providers}
                onChange={(e) => updateSectionSearch('providers', e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
          )}
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-3">
              {getFilteredProviders().map(provider => (
                <div key={provider} className="flex items-center space-x-2">
                  <Checkbox
                    id={`provider-${provider}`}
                    checked={filters.providers.includes(provider)}
                    onCheckedChange={() => toggleArrayFilter('providers', provider)}
                  />
                  <label htmlFor={`provider-${provider}`} className="text-sm text-left capitalize">{provider}</label>
                </div>
              ))}
              {getFilteredProviders().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No providers found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Artist Filter */}
      <Collapsible open={openSections.artist} onOpenChange={() => toggleSection('artist')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Music className="h-3 w-3" />
              <span className="font-medium text-sm">Artist</span>
            </div>
            <div className="flex items-center space-x-2">
              {filters.artists.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  {filters.artists.length}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.artist ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              placeholder="Search artists..."
              value={sectionSearches.artists}
              onChange={(e) => updateSectionSearch('artists', e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>
          <ScrollArea className="h-40">
            <div className="space-y-2 pr-3">
              {getFilteredArtists().map(artist => (
                <div key={artist} className="flex items-center space-x-2">
                  <Checkbox
                    id={`artist-${artist}`}
                    checked={filters.artists.includes(artist)}
                    onCheckedChange={() => toggleArrayFilter('artists', artist)}
                  />
                  <label htmlFor={`artist-${artist}`} className="text-sm">{artist}</label>
                </div>
              ))}
              {getFilteredArtists().length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No artists found</p>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
};

export default FilterPanel;