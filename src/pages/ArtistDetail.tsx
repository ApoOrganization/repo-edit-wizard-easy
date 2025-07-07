import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Instagram, Music, Mail, ExternalLink, Globe, Twitter, Facebook, Youtube, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArtistAnalytics, useArtistUpcomingEvents, useArtistPastEvents } from "@/hooks/useArtistAnalytics";
import { formatNumber, formatPercentage, formatCurrency, formatScore, formatDecimalPercentage, formatSimilarityScore, formatDayOfWeek, getPrimaryGenre } from "@/utils/formatters";

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
  const comparisons = analyticsData?.comparisons || [];
  const upcomingEvents = upcomingEventsData?.events || [];
  const pastEvents = pastEventsData?.events || [];
  const allEvents = [...upcomingEvents, ...pastEvents];

  // Helper functions
  const renderGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };
  
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-3 w-3" />;
      case 'twitter': return <Twitter className="h-3 w-3" />;
      case 'facebook': return <Facebook className="h-3 w-3" />;
      case 'youtube': return <Youtube className="h-3 w-3" />;
      case 'website': return <Globe className="h-3 w-3" />;
      default: return <ExternalLink className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Artist...</h1>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Artist Not Found</h1>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Unable to load artist data'}
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatNumber(artist?.monthly_listeners)}</div>
                <p className="text-xs text-muted-foreground">Monthly Listeners</p>
              </div>
            </CardContent>
          </Card>
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(artist?.event_stats?.avg_ticket_price)}</div>
                <p className="text-xs text-muted-foreground">Avg Ticket Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        {analytics && (
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

        {/* Growth Trends */}
        {analytics?.growth && (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="similar">Similar Artists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Cities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Top Performance Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {artist?.performance_cities?.slice(0, 5).map((city, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-sm">{city.city_name}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{city.event_count} events</div>
                          <div className="text-xs text-muted-foreground">{formatNumber(city.avg_attendance)} avg attendance</div>
                        </div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No city data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Venues */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Favorite Venues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {artist?.favorite_venues?.slice(0, 5).map((venue, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div>
                          <div className="text-sm font-medium">{venue.venue_name}</div>
                          <div className="text-xs text-muted-foreground">{venue.city}</div>
                        </div>
                        <div className="text-sm font-medium">{venue.performance_count}</div>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No venue data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Genre Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Genre Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {artist?.genre_distribution?.map((genre, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-sm">{genre.genre}</span>
                        <span className="text-sm font-medium">{formatDecimalPercentage(genre.percentage)}</span>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No genre data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Contact & Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Booking Emails */}
                    {artist?.booking_emails && artist.booking_emails.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Booking</h4>
                        <div className="space-y-1">
                          {artist.booking_emails.map((email, index) => (
                            <Button key={index} variant="outline" size="sm" className="h-auto p-2" asChild>
                              <a href={`mailto:${email}`} className="text-xs">{email}</a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Social Links */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Social Media</h4>
                      <div className="flex gap-2 flex-wrap">
                        {artist?.social_presence && Object.entries(artist.social_presence).map(([platform, url]) => (
                          <Button key={platform} size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              {renderSocialIcon(platform)}
                            </a>
                          </Button>
                        ))}
                        {artist?.spotify_link && (
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                            <a href={artist.spotify_link} target="_blank" rel="noopener noreferrer">
                              <Music className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
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
                      upcomingEvents.map((event) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{event.venue_name}, {event.city}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          {event.ticket_price && (
                            <div className="text-xs font-medium">{formatCurrency(event.ticket_price)}</div>
                          )}
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
                      pastEvents.map((event) => (
                        <div key={event.event_id} className="p-3 border border-border rounded-md">
                          <div className="font-medium text-sm">{event.event_name}</div>
                          <div className="text-xs text-muted-foreground">{event.venue_name}, {event.city}</div>
                          <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                          {event.attendance && (
                            <div className="text-xs font-medium">{formatNumber(event.attendance)} attendance</div>
                          )}
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
          </TabsContent>

          <TabsContent value="similar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Similar Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparisons.length > 0 ? (
                    comparisons.map((comparison) => (
                      <div key={comparison.artist_id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
                        <Link to={`/artists/${comparison.artist_id}`} className="block">
                          <div className="font-medium text-sm mb-1">{comparison.artist_name}</div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {formatSimilarityScore(comparison.similarity_score)} similarity
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs">{formatNumber(comparison.monthly_listeners)} listeners</div>
                            <div className="text-xs">{comparison.total_events} events</div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-full">No similar artists found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDetail;