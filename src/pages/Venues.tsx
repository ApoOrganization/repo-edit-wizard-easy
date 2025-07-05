
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockVenues } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, BarChart3, MapPin, Users, DollarSign, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel from "@/components/shared/UniversalFilterPanel";
import type { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";

const Venues = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    capacityRange: [],
    cities: [],
    priceTiers: [],
    venueTypes: [],
  });

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockVenues.map(venue => ({
        ...venue,
        avgPrice: Math.floor(Math.random() * 200) + 25
      }));
    },
  });

  const cities = [...new Set(venues?.map(venue => venue.city) || [])];
  const venueTypes = [...new Set(venues?.map(venue => venue.type) || [])];

  const filteredVenues = venues?.filter(venue => {
    const searchTerm = (filters.search as string) || '';
    const matchesSearch = searchTerm === '' || 
                         venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = (filters.capacityRange as string[]).length === 0 || 
      (filters.capacityRange as string[]).some(range => {
        switch (range) {
          case 'small': return venue.capacity < 1000;
          case 'medium': return venue.capacity >= 1000 && venue.capacity <= 10000;
          case 'large': return venue.capacity > 10000;
          default: return true;
        }
      });
    
    const matchesCity = (filters.cities as string[]).length === 0 || 
                       (filters.cities as string[]).includes(venue.city);
    
    const avgPrice = venue.avgPrice || 75;
    const matchesPriceTier = (filters.priceTiers as string[]).length === 0 ||
      (filters.priceTiers as string[]).some(tier => {
        switch (tier) {
          case 'budget': return avgPrice < 50;
          case 'mid': return avgPrice >= 50 && avgPrice <= 150;
          case 'premium': return avgPrice > 150;
          default: return true;
        }
      });
    
    const matchesType = (filters.venueTypes as string[]).length === 0 || 
                       (filters.venueTypes as string[]).includes(venue.type);
    
    return matchesSearch && matchesCapacity && matchesCity && matchesPriceTier && matchesType;
  });

  const filterSections: FilterSection[] = [
    {
      key: "search",
      title: "Search",
      type: "search",
      placeholder: "Search venues...",
      icon: "search",
      collapsible: false,
    },
    {
      key: "capacityRange",
      title: "Capacity",
      type: "checkbox",
      icon: "users",
      options: [
        { value: "small", label: "Under 1,000", count: venues?.filter(v => v.capacity < 1000).length || 0 },
        { value: "medium", label: "1,000 - 10,000", count: venues?.filter(v => v.capacity >= 1000 && v.capacity <= 10000).length || 0 },
        { value: "large", label: "Over 10,000", count: venues?.filter(v => v.capacity > 10000).length || 0 },
      ],
      collapsible: false,
    },
    {
      key: "cities",
      title: "Cities",
      type: "checkbox",
      icon: "location",
      options: cities.map(city => ({
        value: city,
        label: city,
        count: venues?.filter(v => v.city === city).length || 0,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "priceTiers",
      title: "Price Tiers",
      type: "checkbox",
      icon: "money",
      options: [
        { value: "budget", label: "Budget (Under $50 avg)", count: venues?.filter(v => (v.avgPrice || 75) < 50).length || 0 },
        { value: "mid", label: "Mid-tier ($50-$150 avg)", count: venues?.filter(v => {
          const price = v.avgPrice || 75;
          return price >= 50 && price <= 150;
        }).length || 0 },
        { value: "premium", label: "Premium (Over $150 avg)", count: venues?.filter(v => (v.avgPrice || 75) > 150).length || 0 },
      ],
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "venueTypes",
      title: "Venue Types",
      type: "checkbox",
      icon: "building",
      options: venueTypes.map(type => ({
        value: type,
        label: type,
        count: venues?.filter(v => v.type === type).length || 0,
      })),
      collapsible: true,
      defaultOpen: false,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTierLabel = (avgPrice: number) => {
    if (avgPrice < 50) return 'Budget';
    if (avgPrice < 150) return 'Mid-tier';
    return 'Premium';
  };

  const getTierVariant = (avgPrice: number): "default" | "secondary" | "destructive" => {
    if (avgPrice < 50) return 'secondary';
    if (avgPrice < 150) return 'default';
    return 'destructive';
  };

  const handleFiltersChange = (newFilters: UniversalFilterState) => {
    setFilters(newFilters);
  };

  // Mock analytics data
  const capacityDistribution = [
    { range: '0-5K', count: 25, color: '#3B82F6' },
    { range: '5K-15K', count: 35, color: '#10B981' },
    { range: '15K-30K', count: 20, color: '#8B5CF6' },
    { range: '30K+', count: 10, color: '#F59E0B' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Venues" 
          subtitle="Loading venues..." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <PageHeader 
        title="Venues" 
        subtitle="Comprehensive venue database with performance analytics and capacity insights" 
      />

      {/* Tab Navigation */}
      <div className="px-8 py-6 border-b border-border">
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('list')}
            className="rounded-full px-4"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Venues List
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('analytics')}
            className="rounded-full px-4"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="flex">
        {activeTab === 'list' && (
          <div className="px-8 py-6">
            <UniversalFilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              sections={filterSections}
            />
          </div>
        )}
        
        <div className="flex-1 px-8 py-6">
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredVenues?.length || 0} venues found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues?.map((venue) => (
                  <Link key={venue.id} to={`/venues/${venue.id}`}>
                    <Card className="media-card hover-lift h-full cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="text-xs" variant={getTierVariant(venue.avgPrice || 75)}>
                            {getTierLabel(venue.avgPrice || 75)}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{venue.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold leading-tight">{venue.name}</CardTitle>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{venue.city}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{venue.type}</span>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Capacity</p>
                            <p className="font-bold text-lg font-manrope">{venue.capacity.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Avg Price</p>
                            <p className="font-bold text-lg font-manrope">${venue.avgPrice || 75}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Revenue</span>
                            <span className="font-bold text-green-600 font-manrope text-sm">
                              {formatCurrency(venue.revenue)}
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min((venue.events / 300) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Event Utilization</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="kpi-card-blue animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Venues</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {venues?.length || 0}
                        </p>
                      </div>
                      <Building2 className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="kpi-card-green animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">Total Events</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {venues?.reduce((sum, venue) => sum + venue.events, 0) || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-emerald-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="kpi-card-purple animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Total Capacity</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {((venues?.reduce((sum, venue) => sum + venue.capacity, 0) || 0) / 1000).toFixed(0)}K
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
                        <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {formatCurrency(venues?.reduce((sum, venue) => sum + venue.revenue, 0) || 0).replace('$', '$').slice(0, 4)}M
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="media-card">
                  <CardHeader>
                    <CardTitle>Venue Types Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={capacityDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ range, count }) => `${range}: ${count}`}
                          >
                            {capacityDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="media-card">
                  <CardHeader>
                    <CardTitle>Revenue by Venue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={venues?.slice(0, 4)}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                          <Tooltip formatter={(value: any) => [formatCurrency(value), 'Revenue']} />
                          <Bar dataKey="revenue" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
