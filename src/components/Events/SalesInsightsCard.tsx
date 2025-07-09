import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BubiletSalesHistory } from "@/hooks/useEventAnalyticsEnhanced";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { TrendingUp, TrendingDown, Calendar, Target, Zap, DollarSign, Users, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesInsightsCardProps {
  salesHistory: BubiletSalesHistory;
  className?: string;
}

const SalesInsightsCard = ({ salesHistory, className }: SalesInsightsCardProps) => {
  if (!salesHistory?.summary) {
    return (
      <Card className={cn("media-card h-[400px]", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No insights data available</p>
        </CardContent>
      </Card>
    );
  }

  const { summary } = salesHistory;
  
  // Check if this is a pre-sale event
  const isPreSale = salesHistory.eventStatus === 'pre-sale' || 
                   summary.totalTicketsSold === 0 ||
                   !salesHistory.salesData?.length;

  // Pre-sale view with different metrics
  if (isPreSale) {
    const totalCapacity = salesHistory.totalCapacity || summary.remainingCapacity;
    const categoryCount = Object.keys(salesHistory.categoryCapacities || {}).length;
    const daysListed = summary.daysActive || 0;
    
    const preSaleInsights = [
      {
        label: "Total Capacity",
        value: formatNumber(totalCapacity),
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "Ticket Categories",
        value: `${categoryCount} types`,
        icon: Ticket,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        label: "Days Listed",
        value: `${daysListed} days`,
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      {
        label: "Event Status",
        value: salesHistory.eventStatus === 'pre-sale' ? 'Pre-Sale' : 'Listed',
        icon: Target,
        color: "text-teal-600",
        bgColor: "bg-teal-100",
      }
    ];

    return (
      <Card className={cn("media-card h-[400px]", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Event Insights</CardTitle>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Pre-Sale
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-3">
            {preSaleInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className={cn("p-2 rounded-lg", insight.bgColor)}>
                    <IconComponent className={cn("h-4 w-4", insight.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      {insight.label}
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {insight.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Breakdown */}
          {salesHistory.categoryCapacities && Object.keys(salesHistory.categoryCapacities).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Category Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(salesHistory.categoryCapacities).map(([category, capacity]) => {
                  const percentage = totalCapacity > 0 ? (capacity / totalCapacity) * 100 : 0;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{category}</span>
                        <span className="font-medium">{capacity} tickets</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sale start info */}
          {salesHistory.saleStartDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Expected Sale Start
              </p>
              <p className="text-sm font-semibold text-blue-800">
                {new Date(salesHistory.saleStartDate).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Calculate additional metrics
  const avgTicketPrice = summary.totalTicketsSold > 0 
    ? summary.totalRevenue / summary.totalTicketsSold 
    : 0;

  const totalCapacity = summary.totalTicketsSold + summary.remainingCapacity;
  const soldPercentage = totalCapacity > 0 
    ? (summary.totalTicketsSold / totalCapacity) * 100 
    : 0;

  // Determine trend direction (simplified - in real app would compare with previous period)
  const isPositiveTrend = summary.salesVelocity > summary.averageDailySales;

  const insights = [
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue, '₺'),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Tickets Sold",
      value: formatNumber(summary.totalTicketsSold),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Sales Velocity",
      value: `${Math.round(summary.salesVelocity)}/day`,
      icon: isPositiveTrend ? TrendingUp : TrendingDown,
      color: isPositiveTrend ? "text-green-600" : "text-orange-600",
      bgColor: isPositiveTrend ? "bg-green-100" : "bg-orange-100",
    },
    {
      label: "Days Active",
      value: `${summary.daysActive} days`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Avg. Ticket Price",
      value: formatCurrency(avgTicketPrice, '₺'),
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    }
  ];

  return (
    <Card className={cn("media-card h-[400px]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sales Insights</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-3">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className={cn("p-2 rounded-lg", insight.bgColor)}>
                  <IconComponent className={cn("h-4 w-4", insight.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {insight.label}
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {insight.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sales Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Sales Progress</span>
            <span className="font-semibold">{soldPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(soldPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatNumber(summary.totalTicketsSold)} sold</span>
            <span>{formatNumber(summary.remainingCapacity)} remaining</span>
          </div>
        </div>

        {/* Peak Sales Date */}
        {summary.peakSalesDate && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Peak Sales Day
            </p>
            <p className="text-sm font-semibold text-primary">
              {new Date(summary.peakSalesDate).toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesInsightsCard;