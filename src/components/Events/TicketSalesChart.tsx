import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BubiletSalesHistory } from "@/hooks/useEventAnalyticsEnhanced";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface TicketSalesChartProps {
  salesHistory: BubiletSalesHistory;
  className?: string;
}

const TicketSalesChart = ({ salesHistory, className }: TicketSalesChartProps) => {
  const [viewMode, setViewMode] = useState<'count' | 'revenue'>('count');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Process data for chart
  const chartData = useMemo(() => {
    if (!salesHistory?.salesData) return [];

    // Group by date and aggregate by category
    const dataByDate = salesHistory.salesData.reduce((acc, point) => {
      const date = point.date.split('T')[0]; // Get just the date part
      
      if (!acc[date]) {
        acc[date] = {
          date,
          totalTickets: 0,
          totalRevenue: 0,
          categories: {}
        };
      }

      acc[date].totalTickets += point.ticketsSold;
      acc[date].totalRevenue += point.revenue;
      
      if (!acc[date].categories[point.category]) {
        acc[date].categories[point.category] = {
          tickets: 0,
          revenue: 0
        };
      }
      
      acc[date].categories[point.category].tickets += point.ticketsSold;
      acc[date].categories[point.category].revenue += point.revenue;

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and filter by selected category
    return Object.values(dataByDate).map((dayData: any) => {
      const formattedDate = new Date(dayData.date).toLocaleDateString('tr-TR', {
        month: 'short',
        day: 'numeric'
      });

      if (selectedCategory === 'all') {
        return {
          date: formattedDate,
          value: viewMode === 'count' ? dayData.totalTickets : dayData.totalRevenue,
          rawDate: dayData.date
        };
      } else {
        const categoryData = dayData.categories[selectedCategory] || { tickets: 0, revenue: 0 };
        return {
          date: formattedDate,
          value: viewMode === 'count' ? categoryData.tickets : categoryData.revenue,
          rawDate: dayData.date
        };
      }
    }).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
  }, [salesHistory, selectedCategory, viewMode]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {viewMode === 'count' 
              ? `${value} tickets sold`
              : formatCurrency(value, '₺')
            }
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate remaining tickets for summary
  const remainingTicketsData = useMemo(() => {
    if (!salesHistory?.summary) return null;

    const totalSold = salesHistory.summary.totalTicketsSold;
    const remaining = salesHistory.summary.remainingCapacity;
    const total = totalSold + remaining;
    const soldPercentage = total > 0 ? (totalSold / total) * 100 : 0;

    return {
      totalSold,
      remaining,
      total,
      soldPercentage
    };
  }, [salesHistory]);

  if (!salesHistory?.salesData?.length) {
    return (
      <Card className={cn("media-card h-[400px]", className)}>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("media-card h-[400px]", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ticket Sales</CardTitle>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'count' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('count')}
                className="h-7 px-3 text-xs"
              >
                Count
              </Button>
              <Button
                variant={viewMode === 'revenue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('revenue')}
                className="h-7 px-3 text-xs"
              >
                Revenue
              </Button>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {salesHistory.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* Chart */}
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#71717a' }}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={{ stroke: '#e4e4e7' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#71717a' }}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={{ stroke: '#e4e4e7' }}
                tickFormatter={(value) => 
                  viewMode === 'revenue' ? `₺${value}` : `${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Remaining Tickets Summary */}
        {remainingTicketsData && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tickets Remaining</span>
              <span className="font-medium">
                {remainingTicketsData.remaining.toLocaleString()} / {remainingTicketsData.total.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${remainingTicketsData.soldPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{remainingTicketsData.soldPercentage.toFixed(1)}% sold</span>
              <span>{(100 - remainingTicketsData.soldPercentage).toFixed(1)}% remaining</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketSalesChart;