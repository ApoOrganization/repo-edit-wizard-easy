import { Event } from "@/data/types";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, Loader2, Calendar, Users, DollarSign } from "lucide-react";

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

  // Check if event is listed on Bubilet for detailed analytics
  const isBubiletEvent = event.providers.some(provider => 
    provider.toLowerCase().includes('bubilet')
  );

  // Use analytics data when available, fallback for missing data
  const ticketsSold = analytics?.overview?.ticketsSold || 0;
  const totalCapacity = analytics?.overview?.totalCapacity || 0;
  const selloutPercentage = totalCapacity > 0 ? (ticketsSold / totalCapacity) * 100 : 0;
  const daysOnSale = analytics?.overview?.daysOnSale || 0;
  const hasAnalyticsData = analytics?.overview && ticketsSold > 0 && totalCapacity > 0;

  // Sales velocity calculations
  const salesVelocity = analytics?.salesVelocity;
  const ticketsPerDay = salesVelocity?.ticketsPerDay ? parseFloat(salesVelocity.ticketsPerDay) : 0;
  const estimatedSelloutDays = salesVelocity?.estimatedSelloutDays;

  // Price comparison data
  const priceComparison = analytics?.priceComparison;
  const currentPrice = priceComparison?.currentPrice;
  const percentageDiff = priceComparison?.percentageDiff;

  // Determine trend icon based on sales velocity and percentage difference
  const getTrendIcon = () => {
    if (!priceComparison) return null;
    const diff = parseFloat(percentageDiff || "0");
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
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
        <div className="space-y-3">
          {/* Sales Started */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-base">
              {analytics?.overview?.salesStarted ? (
                `Sales started ${analytics.overview.salesStarted}`
              ) : analytics ? (
                `${daysOnSale} days on sale`
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sales information loading...
                </div>
              )}
            </span>
          </div>
          
          {/* Event Date */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-base">Event scheduled for {new Date(event.date).toLocaleDateString('tr-TR')}</span>
          </div>
          
          {/* Ticket Sales Status */}
          <div className="flex items-center gap-3">
            <Users className={`h-4 w-4 ${selloutPercentage >= 100 ? 'text-red-500' : 'text-yellow-500'}`} />
            <span className="text-base">
              {hasAnalyticsData ? (
                <div className="flex items-center gap-2">
                  {selloutPercentage >= 100 ? (
                    <>
                      <span className="font-semibold text-red-600">Sold out</span>
                      <span>({ticketsSold.toLocaleString()} tickets)</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">{selloutPercentage.toFixed(1)}% sold</span>
                      <span>({ticketsSold.toLocaleString()} / {totalCapacity.toLocaleString()} tickets)</span>
                    </>
                  )}
                </div>
              ) : analytics ? (
                'No sales data available'
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Ticket sales data loading...
                </div>
              )}
            </span>
          </div>

          {/* Sales Velocity - Only for Bubilet events */}
          {isBubiletEvent && salesVelocity && ticketsPerDay > 0 && (
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-base">
                <span className="font-semibold">{ticketsPerDay.toFixed(1)} tickets/day</span>
                {estimatedSelloutDays && estimatedSelloutDays > 0 && (
                  <span className="text-muted-foreground ml-2">
                    (Est. sellout in {estimatedSelloutDays} days)
                  </span>
                )}
              </span>
            </div>
          )}
          
          {/* Current Price with Trend */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span className="text-base flex items-center gap-2">
              {currentPrice ? (
                <>
                  <span>Current price: {formatCurrency(currentPrice)}</span>
                  {getTrendIcon()}
                  {percentageDiff && (
                    <span className={`text-sm ${parseFloat(percentageDiff) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({percentageDiff})
                    </span>
                  )}
                </>
              ) : analytics ? (
                'Price information not available'
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Price information loading...
                </div>
              )}
            </span>
          </div>

          {/* Bubilet Notice for non-Bubilet events */}
          {!isBubiletEvent && analytics && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Detailed sales data only available for Bubilet events
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Listed on Platforms</h4>
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