import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueTimeSeriesPoint, VenueTicketTotals } from '@/hooks/useVenueTickets';
import { formatCurrency } from '@/utils/formatters';
import { Lightbulb, TrendingUp, TrendingDown, Target, Calendar, Activity, Building2 } from 'lucide-react';

interface VenueInsightsProps {
  timeseries: VenueTimeSeriesPoint[];
  totals: VenueTicketTotals;
  isLoading?: boolean;
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'tip';
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
}

export const VenueInsights: React.FC<VenueInsightsProps> = ({
  timeseries,
  totals,
  isLoading = false
}) => {
  const insights = useMemo((): Insight[] => {
    if (!timeseries || timeseries.length === 0) return [];

    const insights: Insight[] = [];
    
    // Calculate key metrics
    const totalRevenue = timeseries.reduce((sum, day) => sum + day.daily_revenue, 0);
    const totalTickets = timeseries.reduce((sum, day) => sum + day.tickets_sold, 0);
    const activeDays = timeseries.filter(day => day.tickets_sold > 0).length;
    const avgDailyRevenue = activeDays > 0 ? totalRevenue / activeDays : 0;
    const avgTicketsPerDay = activeDays > 0 ? totalTickets / activeDays : 0;
    const peakRevenue = Math.max(...timeseries.map(day => day.daily_revenue));
    const peakTickets = Math.max(...timeseries.map(day => day.tickets_sold));
    const completionRate = (totals.revenue_realized / totals.total_potential_revenue) * 100;
    
    // Venue utilization analysis
    const allEvents = Array.from(new Set(timeseries.flatMap(day => day.events)));
    const maxConcurrentEvents = Math.max(...timeseries.map(day => day.events.length));
    const avgConcurrentEvents = timeseries.reduce((sum, day) => sum + day.events.length, 0) / timeseries.length;
    
    // Day of week analysis
    const dayOfWeekData: { [key: string]: { revenue: number; tickets: number; count: number } } = {};
    timeseries.forEach(day => {
      const dayOfWeek = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayOfWeekData[dayOfWeek]) {
        dayOfWeekData[dayOfWeek] = { revenue: 0, tickets: 0, count: 0 };
      }
      dayOfWeekData[dayOfWeek].revenue += day.daily_revenue;
      dayOfWeekData[dayOfWeek].tickets += day.tickets_sold;
      dayOfWeekData[dayOfWeek].count += 1;
    });
    
    const bestDay = Object.entries(dayOfWeekData)
      .sort(([,a], [,b]) => b.revenue - a.revenue)[0];

    // Generate venue-specific insights

    // Venue Revenue Performance Insight
    if (completionRate > 85) {
      insights.push({
        type: 'success',
        icon: <TrendingUp className="h-4 w-4 text-green-600" />,
        title: 'Excellent Venue Utilization',
        description: `Outstanding venue performance with ${completionRate.toFixed(1)}% revenue realization. This venue consistently delivers strong results for events.`,
        metric: `${completionRate.toFixed(1)}% utilized`
      });
    } else if (completionRate > 60) {
      insights.push({
        type: 'info',
        icon: <Target className="h-4 w-4 text-blue-600" />,
        title: 'Good Venue Performance',
        description: `Solid venue utilization at ${completionRate.toFixed(1)}%. There's potential to optimize event scheduling and pricing.`,
        metric: `${completionRate.toFixed(1)}% utilized`
      });
    } else {
      insights.push({
        type: 'warning',
        icon: <TrendingDown className="h-4 w-4 text-orange-600" />,
        title: 'Venue Capacity Underutilized',
        description: `Only ${completionRate.toFixed(1)}% of revenue potential achieved. Consider reviewing event programming or venue marketing.`,
        metric: `${completionRate.toFixed(1)}% utilized`
      });
    }

    // Event Hosting Capacity Insight
    if (maxConcurrentEvents >= 10) {
      insights.push({
        type: 'success',
        icon: <Building2 className="h-4 w-4 text-purple-600" />,
        title: 'High-Capacity Venue Operations',
        description: `Successfully hosting up to ${maxConcurrentEvents} concurrent events. This venue demonstrates excellent operational capacity for large-scale festivals.`,
        metric: `${maxConcurrentEvents} max concurrent`
      });
    } else if (avgConcurrentEvents < 2) {
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="h-4 w-4 text-amber-600" />,
        title: 'Event Programming Opportunity',
        description: `Average of ${avgConcurrentEvents.toFixed(1)} events hosted simultaneously. Consider programming more concurrent events to maximize venue revenue.`,
        metric: `${avgConcurrentEvents.toFixed(1)} avg concurrent`
      });
    }

    // Venue Revenue Consistency Insight
    const revenueVariability = activeDays > 0 ? (peakRevenue - avgDailyRevenue) / avgDailyRevenue : 0;
    if (revenueVariability < 1.5) {
      insights.push({
        type: 'success',
        icon: <Activity className="h-4 w-4 text-green-600" />,
        title: 'Consistent Venue Performance',
        description: 'Revenue shows low variability, indicating reliable and predictable venue utilization patterns.',
        metric: `${avgDailyRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} avg daily`
      });
    } else if (revenueVariability > 4) {
      insights.push({
        type: 'info',
        icon: <Activity className="h-4 w-4 text-blue-600" />,
        title: 'Variable Venue Performance',
        description: 'Revenue shows high variability. This could indicate seasonal patterns or event-specific demand.',
        metric: `${revenueVariability.toFixed(1)}x variability`
      });
    }

    // Best Day Performance Insight
    if (bestDay && bestDay[1].revenue > avgDailyRevenue * 2) {
      insights.push({
        type: 'tip',
        icon: <Calendar className="h-4 w-4 text-indigo-600" />,
        title: `${bestDay[0]}s Are Peak Performance Days`,
        description: `${bestDay[0]} shows ${(bestDay[1].revenue / avgDailyRevenue).toFixed(1)}x higher revenue than average. Consider scheduling premium events on ${bestDay[0]}s.`,
        metric: `${(bestDay[1].revenue / bestDay[1].count).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} avg revenue`
      });
    }

    // Venue Efficiency Insight
    const revenuePerTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;
    if (revenuePerTicket > 150) {
      insights.push({
        type: 'success',
        icon: <Target className="h-4 w-4 text-green-600" />,
        title: 'Premium Venue Pricing',
        description: `Excellent revenue per ticket at ${formatCurrency(revenuePerTicket, '₺')}. This venue attracts high-value events and audiences.`,
        metric: `${formatCurrency(revenuePerTicket, '₺')}/ticket`
      });
    } else if (revenuePerTicket < 75) {
      insights.push({
        type: 'tip',
        icon: <TrendingUp className="h-4 w-4 text-amber-600" />,
        title: 'Venue Pricing Optimization Opportunity',
        description: `Current average of ${formatCurrency(revenuePerTicket, '₺')} per ticket suggests potential for attracting higher-value events.`,
        metric: `${formatCurrency(revenuePerTicket, '₺')}/ticket`
      });
    }

    // Multi-Event Management Insight
    if (allEvents.length >= 15) {
      insights.push({
        type: 'success',
        icon: <Building2 className="h-4 w-4 text-blue-600" />,
        title: 'Major Event Destination',
        description: `This venue has hosted ${allEvents.length} different events, establishing itself as a premier destination for diverse entertainment.`,
        metric: `${allEvents.length} unique events`
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  }, [timeseries, totals]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Venue Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Venue Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No insights available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInsightBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'tip': return 'border-amber-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4" />
          Venue Business Insights
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          AI-powered insights based on venue performance and event hosting patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`flex gap-3 p-3 rounded-lg border ${getInsightBorderColor(insight.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  {insight.metric && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {insight.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};