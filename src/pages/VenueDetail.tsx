
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockVenues, mockEvents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Users, DollarSign, Calendar, Star, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
      return mockEvents.filter(event => event.venue === venue?.name).slice(0, 5);
    },
    enabled: !!venue,
  });

  // Mock performance data
  const monthlyPerformance = [
    { month: 'Jan', events: 18, revenue: 2100000, capacity: 85 },
    { month: 'Feb', events: 15, revenue: 1800000, capacity: 78 },
    { month: 'Mar', events: 22, revenue: 2650000, capacity: 92 },
    { month: 'Apr', events: 20, revenue: 2400000, capacity: 88 },
    { month: 'May', events: 25, revenue: 3100000, capacity: 95 },
    { month: 'Jun', events: 28, revenue: 3500000, capacity: 98 },
  ];

  const genreBreakdown = [
    { genre: 'Pop', events: 45, percentage: 35 },
    { genre: 'Rock', events: 38, percentage: 30 },
    { genre: 'Hip-Hop', events: 25, percentage: 20 },
    { genre: 'Electronic', events: 19, percentage: 15 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="hero">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-manrope">Loading Venue...</h1>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="space-y-6">
        <div className="hero">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-manrope">Venue Not Found</h1>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>
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

  const utilizationRate = (venue.events / 365) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="hero">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Venues
            </Button>
            <Badge variant="outline">{venue.type}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{venue.rating}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-manrope">{venue.name}</h1>
          <div className="flex items-center text-xl text-muted-foreground">
            <MapPin className="h-5 w-5 mr-2" />
            {venue.city}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="kpi-card-blue animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white font-manrope">
                  {formatCurrency(venue.revenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-green animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-white font-manrope">
                  {venue.events}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-purple animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Capacity</p>
                <p className="text-3xl font-bold text-white font-manrope">
                  {venue.capacity.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-orange animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Utilization Rate</p>
                <p className="text-3xl font-bold text-white font-manrope">
                  {utilizationRate.toFixed(1)}%
                </p>
              </div>
              <Building2 className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Performance */}
        <Card className="media-card">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000000}M`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Events'
                    ]}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="events" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Genre Breakdown */}
        <Card className="media-card">
          <CardHeader>
            <CardTitle>Events by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genreBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="genre" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [value, 'Events']} />
                  <Bar dataKey="events" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="media-card">
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {venueEvents?.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex-1">
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.promoter}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(event.revenue)}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.ticketsSold.toLocaleString()} tickets
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Venue Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="media-card">
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{venue.rating}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City:</span>
              <span className="font-semibold">{venue.city}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="media-card">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Events:</span>
              <span className="font-semibold">{venue.events}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Revenue/Event:</span>
              <span className="font-semibold">{formatCurrency(venue.revenue / venue.events)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utilization Rate:</span>
              <span className="font-semibold">{utilizationRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="media-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              View All Events
            </Button>
            <Button className="w-full" variant="outline">
              Contact Venue
            </Button>
            <Button className="w-full" variant="outline">
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueDetail;
