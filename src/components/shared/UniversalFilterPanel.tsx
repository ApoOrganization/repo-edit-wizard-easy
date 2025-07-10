import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Filter, Music, Building2, MapPin, Users, DollarSign, Calendar } from "lucide-react";

// Icon mapping for common filter types
const iconMap = {
  search: Search,
  music: Music,
  building: Building2,
  location: MapPin,
  users: Users,
  money: DollarSign,
  calendar: Calendar,
} as const;

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  key: string;
  title: string;
  type: 'search' | 'checkbox' | 'radio' | 'select';
  placeholder?: string;
  icon?: keyof typeof iconMap;
  options?: FilterOption[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface UniversalFilterState {
  [key: string]: string | string[];
}

interface UniversalFilterPanelProps {
  filters: UniversalFilterState;
  onFiltersChange: (filters: UniversalFilterState) => void;
  sections: FilterSection[];
  className?: string;
}

const UniversalFilterPanel = ({
  filters,
  onFiltersChange,
  sections,
  className = "w-80 flex-shrink-0 space-y-4"
}: UniversalFilterPanelProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    sections.forEach(section => {
      if (section.collapsible !== false) {
        initialState[section.key] = section.defaultOpen !== false;
      }
    });
    return initialState;
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const updateFilters = (updates: Partial<UniversalFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: UniversalFilterState = {};
    sections.forEach(section => {
      if (section.type === 'checkbox') {
        clearedFilters[section.key] = [];
      } else {
        clearedFilters[section.key] = '';
      }
    });
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return sections.reduce((count, section) => {
      const value = filters[section.key];
      if (section.type === 'checkbox') {
        return count + ((value as string[])?.length || 0);
      } else {
        return count + (value ? 1 : 0);
      }
    }, 0);
  };

  const isSectionCollapsed = (section: FilterSection) => {
    if (section.collapsible === false) return false;
    return !openSections[section.key];
  };

  const renderSectionContent = (section: FilterSection) => {
    switch (section.type) {
      case 'search':
        return (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={section.placeholder || "Search..."}
              value={(filters[section.key] as string) || ''}
              onChange={(e) => updateFilters({ [section.key]: e.target.value })}
              className="pl-10 h-9 text-sm"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {section.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${section.key}-${option.value}`}
                  checked={((filters[section.key] as string[]) || []).includes(option.value)}
                  onCheckedChange={() => toggleArrayFilter(section.key, option.value)}
                />
                <label 
                  htmlFor={`${section.key}-${option.value}`} 
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  {option.label}
                  {option.count !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {option.count}
                    </Badge>
                  )}
                </label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={(filters[section.key] as string) || ''}
            onValueChange={(value) => updateFilters({ [section.key]: value })}
          >
            {section.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${section.key}-${option.value}`} />
                <label htmlFor={`${section.key}-${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'select':
        return (
          <Select 
            value={(filters[section.key] as string) || ''} 
            onValueChange={(value) => updateFilters({ [section.key]: value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={section.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {section.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
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

      {sections.map((section) => {
        const IconComponent = section.icon ? iconMap[section.icon] : null;
        
        if (section.collapsible === false) {
          return (
            <div key={section.key} className="space-y-3">
              <div className="flex items-center space-x-2">
                {IconComponent && <IconComponent className="h-3 w-3" />}
                <span className="font-medium text-sm">{section.title}</span>
              </div>
              {renderSectionContent(section)}
            </div>
          );
        }

        return (
          <Collapsible 
            key={section.key} 
            open={!isSectionCollapsed(section)} 
            onOpenChange={() => toggleSection(section.key)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className="h-3 w-3" />}
                  <span className="font-medium text-sm">{section.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${!isSectionCollapsed(section) ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {renderSectionContent(section)}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default UniversalFilterPanel;