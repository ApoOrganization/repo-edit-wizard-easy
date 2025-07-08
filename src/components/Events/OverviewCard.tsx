import { Event } from "@/data/types";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, Loader2, CheckCircle, XCircle, Ticket } from "lucide-react";

interface OverviewCardProps {
  event: Event;
  analytics?: EventAnalytics['analytics'];
}

const OverviewCard = ({ event, analytics }: OverviewCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'onsale':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'soldout':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'past':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="media-card h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Event Overview
          {!analytics && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Status & Timeline Section */}
        <div className="space-y-3">
          {/* Event Status Badge */}
          {analytics?.overview?.status && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Badge className={`${getStatusColor(analytics.overview.status)} text-xs px-2 py-1`}>
                {analytics.overview.status.charAt(0).toUpperCase() + analytics.overview.status.slice(1)}
              </Badge>
            </div>
          )}
          
          {/* Days on Sale */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-base">
              {analytics?.overview?.daysOnSale ? (
                `${analytics.overview.daysOnSale} days on sale`
              ) : analytics ? (
                'Sales information not available'
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading sales information...
                </div>
              )}
            </span>
          </div>
          
          {/* Sales Started Date */}
          {analytics?.overview?.salesStarted && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-base">
                Sales started {formatDate(analytics.overview.salesStarted)}
              </span>
            </div>
          )}
          
          {/* Event Date */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-base">
              Event date: {formatDate(event.date)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Ticket Information Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Ticket Information</h4>
          
          {/* Price Range */}
          {analytics?.event?.price_analytics && (
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-base">
                Price range: {formatCurrency(analytics.event.price_analytics.min_price)} - {formatCurrency(analytics.event.price_analytics.max_price)}
                <span className="text-muted-foreground ml-2">
                  ({analytics.event.price_analytics.total_categories} categories)
                </span>
              </span>
            </div>
          )}

          {/* Detailed Ticket Categories */}
          {analytics?.event?.pricing && (
            <div className="space-y-2">
              {Object.entries(analytics.event.pricing).map(([provider, providerData]: [string, any]) => (
                providerData?.prices && Array.isArray(providerData.prices) && (
                  <div key={provider} className="ml-6 space-y-1">
                    {providerData.prices.map((priceItem: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Ticket className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {priceItem.category} - {formatCurrency(priceItem.price)}
                          {!priceItem.is_active && (
                            <span className="text-red-500 ml-1">(Inactive)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Availability Status Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Availability</h4>
          
          {/* Tickets Available */}
          {analytics?.event?.availability && (
            <div className="flex items-center gap-3">
              {analytics.event.availability.has_tickets ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-base">
                Tickets {analytics.event.availability.has_tickets ? 'available' : 'not available'}
                {analytics.event.availability.providers_with_tickets?.length > 0 && (
                  <span className="text-muted-foreground ml-2">
                    on {analytics.event.availability.providers_with_tickets.length} platform(s)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Provider Platforms */}
          <div className="flex flex-wrap gap-2">
            {event.providers && event.providers.length > 0 ? (
              event.providers.map((provider, index) => (
                <Badge 
                  key={index} 
                  variant={provider.toLowerCase().includes('bubilet') ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {provider}
                  {provider.toLowerCase().includes('bubilet') && (
                    <span className="ml-1">✓</span>
                  )}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                No platforms listed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;