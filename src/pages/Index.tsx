import { useQuery } from "@tanstack/react-query";
import { marketData, providerData, revenueChartData, genreDistribution } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Calendar, Users, Activity } from "lucide-react";

const Index = () => {
  // Simulate data fetching with React Query
  const { data: market } = useQuery({
    queryKey: ['market-data'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return marketData;
    },
  });

  const { data: providers } = useQuery({
    queryKey: ['provider-data'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return providerData;
    },
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return revenueChartData;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6 max-w-full xl:px-4">
      {/* Hero Section - Enhanced spacing */}
      <div className="hero">
        <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 font-manrope">
          Entertainment Intelligence Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive insights into the entertainment industry ecosystem
        </p>
      </div>

      {/* Market Overview KPIs - Modern grid spacing */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        <Card className="kpi-card-blue animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-blue-100 text-xs font-medium mb-3">Total Market Size</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  {market ? formatCurrency(market.totalMarketSize) : "Loading..."}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-green animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-emerald-100 text-xs font-medium mb-3">Revenue Generated</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  {market ? formatCurrency(market.revenueGenerated) : "Loading..."}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-purple animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-purple-100 text-xs font-medium mb-3">Market Opportunity</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  {market ? formatCurrency(market.marketOpportunity) : "Loading..."}
                </p>
              </div>
              <Activity className="h-6 w-6 text-purple-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-orange animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-orange-100 text-xs font-medium mb-3">Active Events</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  {market ? formatNumber(market.activeEvents) : "Loading..."}
                </p>
              </div>
              <Calendar className="h-6 w-6 text-orange-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-blue animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-blue-100 text-xs font-medium mb-3">Growth Rate</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  +12.5%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card-green animate-scale-in hover-lift min-h-[120px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <p className="text-emerald-100 text-xs font-medium mb-3">Active Users</p>
                <p className="text-xl font-semibold text-white font-manrope leading-tight">
                  2.4M
                </p>
              </div>
              <Users className="h-6 w-6 text-emerald-200 flex-shrink-0 ml-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Layout for Charts - Enhanced spacing */}
      <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-8 space-y-6 lg:space-y-0">
        {/* Left Column - Charts */}
        <div className="space-y-6">
          {/* Revenue Trends */}
          <Card className="media-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-base font-medium">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Revenue Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `$${value / 1000000}M`} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      labelStyle={{ color: '#1a1a18', fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Genre Distribution */}
          <Card className="media-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-base font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span>Genre Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {genreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Provider Distribution */}
        <div className="space-y-6">
          <Card className="media-card animate-fade-in h-fit">
            <CardHeader>
              <CardTitle className="text-base font-medium">Provider Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {providers?.map((provider, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 hover-scale">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-2 h-2 rounded-full ${provider.color}`}></div>
                      <span className="text-base font-semibold font-manrope">{provider.count}</span>
                    </div>
                    <h3 className="font-medium text-foreground text-sm mb-2">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">{provider.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status - Enhanced spacing */}
          <Card className="media-card animate-fade-in border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground text-sm mb-1">System Status: Online</h3>
                  <p className="text-xs text-muted-foreground truncate">All systems operational. Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
