
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mockPromoters } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, MapPin, DollarSign, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel from "@/components/shared/UniversalFilterPanel";
import type { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";

const Promoters = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    sortBy: 'eventCount',
    cities: [],
    specialties: [],
  });

  const { data: promoters, isLoading } = useQuery({
    queryKey: ['promoters'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPromoters;
    },
  });

  const cities = [...new Set(promoters?.map(promoter => promoter.city) || [])];
  const specialties = [...new Set(promoters?.map(promoter => promoter.specialty) || [])];

  const filteredPromoters = promoters?.filter(promoter => {
    const searchTerm = (filters.search as string) || '';
    const matchesSearch = searchTerm === '' || 
                         promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promoter.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promoter.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = (filters.cities as string[]).length === 0 || 
                       (filters.cities as string[]).includes(promoter.city);
    
    const matchesSpecialty = (filters.specialties as string[]).length === 0 || 
                            (filters.specialties as string[]).includes(promoter.specialty);

    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const sortedPromoters = filteredPromoters?.sort((a, b) => {
    switch (filters.sortBy) {
      case "eventCount":
        return b.eventsCount - a.eventsCount;
      case "revenue":
        return b.revenue - a.revenue;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const filterSections: FilterSection[] = [
    {
      key: "search",
      title: "Search",
      type: "search",
      placeholder: "Search promoters...",
      icon: "search",
      collapsible: false,
    },
    {
      key: "sortBy",
      title: "Sort By",
      type: "radio",
      icon: "building",
      options: [
        { value: "eventCount", label: "Most Active (Event Count)" },
        { value: "revenue", label: "Highest Revenue" },
        { value: "rating", label: "Highest Rating" },
        { value: "name", label: "Alphabetical" },
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
        count: promoters?.filter(p => p.city === city).length || 0,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "specialties",
      title: "Specialties",
      type: "checkbox",
      icon: "music",
      options: specialties.map(specialty => ({
        value: specialty,
        label: specialty,
        count: promoters?.filter(p => p.specialty === specialty).length || 0,
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

  const handleFiltersChange = (newFilters: UniversalFilterState) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Promoters" 
          subtitle="Loading promoters..." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <PageHeader 
        title="Promoters" 
        subtitle="Event promoters database with performance analytics" 
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
            <Users className="h-4 w-4 mr-2" />
            Promoters List
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
                  {sortedPromoters?.length || 0} promoters found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPromoters?.map((promoter) => (
                  <Link key={promoter.id} to={`/promoters/${promoter.id}`}>
                    <Card className="media-card hover-lift cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-xs">{promoter.specialty}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{promoter.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold leading-tight">{promoter.name}</CardTitle>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{promoter.city}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Events</p>
                            <p className="font-bold text-lg font-manrope">{promoter.eventsCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="font-bold text-sm font-manrope text-green-600">
                              {formatCurrency(promoter.revenue)}
                            </p>
                          </div>
                        </div>

                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min((promoter.eventsCount / 1500) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Activity Level</p>
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
                        <p className="text-blue-100 text-sm font-medium">Total Promoters</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {promoters?.length || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="kpi-card-green animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">Total Events</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {promoters?.reduce((sum, promoter) => sum + promoter.eventsCount, 0) || 0}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-emerald-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="kpi-card-purple animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {formatCurrency(promoters?.reduce((sum, promoter) => sum + promoter.revenue, 0) || 0).replace('$', '$').slice(0, 5)}M
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="kpi-card-orange animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Avg Rating</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {(promoters?.reduce((sum, promoter) => sum + promoter.rating, 0) / (promoters?.length || 1)).toFixed(1)}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card className="media-card">
                <CardHeader>
                  <CardTitle>Promoter Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={promoters}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Promoters;
