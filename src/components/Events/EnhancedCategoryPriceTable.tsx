import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TicketCategory } from '@/hooks/useEventTickets';
import { formatCurrency } from '@/utils/formatters';
import { Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCategoryPriceTableProps {
  categories: { [categoryName: string]: TicketCategory };
  isLoading?: boolean;
}

export const EnhancedCategoryPriceTable: React.FC<EnhancedCategoryPriceTableProps> = ({
  categories,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add null safety check
  if (!categories || typeof categories !== 'object') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No ticket information available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryEntries = Object.entries(categories);

  if (categoryEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No ticket categories available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get sold out status text
  const getSoldOutText = (category: TicketCategory): string => {
    if (!category.is_sold_out) return 'Available';
    
    if (category.sellout_duration_days === null) return 'Sold Out';
    
    if (category.sellout_duration_days === 0) return 'Sold out today';
    if (category.sellout_duration_days === 1) return 'Sold out 1 day ago';
    return `Sold out ${category.sellout_duration_days} days ago`;
  };

  // Helper function to get status color
  const getStatusColor = (category: TicketCategory): string => {
    if (!category.is_sold_out) return 'text-green-600';
    
    if (category.sellout_duration_days === null) return 'text-red-600';
    
    if (category.sellout_duration_days <= 3) return 'text-red-600';
    return 'text-amber-600';
  };

  // Dynamic column width based on number of categories
  const getColumnWidth = (numCategories: number) => {
    switch (numCategories) {
      case 1: return 'w-full';
      case 2: return 'w-1/2';
      case 3: return 'w-1/3';
      case 4: return 'w-1/4';
      default: return 'w-1/4';
    }
  };

  const columnWidthClass = getColumnWidth(categoryEntries.length);

  return (
    <Card className="h-[250px] media-card max-w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Ticket Prices
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-0">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  {categoryEntries.map(([categoryName], index) => (
                    <th
                      key={`header-${categoryName}-${index}`}
                      scope="col"
                      className={cn(
                        'px-3 py-2 text-left font-medium text-sm bg-muted',
                        'first:rounded-tl-md last:rounded-tr-md',
                        columnWidthClass
                      )}
                    >
                      <div className="truncate" title={categoryName}>
                        {categoryName}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr>
                  {categoryEntries.map(([categoryName, category], index) => (
                    <td
                      key={`price-${categoryName}-${index}`}
                      className={cn('px-3 py-3 font-mono text-sm border-b', columnWidthClass)}
                    >
                      <div className="truncate">
                        {formatCurrency(category.price / 100, '₺')}
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Status Row */}
                <tr>
                  {categoryEntries.map(([categoryName, category], index) => (
                    <td
                      key={`status-${categoryName}-${index}`}
                      className={cn('px-3 py-3', columnWidthClass)}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {category.is_sold_out ? (
                          <>
                            <XCircle 
                              className={cn(
                                'w-3.5 h-3.5 flex-shrink-0',
                                getStatusColor(category)
                              )}
                            />
                            <span 
                              className={cn(
                                'text-xs font-medium truncate',
                                getStatusColor(category)
                              )}
                              title={getSoldOutText(category)}
                            >
                              {getSoldOutText(category)}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-xs font-medium text-green-600 truncate">
                              Available
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
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{categoryEntries.length}</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {categoryEntries.filter(([, category]) => category.is_sold_out).length}
              </div>
              <div className="text-xs text-muted-foreground">Sold Out</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {categoryEntries.filter(([, category]) => !category.is_sold_out).length}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};