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

  // Get the current provider's categories
  const currentCategories = useMemo(() => {
    return providers[selectedProvider] || [];
  }, [providers, selectedProvider]);

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
    <Card className="h-[300px] media-card">
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
        <div className="overflow-x-auto">
          {currentCategories.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-foreground">No categories available for this provider</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  {currentCategories.map((category, index) => (
                    <th
                      key={`${selectedProvider}-${category.name}-${index}`}
                      scope="col"
                      className={cn(
                        "px-4 py-2 text-left font-medium text-sm bg-muted",
                        "first:rounded-tl-md last:rounded-tr-md",
                        "min-w-[120px]"
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
                      className="px-4 py-3 font-mono text-sm border-b"
                    >
                      {formatCurrency(
                        typeof category.price === 'string' 
                          ? parseFloat(category.price) 
                          : category.price,
                        '₺'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  {currentCategories.map((category, index) => (
                    <td
                      key={`status-${selectedProvider}-${category.name}-${index}`}
                      className="px-4 py-3"
                    >
                      <div className="flex items-center gap-1.5">
                        {category.sold_out ? (
                          <>
                            <CircleX 
                              className={cn(
                                "w-3.5 h-3.5",
                                getStatusColor(category.sold_out, category.last_update)
                              )}
                            />
                            <span 
                              className={cn(
                                "text-xs font-medium",
                                getStatusColor(category.sold_out, category.last_update)
                              )}
                            >
                              {getDaysAgo(category.last_update)}
                            </span>
                          </>
                        ) : (
                          <>
                            <CircleCheck className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-xs font-medium text-green-600">
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPriceTable;