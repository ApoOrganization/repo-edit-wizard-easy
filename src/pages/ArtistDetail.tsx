import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Instagram, Music, Mail, ExternalLink, Globe, Twitter, Facebook, Youtube, TrendingUp, TrendingDown, Minus, BookOpen, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArtistAnalytics, useArtistUpcomingEvents, useArtistPastEvents, useIsAnalyticsFallback, useIsAnalyticsError } from "@/hooks/useArtistAnalytics";
import { formatNumber, formatPercentage, formatCurrency, formatScore, formatDecimalPercentage, formatSimilarityScore, formatDayOfWeek, getPrimaryGenre, parseBookingEmails } from "@/utils/formatters";
import { ArtistCalendarView } from "@/components/artist/ArtistCalendarView";

const ArtistDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Main analytics data
  const {
    data: analyticsData,
    isLoading,
    error
  } = useArtistAnalytics(id);
  
  // Events data (lazy loaded based on tab)
  const { data: upcomingEventsData } = useArtistUpcomingEvents(id, activeTab === 'events');
  const { data: pastEventsData } = useArtistPastEvents(id, activeTab === 'events');

  // Destructure analytics data
  const artist = analyticsData?.artist;
  const analytics = analyticsData?.analytics;
  const insights = analyticsData?.insights || [];
  const upcomingEvents = upcomingEventsData?.events || [];
  const pastEvents = pastEventsData?.events || [];
  const allEvents = [...upcomingEvents, ...pastEvents];
  
  // Check data status
  const isFallbackData = useIsAnalyticsFallback(analyticsData);
  const isErrorState = useIsAnalyticsError(analyticsData);
  const hasMeaningfulAnalytics = !isFallbackData && !isErrorState && analytics && (
    analytics.diversityScore > 0 || 
    analytics.touringIntensity > 0 || 
    analytics.marketPenetration > 0 ||
    (analytics.growth && (
      analytics.growth.listener_growth_rate !== 0 || 
      analytics.growth.event_growth_rate !== 0 || 
      analytics.growth.venue_diversity_trend !== 0
    ))
  );
  const hasFullAnalytics = !isFallbackData && !isErrorState && analytics;
  
  console.log('🎭 Artist Detail Status:', {
    artistId: id,
    artistName: artist?.name,
    isFallbackData,
    isErrorState,
    hasFullAnalytics,
    hasMeaningfulAnalytics,
  });

  // Helper functions
  const renderGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };
  
  const getSocialButtonStyles = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-none';
      case 'twitter': return 'bg-blue-500 text-white hover:bg-blue-600 border-none';
      case 'facebook': return 'bg-blue-600 text-white hover:bg-blue-700 border-none';
      case 'youtube': return 'bg-red-600 text-white hover:bg-red-700 border-none';
      case 'spotify': return 'bg-green-500 text-white hover:bg-green-600 border-none';
      case 'soundcloud': return 'bg-orange-500 text-white hover:bg-orange-600 border-none';
      case 'apple_music': return 'bg-gray-900 text-white hover:bg-black border-none';
      case 'wikipedia': return 'bg-gray-600 text-white hover:bg-gray-700 border-none';
      case 'website': return 'border-border bg-background hover:bg-accent hover:text-accent-foreground';
      default: return 'border-border bg-background hover:bg-accent hover:text-accent-foreground';
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'website': return <Globe className="h-5 w-5" />;
      case 'wikipedia': return <BookOpen className="h-5 w-5" />;
      case 'soundcloud': return <Volume2 className="h-5 w-5" />;
      case 'apple_music': return <Music className="h-5 w-5" />;
      case 'spotify': return <Music className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
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

  if (error || !artist) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-6">
          <div className="py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4 font-manrope">
              {isErrorState ? 'Data Temporarily Unavailable' : 'Artist Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isErrorState 
                ? 'We are experiencing technical difficulties. Please try again later.' 
                : error instanceof Error ? error.message : 'Unable to load artist data'
              }
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link to="/artists">Back to Artists</Link>
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
          <Link to="/artists" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Artists
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground font-manrope">{artist?.name}</h1>
            <Badge variant="secondary" className="text-xs">
              {getPrimaryGenre(artist?.genres)}
            </Badge>
            {artist?.agency && (
              <Badge variant="outline" className="text-xs">
                {artist.agency}
              </Badge>
            )}
            {artist?.description && (
              <Badge variant="outline" className="text-xs">
                Agent: {artist.description}
              </Badge>
            )}
            {artist?.territory && (
              <Badge variant="outline" className="text-xs">
                {artist.territory}
              </Badge>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {artist?.monthly_listeners && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(artist.monthly_listeners)}</div>
                  <p className="text-xs text-muted-foreground">Monthly Listeners</p>
                </div>
              </CardContent>
            </Card>
          )}
          {artist?.followers && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatNumber(artist.followers)}</div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{artist?.event_stats?.total_events || 0}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{artist?.performance_cities?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Cities</p>
              </div>
            </CardContent>
          </Card>
          {artist?.pricing_analytics?.avg_ticket_price && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(artist.pricing_analytics.avg_ticket_price, '₺')}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Ticket Price</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Analytics - Only show with meaningful analytics data */}
        {hasMeaningfulAnalytics && (
          analytics.diversityScore > 0 || 
          analytics.touringIntensity > 0 || 
          analytics.marketPenetration > 0
        ) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatScore(analytics.diversityScore)}</div>
                  <p className="text-xs text-muted-foreground">Diversity Score</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatScore(analytics.touringIntensity)}</div>
                  <p className="text-xs text-muted-foreground">Touring Intensity</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatScore(analytics.marketPenetration)}</div>
                  <p className="text-xs text-muted-foreground">Market Penetration</p>
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
                  📊 Advanced analytics temporarily unavailable. Showing basic artist information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Growth Trends - Only show with meaningful growth data */}
        {hasMeaningfulAnalytics && analytics?.growth && (
          analytics.growth.listener_growth_rate !== 0 || 
          analytics.growth.event_growth_rate !== 0 || 
          analytics.growth.venue_diversity_trend !== 0
        ) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <span className="text-sm">Listener Growth</span>
                  <div className="flex items-center gap-2">
                    {renderGrowthIcon(analytics.growth.listener_growth_rate)}
                    <span className="text-sm font-medium">{formatPercentage(analytics.growth.listener_growth_rate)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <span className="text-sm">Event Growth</span>
                  <div className="flex items-center gap-2">
                    {renderGrowthIcon(analytics.growth.event_growth_rate)}
                    <span className="text-sm font-medium">{formatPercentage(analytics.growth.event_growth_rate)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <span className="text-sm">Venue Diversity</span>
                  <div className="flex items-center gap-2">
                    {renderGrowthIcon(analytics.growth.venue_diversity_trend)}
                    <span className="text-sm font-medium">{formatPercentage(analytics.growth.venue_diversity_trend)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">{insight.type}</Badge>
                      <p className="text-sm text-muted-foreground flex-1">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!hasMeaningfulAnalytics}>
              Analytics {!hasMeaningfulAnalytics && '(Unavailable)'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Cities */}
              {artist?.performance_cities && artist.performance_cities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Top Performance Cities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {artist.performance_cities.slice(0, 5).map((city, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-sm">{city.city_name}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{city.event_count} events</div>
                            <div className="text-xs text-muted-foreground">{formatNumber(city.avg_attendance)} avg attendance</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Favorite Venues */}
              {artist?.favorite_venues && artist.favorite_venues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Favorite Venues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {artist.favorite_venues.slice(0, 5).map((venue, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <div>
                            <div className="text-sm font-medium">{venue.venue_name}</div>
                            <div className="text-xs text-muted-foreground">{venue.city}</div>
                          </div>
                          <div className="text-sm font-medium">{venue.performance_count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Cities by Listeners */}
              {artist?.top_cities && artist.top_cities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Top Cities by Listeners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {artist.top_cities.slice(0, 5).map((city, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-sm">{city.city}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatNumber(city.listeners)} listeners</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Genre Distribution */}
              {artist?.genre_distribution && artist.genre_distribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Genre Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {artist.genre_distribution.map((genre, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{genre.genre}</span>
                          <span className="text-sm font-medium">{formatDecimalPercentage(genre.percentage)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pricing Analytics */}
              {artist?.pricing_analytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Pricing Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">Average Price</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(artist.pricing_analytics.avg_ticket_price, '₺')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">Price Range</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(artist.pricing_analytics.min_ticket_price, '₺')} - {formatCurrency(artist.pricing_analytics.max_ticket_price, '₺')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm">Typical Range</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(artist.pricing_analytics.typical_price_range.low, '₺')} - {formatCurrency(artist.pricing_analytics.typical_price_range.high, '₺')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Contact & Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Booking Emails */}
                    {(() => {
                      const bookingEmails = parseBookingEmails(artist?.booking_emails);
                      return bookingEmails.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Booking</h4>
                          <div className="space-y-1">
                            {bookingEmails.map((email, index) => (
                              <Button key={index} variant="outline" size="sm" className="h-auto p-2" asChild>
                                <a href={`mailto:${email}`} className="text-xs">{email}</a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* Social Links */}
                    {(() => {
                      // Combine all social links from different sources
                      const allSocialLinks = [];
                      
                      // Add legacy social_presence links
                      if (artist?.social_presence) {
                        Object.entries(artist.social_presence).forEach(([platform, url]) => {
                          if (url) allSocialLinks.push({ platform, url });
                        });
                      }
                      
                      // Add new social_links
                      if (artist?.social_links) {
                        Object.entries(artist.social_links).forEach(([platform, url]) => {
                          if (url) allSocialLinks.push({ platform, url });
                        });
                      }
                      
                      // Add spotify link
                      if (artist?.spotify_link) {
                        allSocialLinks.push({ platform: 'spotify', url: artist.spotify_link });
                      }
                      
                      return allSocialLinks.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Social Media</h4>
                          <div className="flex gap-2 flex-wrap">
                            {allSocialLinks.map(({ platform, url }, index) => (
                              <Button 
                                key={`${platform}-${index}`} 
                                size="sm" 
                                className={`h-10 w-10 p-0 transition-all duration-200 ${getSocialButtonStyles(platform)}`} 
                                asChild
                              >
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  {renderSocialIcon(platform)}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {upcomingEvents.map((event) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{event.venue_name}, {event.city}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          {event.ticket_price && (
                            <div className="text-xs font-medium">{formatCurrency(event.ticket_price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Recent Past Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pastEvents.map((event) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{event.venue_name}, {event.city}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          {event.attendance && (
                            <div className="text-xs font-medium">{formatNumber(event.attendance)} attendance</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {hasMeaningfulAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Day of Week Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Day of Week Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {artist?.day_of_week_preferences?.map((day, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{formatDayOfWeek(day.day)}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium">{day.event_count} events</div>
                            <div className="text-xs text-muted-foreground">{formatDecimalPercentage(day.percentage)}</div>
                          </div>
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No analytics data available</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      📊 Advanced analytics are temporarily unavailable for this artist.
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

        </Tabs>

        {/* Event Calendar Section */}
        <div className="mt-8">
          <ArtistCalendarView 
            artistId={id || ''}
            artistName={artist?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;