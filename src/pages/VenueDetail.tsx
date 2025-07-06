
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockVenues, mockEvents } from "@/data/mockData";
import { ArrowLeft, MapPin, Users, Star, Building2, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UpcomingEventsCard from "@/components/shared/UpcomingEventsCard";
import { EnhancedCalendar } from "@/components/shared/EnhancedCalendar";

const VenueDetail = () => {
  const { id } = useParams();
  
  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockVenues.find(v => v.id === id);
    },
  });

  const { data: venueEvents } = useQuery({
    queryKey: ['venue-events', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockEvents.filter(event => event.venue === venue?.name);
    },
    enabled: !!venue,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Venue...</h1>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Venue Not Found</h1>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const utilizationRate = ((venue.events / 365) * 100);
  const avgRevenuePerEvent = venue.revenue / venue.events;

  // Calculate top performers (artists who performed most at this venue)
  const artistPerformances = venueEvents?.reduce((acc, event) => {
    event.artists.forEach(artist => {
      acc[artist.name] = (acc[artist.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>) || {};

  const topPerformers = Object.entries(artistPerformances)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate top promoters
  const promoterCounts = venueEvents?.reduce((acc, event) => {
    acc[event.promoter] = (acc[event.promoter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topPromoters = Object.entries(promoterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const recentEvents = venueEvents?.slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Compact Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/venues" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Venues
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">{venue.type}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{venue.rating}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">{venue.name}</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{venue.city}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Venue Overview (70%) */}
          <div className="lg:col-span-7">
            <Card className="h-[480px] relative overflow-hidden">
              {/* Background Image with Overlay */}
              {venue.image && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    className="w-full h-full object-cover opacity-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
              )}
              
              {/* Content */}
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg">Venue Overview</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="text-lg font-bold font-manrope">{venue.capacity.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-xs text-muted-foreground">Total Events</p>
                    <p className="text-lg font-bold font-manrope">{venue.events}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Building2 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-xs text-muted-foreground">Utilization Rate</p>
                    <p className="text-lg font-bold font-manrope">{utilizationRate.toFixed(1)}%</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-bold font-manrope">{formatCurrency(venue.revenue)}</p>
                  </div>
                </div>

                {/* Top Performers Section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Top Performers</h4>
                  <div className="space-y-2">
                    {topPerformers.length > 0 ? (
                      topPerformers.map(([artistName, count], index) => (
                        <div key={artistName} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{index + 1}. {artistName}</span>
                          <span className="text-muted-foreground">{count} show{count !== 1 ? 's' : ''}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No performance data available</p>
                    )}
                  </div>
                </div>

                {/* Top Promoters Section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Top Promoters</h4>
                  <div className="space-y-2">
                    {topPromoters.length > 0 ? (
                      topPromoters.map(([promoterName, count], index) => (
                        <div key={promoterName} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{index + 1}. {promoterName}</span>
                          <span className="text-muted-foreground">{count} event{count !== 1 ? 's' : ''}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No promoter data available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Recent Events */}
            <UpcomingEventsCard 
              events={recentEvents} 
              title="Recent Events"
              maxEvents={5}
            />

            {/* Venue Information - Simple Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Venue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{venue.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-semibold">{venue.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-semibold">{venue.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Revenue/Event:</span>
                    <span className="font-semibold">{formatCurrency(avgRevenuePerEvent)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calendar Section */}
        <EnhancedCalendar 
          events={venueEvents || []} 
          title="Event Calendar"
          entityType="venue"
        />
      </div>
    </div>
  );
};

export default VenueDetail;
