import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Users, Building2, TrendingUp, TrendingDown, Calendar, DollarSign, Star, BarChart3, MapPin, Loader2, Music, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePromoterAnalytics, useIsPromoterAnalyticsFallback, useIsPromoterAnalyticsError } from "@/hooks/usePromoterAnalytics";
import { formatRevenue, getPromoterSpecialtyBadgeVariant } from "@/hooks/usePromoters";
import { formatNumber, formatScore, formatDecimalPercentage } from "@/utils/formatters";
import { PromoterCalendarView } from "@/components/promoter/PromoterCalendarView";
import { TopVenuesCard } from "@/components/promoter/TopVenuesCard";
import { TopGenresCard } from "@/components/promoter/TopGenresCard";
import { usePromoterTickets, hasPromoterTicketData, isPromoterTicketError } from "@/hooks/usePromoterTickets";
import { RevenueOverview, SalesTimeSeriesChart } from "@/components/shared";
import { EventPortfolioAnalytics } from "@/components/promoter/EventPortfolioAnalytics";
import { PromoterInsights } from "@/components/promoter/PromoterInsights";

const PromoterDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Main analytics data
  const {
    data: analyticsData,
    isLoading,
    error
  } = usePromoterAnalytics(id, 'year', true);
  
  // Promoter ticket sales data
  const {
    data: ticketData,
    isLoading: ticketLoading,
    error: ticketError
  } = usePromoterTickets(id);
  
  // Destructure analytics data
  const promoter = analyticsData?.promoter;
  const analytics = analyticsData?.analytics;
  const genreAnalytics = analyticsData?.genreAnalytics || [];
  const venueAnalytics = analyticsData?.venueAnalytics || [];
  const artistCollaborations = analyticsData?.artistCollaborations || [];
  const timeSeries = analyticsData?.timeSeries || [];
  
  // Check data status
  const isFallbackData = useIsPromoterAnalyticsFallback(analyticsData);
  const isErrorState = useIsPromoterAnalyticsError(analyticsData);
  const hasFullAnalytics = !isFallbackData && !isErrorState && analytics;
  
  // Check ticket data status
  const hasTicketSalesData = hasPromoterTicketData(ticketData);
  const isTicketError = isPromoterTicketError(ticketData);
  const shouldShowTicketTab = hasTicketSalesData || ticketLoading;
  
  console.log('🎭 Promoter Detail Status:', {
    promoterId: id,
    promoterName: promoter?.name,
    dataStatus: {
      isLoading,
      hasError: !!error,
      hasAnalyticsData: !!analyticsData,
      hasPromoter: !!promoter,
      isFallbackData,
      isErrorState,
      hasFullAnalytics
    },
    dataOverview: analyticsData ? {
      businessStats: promoter?.business_stats,
      performanceScore: analytics?.performanceScore,
      genreAnalyticsCount: genreAnalytics.length,
      venueAnalyticsCount: venueAnalytics.length,
      timeSeriesLength: timeSeries.length
    } : null
  });

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
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-muted-foreground mt-2">Loading promoter analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !promoter) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-6">
          <div className="py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4 font-manrope">
              {isErrorState ? 'Data Temporarily Unavailable' : 'Promoter Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isErrorState 
                ? 'We are experiencing technical difficulties. Please try again later.' 
                : error instanceof Error ? error.message : 'Unable to load promoter data'
              }
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link to="/promoters">Back to Promoters</Link>
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
          <Link to="/promoters" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Promoters
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground font-manrope">{promoter?.name}</h1>
              <Badge variant={getPromoterSpecialtyBadgeVariant(promoter?.specialty)} className="text-xs">
                {promoter?.specialty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {promoter?.city}
              </Badge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{promoter?.business_stats?.total_events || 0}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{promoter?.business_stats?.venues_used || 0}</div>
                <p className="text-xs text-muted-foreground">Venues Used</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{promoter?.business_stats?.years_active || 0}</div>
                <p className="text-xs text-muted-foreground">Years Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatScore(analytics?.performanceScore)}%</div>
                <p className="text-xs text-muted-foreground">Performance Score</p>
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
                  <div className="text-2xl font-bold">{analytics.businessMetrics?.operational_efficiency?.events_per_month?.toFixed(1) || '0.0'}</div>
                  <p className="text-xs text-muted-foreground">Events per Month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analytics?.marketPosition || 'Unknown'}</div>
                  <p className="text-xs text-muted-foreground">Scale Classification</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{promoter?.business_stats?.genres_promoted || 0}</div>
                  <p className="text-xs text-muted-foreground">Genres Promoted</p>
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
                  📊 Advanced analytics temporarily unavailable. Showing basic promoter information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${shouldShowTicketTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!hasFullAnalytics}>
              Analytics {!hasFullAnalytics && '(Unavailable)'}
            </TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            {shouldShowTicketTab && (
              <TabsTrigger value="tickets">
                Ticket Sales
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Specialty</span>
                      <span className="text-sm font-medium">{promoter?.specialty || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Primary Location</span>
                      <span className="text-sm font-medium">{promoter?.city || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Years Active</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.years_active || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Genres Promoted</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.genres_promoted || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email</span>
                      <span className="text-sm font-medium">{promoter?.contact_info?.email || 'Not Available'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Website</span>
                      <span className="text-sm font-medium">{promoter?.contact_info?.website || 'Not Available'}</span>
                    </div>
                    {promoter?.contact_info?.instagram_link && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Instagram</span>
                        <a 
                          href={promoter.contact_info.instagram_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          @{promoter.name}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* City Performance Distribution */}
              {promoter?.city_distribution && promoter.city_distribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Geographic Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-3">
                        Active in {promoter?.business_stats?.venues_used || 0} venues across {promoter.city_distribution.length} cities
                      </div>
                      {promoter.city_distribution.slice(0, 5).map((city, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{city.city}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{city.event_count} events</div>
                            <div className="text-xs text-muted-foreground">{formatDecimalPercentage(city.percentage)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Artist Collaboration Overview */}
              {hasFullAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Artist Collaborations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Artist Loyalty Rate</span>
                        <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.artist_retention_rate)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Primary Genre</span>
                        <span className="text-sm font-medium">{promoter?.primary_genre || 'Mixed'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Growth Trend</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{promoter?.growth_trend || 'stable'}</span>
                          {promoter?.growth_trend === 'growing' && <TrendingUp className="h-3 w-3 text-green-600" />}
                          {promoter?.growth_trend === 'declining' && <TrendingDown className="h-3 w-3 text-red-600" />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="venues" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Top Venues Component */}
              <TopVenuesCard 
                venueAnalytics={venueAnalytics}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {hasFullAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Genre Analytics Component */}
                <TopGenresCard 
                  genreAnalytics={genreAnalytics}
                  isLoading={isLoading}
                />

                {/* City Performance Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">City Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-3">
                        Event distribution across {promoter?.city_distribution?.length || 0} cities
                      </div>
                      {promoter?.city_distribution && promoter.city_distribution.length > 0 ? (
                        promoter.city_distribution.slice(0, 8).map((city, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm">{city.city}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium">{city.event_count} events</div>
                              <div className="text-xs text-muted-foreground">{formatDecimalPercentage(city.percentage)}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground">No city distribution data available</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Activity Patterns */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Monthly Activity Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {timeSeries.slice(-6).map((month, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{month.month}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{month.events} events</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Artist Collaboration Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Artist Relationships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-xs text-muted-foreground mb-3">
                        Artist collaboration and loyalty metrics
                      </div>
                      {/* Artist collaboration data will be shown here */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 text-xs text-muted-foreground">
                          <span>Artist metrics available in API response</span>
                        </div>
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
                      📊 Advanced analytics are temporarily unavailable for this promoter.
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

          <TabsContent value="tickets" className="space-y-6">
            {hasTicketSalesData ? (
              <>
                {/* Revenue Overview */}
                <RevenueOverview 
                  totals={ticketData.totals}
                  entityType="promoter"
                  isLoading={ticketLoading}
                />
                
                {/* Sales Chart */}
                <SalesTimeSeriesChart 
                  timeseries={ticketData.timeseries}
                  eventsPresent={ticketData.events_present}
                  entityType="promoter"
                  isLoading={ticketLoading}
                />
                
                {/* Event Portfolio Analytics */}
                <EventPortfolioAnalytics 
                  timeseries={ticketData.timeseries}
                  eventsPresent={ticketData.events_present}
                  isLoading={ticketLoading}
                />
                
                {/* Business Insights */}
                <PromoterInsights 
                  timeseries={ticketData.timeseries}
                  totals={ticketData.totals}
                  isLoading={ticketLoading}
                />
                
                {/* Additional Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Sales Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Days Tracked</span>
                          <span className="text-sm font-medium">{ticketData.timeseries.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Sales Days</span>
                          <span className="text-sm font-medium">
                            {ticketData.timeseries.filter(d => d.tickets_sold > 0).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Tickets Sold</span>
                          <span className="text-sm font-medium">
                            {ticketData.timeseries.reduce((sum, d) => sum + d.tickets_sold, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Unique Events</span>
                          <span className="text-sm font-medium">
                            {ticketData.events_present ? Object.keys(ticketData.events_present).length : 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Revenue Completion</span>
                          <span className="text-sm font-medium">
                            {((ticketData.totals.revenue_realized / ticketData.totals.total_potential_revenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg Daily Revenue</span>
                          <span className="text-sm font-medium">
                            {(ticketData.timeseries.reduce((sum, d) => sum + d.daily_revenue, 0) / ticketData.timeseries.length).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg Daily Sales</span>
                          <span className="text-sm font-medium">
                            {Math.round(ticketData.timeseries.reduce((sum, d) => sum + d.tickets_sold, 0) / ticketData.timeseries.length).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Peak Concurrent Events</span>
                          <span className="text-sm font-medium">
                            {Math.max(...ticketData.timeseries.map(d => d.events.length))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : ticketLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading ticket sales data...</p>
              </div>
            ) : isTicketError ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-medium text-orange-800 mb-2">Ticket Sales Data Not Available</h3>
                    <p className="text-sm text-orange-700 mb-4">
                      This promoter doesn't have Bubilet integration or no ticket sales data is available.
                    </p>
                    <p className="text-xs text-orange-600">
                      Contact the promoter about integrating with Bubilet for comprehensive sales analytics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No Ticket Sales Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Unable to load ticket sales data for this promoter.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Artist Retention Rate</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.artist_retention_rate)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance Score</span>
                      <span className="text-sm font-medium">{formatScore(analytics?.performanceScore)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Scale Classification</span>
                      <span className="text-sm font-medium">{analytics?.marketPosition || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Events per Month</span>
                      <span className="text-sm font-medium">{analytics.businessMetrics?.operational_efficiency?.events_per_month?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Intelligence */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Business Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Events</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.total_events || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Upcoming Events</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.upcoming_events || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Venue Relationships</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.venues_used || 0} venues</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Genre Diversity</span>
                      <span className="text-sm font-medium">{promoter?.business_stats?.genres_promoted || 0} genres</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Day of Week Performance */}
              {hasFullAnalytics && promoter?.day_of_week_preference && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Preferred Event Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-3">
                        Event scheduling patterns and preferences
                      </div>
                      {promoter.day_of_week_preference.map((day, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{day.day}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{day.count} events</div>
                            <div className="text-xs text-muted-foreground">{formatDecimalPercentage(day.percentage)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Growth and Trends */}
              {hasFullAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Growth Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Growth Trend</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{promoter?.growth_trend || 'stable'}</span>
                          {promoter?.growth_trend === 'growing' && <TrendingUp className="h-3 w-3 text-green-600" />}
                          {promoter?.growth_trend === 'declining' && <TrendingDown className="h-3 w-3 text-red-600" />}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Scale Classification</span>
                        <span className="text-sm font-medium capitalize">{analytics?.marketPosition || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Activity Level</span>
                        <span className="text-sm font-medium">{analytics.businessMetrics?.operational_efficiency?.events_per_month?.toFixed(1) || '0.0'} events/month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Years in Business</span>
                        <span className="text-sm font-medium">{promoter?.business_stats?.years_active || 0} years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Event Calendar Section */}
        <div className="mt-8">
          <PromoterCalendarView 
            promoterId={id || ''}
            promoterName={promoter?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default PromoterDetail;
