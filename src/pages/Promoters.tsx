
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, MapPin, DollarSign, Star, Loader2, Building2, Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "@/components/shared/PageHeader";
import UniversalFilterPanel from "@/components/shared/UniversalFilterPanel";
import type { FilterSection, UniversalFilterState } from "@/components/shared/UniversalFilterPanel";
import { useTransformedPromoters, usePromoterFilterOptions, formatRevenue, getPromoterSpecialtyBadgeVariant } from "@/hooks/usePromoters";
import { PromoterSearchParams } from "@/types/promoter.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

const Promoters = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState<UniversalFilterState>({
    search: '',
    sortBy: 'total_events',
    cities: [],
    activityStatuses: [],
    scaleTiers: [],
  });

  // Convert filters to search params
  const [searchParams, setSearchParams] = useState<PromoterSearchParams>({
    searchTerm: '',
    sortBy: 'total_events',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  // Sync filters with search params
  useEffect(() => {
    setSearchParams(prev => ({
      searchTerm: (filters.search as string) || '',
      cities: (filters.cities as string[]).length > 0 ? (filters.cities as string[]) : undefined,
      activityStatuses: (filters.activityStatuses as string[]).length > 0 ? (filters.activityStatuses as string[]) : undefined,
      scaleTiers: (filters.scaleTiers as string[]).length > 0 ? (filters.scaleTiers as string[]) : undefined,
      sortBy: filters.sortBy as string || 'total_events',
      sortOrder: 'desc',
      page: 1, // Reset to page 1 when filters change
      limit: prev.limit || 20
    }));
  }, [filters]);

  // Fetch promoters data
  const { data: promotersResponse, isLoading, error } = useTransformedPromoters(searchParams);
  const { data: filterOptions } = usePromoterFilterOptions();

  // Extract promoters and pagination from response
  const promoters = promotersResponse?.promoters || [];
  const pagination = promotersResponse?.pagination;

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
        { value: "total_events", label: "Most Active (Event Count)" },
        { value: "total_revenue", label: "Highest Revenue" },
        { value: "venues_used", label: "Most Venues Used" },
        { value: "name", label: "Alphabetical" },
      ],
      collapsible: false,
    },
    {
      key: "cities",
      title: "Cities",
      type: "checkbox",
      icon: "location",
      options: (filterOptions?.cities || []).map(city => ({
        value: city,
        label: city,
        count: promoters?.filter(p => p.city === city).length || 0,
      })),
      collapsible: true,
      defaultOpen: true,
    },
    {
      key: "activityStatuses",
      title: "Activity Status",
      type: "checkbox",
      icon: "users",
      options: (filterOptions?.activityStatuses || []).map(status => ({
        value: status,
        label: status,
        count: promoters?.filter(p => p.specialty?.includes(status)).length || 0,
      })),
      collapsible: true,
      defaultOpen: false,
    },
    {
      key: "scaleTiers",
      title: "Scale Tier",
      type: "checkbox",
      icon: "building",
      options: (filterOptions?.scaleTiers || []).map(tier => ({
        value: tier,
        label: tier,
        count: promoters?.filter(p => p.specialty?.includes(tier)).length || 0,
      })),
      collapsible: true,
      defaultOpen: false,
    },
  ];

  // Use the imported formatRevenue function instead
  // const formatCurrency function is replaced by formatRevenue from usePromoters

  const handleFiltersChange = (newFilters: UniversalFilterState) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Promoters" 
          subtitle="Loading promoters..." 
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Promoters" 
          subtitle="Error loading promoters" 
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load promoters data</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
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
                  {pagination?.total || 0} promoters found{pagination?.total ? ` (showing ${promoters.length})` : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoters?.map((promoter) => (
                  <Link key={promoter.id} to={`/promoters/${promoter.id}`}>
                    <Card className="media-card hover-lift cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={getPromoterSpecialtyBadgeVariant(promoter.specialty)} className="text-xs">
                            {promoter.specialty}
                          </Badge>
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
                            <p className="text-xs text-muted-foreground">Venues Used</p>
                            <p className="font-bold text-sm font-manrope text-green-600">
                              {promoter.venuesUsed}
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

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(pagination.page - 1)}
                          className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {generatePageNumbers().map((pageNum, index) => (
                        <PaginationItem key={index}>
                          {pageNum === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum as number)}
                              isActive={pageNum === pagination.page}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(pagination.page + 1)}
                          className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
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
                        <p className="text-purple-100 text-sm font-medium">Total Venues Used</p>
                        <p className="text-3xl font-bold text-white font-manrope">
                          {promoters?.reduce((sum, promoter) => sum + promoter.venuesUsed, 0) || 0}
                        </p>
                      </div>
                      <Building2 className="h-8 w-8 text-purple-200" />
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
                      <BarChart data={promoters?.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [value, 'Events']} />
                        <Bar dataKey="eventsCount" fill="#3B82F6" />
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
