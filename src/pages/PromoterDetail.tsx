import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockPromoters, mockEvents } from "@/data/mockData";
import { ArrowLeft, Users, Building2, TrendingUp, Calendar, DollarSign, Star, BarChart3, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UpcomingEventsCard from "@/components/shared/UpcomingEventsCard";
import { EnhancedCalendar } from "@/components/shared/EnhancedCalendar";

const PromoterDetail = () => {
  const { id } = useParams();
  
  const { data: promoter, isLoading } = useQuery({
    queryKey: ['promoter', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPromoters.find(p => p.id === id);
    },
  });

  const { data: promoterEvents } = useQuery({
    queryKey: ['promoter-events', promoter?.name],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockEvents.filter(event => event.promoter === promoter?.name);
    },
    enabled: !!promoter?.name,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Promoter...</h1>
        </div>
      </div>
    );
  }

  if (!promoter) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Promoter Not Found</h1>
        </div>
      </div>
    );
  }

  // Calculate business metrics
  const monthlyAverage = (promoter.eventsCount / 12).toFixed(1);
  const avgTicketPrice = promoterEvents?.length ? 
    (promoterEvents.reduce((sum, event) => sum + (event.revenue / event.ticketsSold), 0) / promoterEvents.length) : 0;
  const soldOutEvents = promoterEvents?.filter(event => event.status === 'Sold Out').length || 0;
  const successRate = promoterEvents?.length ? ((soldOutEvents / promoterEvents.length) * 100).toFixed(0) : 0;

  // Calculate most used venues
  const venueFrequency = promoterEvents?.reduce((acc, event) => {
    acc[event.venue] = (acc[event.venue] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  const topVenues = Object.entries(venueFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Calculate most collaborated artists
  const artistCollaborations = promoterEvents?.reduce((acc, event) => {
    event.artists.forEach(artist => {
      acc[artist.name] = (acc[artist.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>) || {};
  const topArtists = Object.entries(artistCollaborations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Calculate genre distribution
  const genreFrequency = promoterEvents?.reduce((acc, event) => {
    acc[event.genre] = (acc[event.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  const topGenres = Object.entries(genreFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const recentEvents = promoterEvents?.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Compact Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/promoters" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Promoters
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 font-manrope">{promoter.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{promoter.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{promoter.rating}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {promoter.specialty}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Promoter Overview */}
          <div className="lg:col-span-7">
            <Card className="media-card h-[480px] overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] overflow-y-auto custom-scrollbar space-y-6 pb-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Monthly Avg Events</p>
                      <p className="text-xl font-bold font-manrope truncate">{monthlyAverage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Avg Ticket Price</p>
                      <p className="text-xl font-bold font-manrope truncate">{formatCurrency(avgTicketPrice)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-xl font-bold font-manrope truncate">{formatCurrency(promoter.revenue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-orange-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-xl font-bold font-manrope">{successRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Most Used Venues */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Most Used Venues
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {topVenues.slice(0, 4).map(([venue, count]) => (
                      <div key={venue} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                        <span className="text-sm font-medium truncate flex-1 mr-2">{venue}</span>
                        <Badge variant="outline" className="text-xs flex-shrink-0">{count} events</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Collaborated Artists */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Top Artist Collaborations
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto custom-scrollbar">
                    {topArtists.slice(0, 6).map(([artist, count]) => (
                      <Badge key={artist} variant="outline" className="text-xs">
                        {artist} ({count})
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Genre Distribution */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Primary Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {topGenres.map(([genre, count]) => (
                      <Badge key={genre} className="text-xs">
                        {genre} ({count})
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Recent Events */}
            <UpcomingEventsCard 
              events={recentEvents} 
              title="Recent Events"
              maxEvents={5}
            />

            {/* Company Details - Simple Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Specialty</p>
                    <p>{promoter.specialty}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Territory</p>
                    <p>{promoter.city}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Total Events</p>
                    <p>{promoter.eventsCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Success Rate</p>
                    <p>{successRate}% events sold out</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calendar Section */}
        <EnhancedCalendar 
          events={promoterEvents || []}
          title="Event Schedule"
          entityType="promoter"
        />
      </div>
    </div>
  );
};

export default PromoterDetail;
