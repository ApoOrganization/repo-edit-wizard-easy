import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Users, Building2, TrendingUp, Calendar, DollarSign, Star, BarChart3, MapPin, Loader2, Music, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePromoterAnalytics, useIsPromoterAnalyticsFallback, useIsPromoterAnalyticsError } from "@/hooks/usePromoterAnalytics";
import { formatRevenue, getPromoterSpecialtyBadgeVariant } from "@/hooks/usePromoters";
import { formatNumber, formatScore, formatDecimalPercentage } from "@/utils/formatters";

const PromoterDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Main analytics data
  const {
    data: analyticsData,
    isLoading,
    error
  } = usePromoterAnalytics(id, 'year', true);
  
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
                <div className="text-2xl font-bold">{formatRevenue(promoter?.financial_metrics?.total_revenue)}</div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
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
                  <div className="text-2xl font-bold">{formatRevenue(analytics.businessMetrics?.revenue_performance?.avg_event_revenue)}</div>
                  <p className="text-xs text-muted-foreground">Avg Event Revenue</p>
                </div>
              </CardContent>
            </Card>
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
                  <p className="text-xs text-muted-foreground">Market Position</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!hasFullAnalytics}>
              Analytics {!hasFullAnalytics && '(Unavailable)'}
            </TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
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
                      <span className="text-sm">Location</span>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Instagram</span>
                      <span className="text-sm font-medium">{promoter?.contact_info?.instagram_link || 'Not Available'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="venues" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Top Venues */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Top Venues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {venueAnalytics.length > 0 ? (
                      venueAnalytics.slice(0, 10).map((venue, index) => (
                        <div key={venue.venue_id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <Link 
                            to={`/venues/${venue.venue_id}`}
                            className="text-sm hover:text-primary transition-colors"
                          >
                            {venue.venue_name} - {venue.city}
                          </Link>
                          <div className="text-sm font-medium">{venue.event_count} events</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No venue data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {hasFullAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Genre Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Genre Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {genreAnalytics.slice(0, 5).map((genre, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{genre.genre}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{genre.event_count} events</div>
                            <div className="text-xs text-muted-foreground">{formatDecimalPercentage(genre.percentage)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Metrics Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Revenue Growth Rate</span>
                        <span className="text-sm font-medium">{formatScore(analytics.businessMetrics?.revenue_performance?.revenue_growth_rate)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Share</span>
                        <span className="text-sm font-medium">{formatScore(analytics.businessMetrics?.market_metrics?.market_share)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Brand Recognition</span>
                        <span className="text-sm font-medium">{formatScore(analytics.businessMetrics?.market_metrics?.brand_recognition_score)}</span>
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
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.success_rate)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Artist Retention Rate</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.artist_retention_rate)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Venue Loyalty Score</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.venue_loyalty_score)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Reputation</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.performance_metrics?.market_reputation)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Revenue</span>
                      <span className="text-sm font-medium">{formatRevenue(promoter?.financial_metrics?.total_revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Event Revenue</span>
                      <span className="text-sm font-medium">{formatRevenue(promoter?.financial_metrics?.avg_event_revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenue Growth Rate</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.financial_metrics?.revenue_growth_rate)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Margin</span>
                      <span className="text-sm font-medium">{formatScore(promoter?.financial_metrics?.profit_margin)}%</span>
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

export default PromoterDetail;
