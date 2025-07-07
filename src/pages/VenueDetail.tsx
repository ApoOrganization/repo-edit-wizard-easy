import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Users, Star, Building2, Calendar, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVenueAnalytics, useVenueUpcomingEvents, useVenuePastEvents, useIsVenueAnalyticsFallback, useIsVenueAnalyticsError } from "@/hooks/useVenueAnalytics";
import { formatNumber, formatCurrency, formatScore, formatDecimalPercentage } from "@/utils/formatters";

const VenueDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'all'>('year');
  
  // Main analytics data
  const {
    data: analyticsData,
    isLoading,
    error
  } = useVenueAnalytics(id, timeRange);
  
  // Events data (lazy loaded based on tab)
  const { data: upcomingEventsData } = useVenueUpcomingEvents(id, activeTab === 'events');
  const { data: pastEventsData } = useVenuePastEvents(id, activeTab === 'events');

  // Destructure analytics data
  const venue = analyticsData?.venue;
  const analytics = analyticsData?.analytics;
  const timeSeries = analyticsData?.timeSeries || [];
  const upcomingEvents = upcomingEventsData?.events || [];
  const pastEvents = pastEventsData?.events || [];
  
  // Check data status
  const isFallbackData = useIsVenueAnalyticsFallback(analyticsData);
  const isErrorState = useIsVenueAnalyticsError(analyticsData);
  const hasFullAnalytics = !isFallbackData && !isErrorState && analytics;
  
  console.log('🏟️ Venue Detail Status:', {
    venueId: id,
    venueName: venue?.name,
    isFallbackData,
    isErrorState,
    hasFullAnalytics,
    timeRange
  });

  // Helper functions
  const renderGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Loading Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="py-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-8 w-64 bg-muted rounded animate-pulse" />
              <div className="h-6 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
          
          <div className="border-t border-border" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center py-8">
            <div className="h-4 w-48 bg-muted rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-6">
          <div className="py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4 font-manrope">
              {isErrorState ? 'Data Temporarily Unavailable' : 'Venue Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isErrorState 
                ? 'We are experiencing technical difficulties. Please try again later.' 
                : error instanceof Error ? error.message : 'Unable to load venue data'
              }
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link to="/venues">Back to Venues</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/venues" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Venues
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground font-manrope">{venue?.name}</h1>
              <Badge variant="secondary" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {venue?.city}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {formatNumber(venue?.capacity)} capacity
              </Badge>
            </div>
            
            {/* Time Range Selector */}
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{venue?.event_stats?.total_events || 0}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics?.uniqueArtists || 0}</div>
                <p className="text-xs text-muted-foreground">Unique Artists</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatScore(venue?.utilization_metrics?.capacity_utilization)}%</div>
                <p className="text-xs text-muted-foreground">Utilization Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(venue?.pricing_analytics?.avg_ticket_price)}</div>
                <p className="text-xs text-muted-foreground">Avg Ticket Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics - Only show with full analytics */}
        {hasFullAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatScore(analytics.artistReturnRate)}%</div>
                  <p className="text-xs text-muted-foreground">Artist Return Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{venue?.utilization_metrics?.avg_events_per_month.toFixed(1) || '0.0'}</div>
                  <p className="text-xs text-muted-foreground">Events per Month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{venue?.pricing_analytics?.price_range?.max ? formatCurrency(venue.pricing_analytics.price_range.max) : '$0'}</div>
                  <p className="text-xs text-muted-foreground">Max Ticket Price</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Fallback Analytics Message */}
        {isFallbackData && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-orange-700">
                  📊 Advanced analytics temporarily unavailable. Showing basic venue information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Series Chart - Only show with full analytics */}
        {hasFullAnalytics && timeSeries.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Revenue & Events Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart - would implement with Recharts */}
                📈 Revenue and Events Chart ({timeSeries.length} data points)
                <br />
                <small>Chart visualization would be implemented here with Recharts</small>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!hasFullAnalytics}>
              Analytics {!hasFullAnalytics && '(Unavailable)'}
            </TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Artists */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Top Performing Artists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {venue?.top_artists?.slice(0, 5).map((artist, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <Link 
                          to={`/artists/${artist.artist_id}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {artist.artist_name}
                        </Link>
                        <div className="text-sm font-medium">{artist.performance_count} shows</div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No artist data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Day of Week Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Peak Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {venue?.day_of_week_distribution?.map((day, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-sm">{day.day_of_week}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{day.event_count} events</div>
                          <div className="text-xs text-muted-foreground">{formatDecimalPercentage(day.percentage)}</div>
                        </div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No schedule data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Utilization Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Utilization Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Capacity Utilization</span>
                      <span className="text-sm font-medium">{formatScore(venue?.utilization_metrics?.capacity_utilization)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Events/Month</span>
                      <span className="text-sm font-medium">{venue?.utilization_metrics?.avg_events_per_month.toFixed(1) || '0.0'}</span>
                    </div>
                    <div>
                      <span className="text-sm">Peak Months</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {venue?.utilization_metrics?.peak_months?.map((month, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {month}
                          </Badge>
                        )) || <span className="text-xs text-muted-foreground">No peak data</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Pricing Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Price</span>
                      <span className="text-sm font-medium">{formatCurrency(venue?.pricing_analytics?.avg_ticket_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Price Range</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(venue?.pricing_analytics?.price_range?.min)} - {formatCurrency(venue?.pricing_analytics?.price_range?.max)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event: any) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">{event.status}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No upcoming events</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Past Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Recent Past Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event: any) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">{event.status}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No past events</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {hasFullAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Peak Days Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Peak Days Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics?.peakDays?.map((day, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{day.day_of_week}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{day.event_count} events</div>
                          </div>
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No peak days data available</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Series Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time Range</span>
                        <span className="text-sm font-medium">{analytics.timeRange}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Points</span>
                        <span className="text-sm font-medium">{timeSeries.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Unique Artists</span>
                        <span className="text-sm font-medium">{analytics.uniqueArtists}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      📊 Advanced analytics are temporarily unavailable for this venue.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Event Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Events</span>
                      <span className="text-sm font-medium">{venue?.event_stats?.total_events || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Upcoming Events</span>
                      <span className="text-sm font-medium">{venue?.event_stats?.upcoming_events || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recent Events</span>
                      <span className="text-sm font-medium">{venue?.event_stats?.recent_events || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Capacity Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Capacity</span>
                      <span className="text-sm font-medium">{formatNumber(venue?.capacity)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Utilization Rate</span>
                      <span className="text-sm font-medium">{formatScore(venue?.utilization_metrics?.capacity_utilization)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VenueDetail;