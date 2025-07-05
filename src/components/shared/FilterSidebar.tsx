
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterSection {
  title: string;
  key: string;
  type: 'checkbox' | 'radio' | 'search';
  options?: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

interface FilterSidebarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string | string[]>;
  onFilterChange: (key: string, value: string | string[]) => void;
  sections: FilterSection[];
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  sections,
  activeFiltersCount,
  onClearFilters,
}: FilterSidebarProps) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isSectionCollapsed = (section: FilterSection) => {
    if (!section.collapsible) return false;
    if (section.key in collapsedSections) {
      return collapsedSections[section.key];
    }
    return !section.defaultOpen;
  };

  const handleCheckboxChange = (sectionKey: string, value: string, checked: boolean) => {
    const currentValues = (filters[sectionKey] as string[]) || [];
    if (checked) {
      onFilterChange(sectionKey, [...currentValues, value]);
    } else {
      onFilterChange(sectionKey, currentValues.filter(v => v !== value));
    }
  };

  const handleRadioChange = (sectionKey: string, value: string) => {
    onFilterChange(sectionKey, value);
  };

  return (
    <div className="w-80 flex-shrink-0 sticky top-6 h-fit">
      <Card className="media-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                Clear All ({activeFiltersCount})
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>

          {/* Filter Sections */}
          {sections.map((section) => (
            <div key={section.key} className="space-y-2">
              <div 
                className={`flex items-center justify-between ${
                  section.collapsible ? 'cursor-pointer' : ''
                }`}
                onClick={() => section.collapsible && toggleSection(section.key)}
              >
                <h4 className="font-medium text-sm">{section.title}</h4>
                {section.collapsible && (
                  isSectionCollapsed(section) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronUp className="h-4 w-4" />
                )}
              </div>
              
              {!isSectionCollapsed(section) && section.options && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {section.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      {section.type === 'checkbox' ? (
                        <>
                          <input
                            type="checkbox"
                            id={`${section.key}-${option.value}`}
                            checked={(filters[section.key] as string[] || []).includes(option.value)}
                            onChange={(e) => handleCheckboxChange(section.key, option.value, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label 
                            htmlFor={`${section.key}-${option.value}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            {option.label}
                            {option.count && (
                              <Badge variant="secondary" className="text-xs">
                                {option.count}
                              </Badge>
                            )}
                          </label>
                        </>
                      ) : (
                        <>
                          <input
                            type="radio"
                            id={`${section.key}-${option.value}`}
                            name={section.key}
                            checked={filters[section.key] === option.value}
                            onChange={() => handleRadioChange(section.key, option.value)}
                            className="rounded border-gray-300"
                          />
                          <label 
                            htmlFor={`${section.key}-${option.value}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {option.label}
                          </label>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
