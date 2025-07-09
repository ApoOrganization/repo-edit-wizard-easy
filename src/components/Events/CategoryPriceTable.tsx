import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, ChevronRight, ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ProviderData } from "@/hooks/useEventAnalyticsEnhanced";
import { cn } from "@/lib/utils";

interface CategoryPriceTableProps {
  providers: ProviderData;
}

const CategoryPriceTable = ({ providers }: CategoryPriceTableProps) => {
  // Initialize with first available provider
  const [selectedProvider, setSelectedProvider] = useState<string>(() => {
    const providerKeys = Object.keys(providers);
    return providerKeys[0] || 'biletix';
  });

  // Pagination state for categories
  const [currentPage, setCurrentPage] = useState(0);
  const CATEGORIES_PER_PAGE = 4; // Show max 4 categories at once

  // Calculate days ago for sold out items
  const getDaysAgo = (lastUpdate: string | undefined): string => {
    if (!lastUpdate) return "Sold out";
    
    const updateDate = new Date(lastUpdate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Get status color based on sold out duration
  const getStatusColor = (soldOut: boolean, lastUpdate: string | undefined): string => {
    if (!soldOut) return "text-green-600";
    
    if (!lastUpdate) return "text-red-600";
    
    const updateDate = new Date(lastUpdate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return "text-red-600";
    return "text-amber-600";
  };

  // Get the current provider's categories with pagination
  const { currentCategories, totalPages, canGoNext, canGoPrev, columnWidthClass } = useMemo(() => {
    const allCategories = providers[selectedProvider] || [];
    const startIndex = currentPage * CATEGORIES_PER_PAGE;
    const endIndex = startIndex + CATEGORIES_PER_PAGE;
    const paginatedCategories = allCategories.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allCategories.length / CATEGORIES_PER_PAGE);
    
    // Dynamic column width based on number of categories
    const getColumnWidth = (numCategories: number) => {
      switch (numCategories) {
        case 1: return "w-full";
        case 2: return "w-1/2";
        case 3: return "w-1/3";
        case 4: return "w-1/4";
        default: return "w-1/4";
      }
    };
    
    return {
      currentCategories: paginatedCategories,
      totalPages,
      canGoNext: currentPage < totalPages - 1,
      canGoPrev: currentPage > 0,
      columnWidthClass: getColumnWidth(paginatedCategories.length)
    };
  }, [providers, selectedProvider, currentPage]);

  // Reset pagination when provider changes
  const handleProviderChange = (newProvider: string) => {
    setSelectedProvider(newProvider);
    setCurrentPage(0);
  };

  // Navigation handlers
  const handlePrevPage = () => {
    if (canGoPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle empty states
  if (!providers || Object.keys(providers).length === 0) {
    return (
      <Card className="h-[300px]">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No pricing information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[300px] media-card max-w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ticket Prices</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(providers).map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{provider}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Category navigation - only show if there are multiple pages */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!canGoPrev}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentPage + 1}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {currentCategories.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No categories available for this provider</p>
            </div>
          ) : (
            <div className="min-w-0 max-w-full">
              <table className="w-full table-fixed min-w-[400px]">
                <thead>
                  <tr>
                    {currentCategories.map((category, index) => (
                      <th
                        key={`${selectedProvider}-${category.name}-${index}`}
                        scope="col"
                        className={cn(
                          "px-3 py-2 text-left font-medium text-sm bg-muted",
                          "first:rounded-tl-md last:rounded-tr-md",
                          columnWidthClass
                        )}
                      >
                        <div className="truncate" title={category.name}>
                          {category.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {currentCategories.map((category, index) => (
                      <td
                        key={`price-${selectedProvider}-${category.name}-${index}`}
                        className={cn("px-3 py-3 font-mono text-sm border-b", columnWidthClass)}
                      >
                        <div className="truncate">
                          {formatCurrency(
                            typeof category.price === 'string' 
                              ? parseFloat(category.price) 
                              : category.price,
                            '₺'
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {currentCategories.map((category, index) => (
                      <td
                        key={`status-${selectedProvider}-${category.name}-${index}`}
                        className={cn("px-3 py-3", columnWidthClass)}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {category.sold_out ? (
                            <>
                              <CircleX 
                                className={cn(
                                  "w-3.5 h-3.5 flex-shrink-0",
                                  getStatusColor(category.sold_out, category.last_update)
                                )}
                              />
                              <span 
                                className={cn(
                                  "text-xs font-medium truncate",
                                  getStatusColor(category.sold_out, category.last_update)
                                )}
                              >
                                {getDaysAgo(category.last_update)}
                              </span>
                            </>
                          ) : (
                            <>
                              <CircleCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-green-600 truncate">
                                Active
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPriceTable;