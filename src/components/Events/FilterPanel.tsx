
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronDown, X, Calendar, MapPin, Users, DollarSign, Filter } from "lucide-react";

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

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableGenres: string[];
  availableStatuses: string[];
  availableCities: string[];
  availablePromoters: string[];
}

const FilterPanel = ({
  filters,
  onFiltersChange,
  availableGenres,
  availableStatuses,
  availableCities,
  availablePromoters,
}: FilterPanelProps) => {
  const [openSections, setOpenSections] = useState({
    basic: true,
    genre: true,
    status: true,
    location: false,
    promoter: false,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (key: keyof Pick<FilterState, 'genres' | 'statuses' | 'cities' | 'promoters'>, value: string) => {
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
      promoters: [],
      dateRange: '',
      revenueRange: '',
      capacityRange: '',
    });
  };

  const getActiveFilterCount = () => {
    return (
      (filters.search ? 1 : 0) +
      filters.genres.length +
      filters.statuses.length +
      filters.cities.length +
      filters.promoters.length +
      (filters.dateRange ? 1 : 0) +
      (filters.revenueRange ? 1 : 0) +
      (filters.capacityRange ? 1 : 0)
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
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.genre ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {availableGenres.map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={filters.genres.includes(genre)}
                onCheckedChange={() => toggleArrayFilter('genres', genre)}
              />
              <label htmlFor={`genre-${genre}`} className="text-sm">{genre}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Status Filter */}
      <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium text-sm">Status</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {availableStatuses.map(status => (
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

      {/* Location Filter */}
      <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span className="font-medium text-sm">Location</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.location ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {availableCities.slice(0, 8).map(city => (
            <div key={city} className="flex items-center space-x-2">
              <Checkbox
                id={`city-${city}`}
                checked={filters.cities.includes(city)}
                onCheckedChange={() => toggleArrayFilter('cities', city)}
              />
              <label htmlFor={`city-${city}`} className="text-sm">{city}</label>
            </div>
          ))}
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
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.promoter ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {availablePromoters.slice(0, 6).map(promoter => (
            <div key={promoter} className="flex items-center space-x-2">
              <Checkbox
                id={`promoter-${promoter}`}
                checked={filters.promoters.includes(promoter)}
                onCheckedChange={() => toggleArrayFilter('promoters', promoter)}
              />
              <label htmlFor={`promoter-${promoter}`} className="text-sm text-left">{promoter}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Filters */}
      <Collapsible open={openSections.advanced} onOpenChange={() => toggleSection('advanced')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium text-sm">Advanced</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.advanced ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-3">
          <div>
            <label className="text-xs font-medium mb-2 block">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block">Revenue Range</label>
            <Select value={filters.revenueRange} onValueChange={(value) => updateFilters({ revenueRange: value })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Any amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any amount</SelectItem>
                <SelectItem value="0-100k">$0 - $100K</SelectItem>
                <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m+">$1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block">Venue Capacity</label>
            <Select value={filters.capacityRange} onValueChange={(value) => updateFilters({ capacityRange: value })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Any capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any capacity</SelectItem>
                <SelectItem value="0-1k">0 - 1,000</SelectItem>
                <SelectItem value="1k-5k">1,000 - 5,000</SelectItem>
                <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                <SelectItem value="10k+">10,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;
