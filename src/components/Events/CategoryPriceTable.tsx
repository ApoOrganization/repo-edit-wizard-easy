import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck, CircleX } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ProviderData, CategoryData } from "@/hooks/useEventAnalyticsEnhanced";
import { cn } from "@/lib/utils";

interface CategoryPriceTableProps {
  providers: ProviderData;
  categorySlice?: { start: number; end: number }; // For showing specific category range
}

const CategoryPriceTable = ({ providers, categorySlice }: CategoryPriceTableProps) => {
  const CATEGORIES_PER_SLIDE = 4; // Max 4 categories per slide
  
  // Initialize with first available provider
  const [selectedProvider, setSelectedProvider] = useState<string>(() => {
    const providerKeys = Object.keys(providers);
    return providerKeys[0] || 'biletix';
  });

  // Get sellout duration text for sold out items
  const getSelloutText = (selloutDurationDays: number | null | undefined): string => {
    if (selloutDurationDays === null || selloutDurationDays === undefined) {
      return "Sold out";
    }
    
    if (selloutDurationDays === 1) {
      return "Sold out in 1 day";
    }
    
    return `Sold out in ${selloutDurationDays} days`;
  };

  // Get status color based on sellout velocity (how fast it sold out)
  const getStatusColor = (soldOut: boolean, selloutDurationDays: number | null | undefined): string => {
    if (!soldOut) return "text-green-600";
    
    // No duration info - default red
    if (selloutDurationDays === null || selloutDurationDays === undefined) {
      return "text-red-600";
    }
    
    // Fast sellouts (high demand) - red
    if (selloutDurationDays <= 2) return "text-red-600";
    
    // Medium sellouts - amber  
    if (selloutDurationDays <= 7) return "text-amber-600";
    
    // Slow sellouts - orange
    return "text-orange-500";
  };

  // Get the current provider's categories with optional slicing
  const { currentCategories, columnWidthClass } = useMemo(() => {
    const allCategories = providers[selectedProvider] || [];
    
    // Apply category slice if provided, otherwise show first CATEGORIES_PER_SLIDE
    let slicedCategories: CategoryData[];
    if (categorySlice) {
      slicedCategories = allCategories.slice(categorySlice.start, categorySlice.end);
    } else {
      slicedCategories = allCategories.slice(0, CATEGORIES_PER_SLIDE);
    }
    
    // Debug logging for current categories
    console.log('📊 CategoryPriceTable rendering:', {
      selectedProvider,
      allCategories,
      slicedCategories,
      soldOutItems: slicedCategories.filter(cat => cat.sold_out)
    });
    
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
      currentCategories: slicedCategories,
      columnWidthClass: getColumnWidth(slicedCategories.length)
    };
  }, [providers, selectedProvider, categorySlice]);

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
    <Card className="h-[250px] media-card max-w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ticket Prices</CardTitle>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {currentCategories.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No categories available for this provider</p>
            </div>
          ) : (
            <div className="min-w-0">
              <table className="w-full table-fixed">
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
                                  getStatusColor(category.sold_out, category.sellout_duration_days)
                                )}
                              />
                              <span 
                                className={cn(
                                  "text-xs font-medium truncate",
                                  getStatusColor(category.sold_out, category.sellout_duration_days)
                                )}
                              >
                                {getSelloutText(category.sellout_duration_days)}
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