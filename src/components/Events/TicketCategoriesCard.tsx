import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TicketCategory } from '@/hooks/useEventTickets';
import { formatCurrency } from '@/utils/formatters';
import { Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface TicketCategoriesCardProps {
  categories: { [categoryName: string]: TicketCategory };
  isLoading?: boolean;
}

export const TicketCategoriesCard: React.FC<TicketCategoriesCardProps> = ({
  categories,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket Categories
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
            Ticket Categories
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

  const categoryEntries = Object.entries(categories);

  if (categoryEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticket Categories
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Ticket Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryEntries.map(([categoryName, category]) => (
            <div
              key={categoryName}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{categoryName}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">
                      {formatCurrency(category.price, '₺')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {category.is_sold_out ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive" className="text-xs">
                          Sold Out
                        </Badge>
                        {category.sellout_duration_days && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Sold out in {category.sellout_duration_days} days</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border">
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