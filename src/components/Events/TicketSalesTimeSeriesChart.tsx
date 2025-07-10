import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesDataPoint } from '@/hooks/useEventTickets';
import { formatCurrency } from '@/utils/formatters';
import { TrendingDown, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TicketSalesTimeSeriesChartProps {
  timeseries: TimeSeriesDataPoint[];
  isLoading?: boolean;
}

export const TicketSalesTimeSeriesChart: React.FC<TicketSalesTimeSeriesChartProps> = ({
  timeseries,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Ticket Sales Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timeseries || timeseries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Ticket Sales Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sales data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all unique categories across all time points
  const allCategories = Array.from(
    new Set(
      timeseries.flatMap(point => 
        Object.keys(point.by_category || {})
      )
    )
  );

  // Colors for different categories
  const categoryColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
    '#d084d0', '#87ceeb', '#ffb347', '#98fb98', '#f0e68c'
  ];

  // Transform data for recharts
  const chartData = timeseries.map(point => {
    const transformedPoint: any = {
      date: format(parseISO(point.date), 'MMM dd'),
      fullDate: point.date,
      total_remaining: point.total_remaining,
      avg_price: point.avg_price
    };

    // Add each category's remaining tickets
    allCategories.forEach(category => {
      transformedPoint[`${category}_remaining`] = point.by_category?.[category]?.remaining || 0;
      transformedPoint[`${category}_price`] = point.by_category?.[category]?.price || 0;
    });

    return transformedPoint;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-2">{format(parseISO(data.fullDate), 'MMM dd, yyyy')}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Total Remaining:</span> {data.total_remaining.toLocaleString()} tickets
            </p>
            <p className="text-sm">
              <span className="font-medium">Avg Price:</span> {formatCurrency(data.avg_price / 100, '₺')}
            </p>
            <div className="border-t pt-2 mt-2">
              {allCategories.map(category => {
                const remaining = data[`${category}_remaining`];
                const price = data[`${category}_price`];
                if (remaining > 0) {
                  return (
                    <p key={category} className="text-xs">
                      <span className="font-medium">{category}:</span> {remaining.toLocaleString()} 
                      <span className="text-muted-foreground ml-1">({formatCurrency(price / 100, '₺')})</span>
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Remaining Tickets Over Time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track remaining ticket inventory by category
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                fontSize={12}
                iconType="line"
              />
              
              {/* Total remaining line */}
              <Line
                type="monotone"
                dataKey="total_remaining"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Total Remaining"
              />
              
              {/* Individual category lines */}
              {allCategories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={`${category}_remaining`}
                  stroke={categoryColors[index % categoryColors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={category}
                  strokeDasharray={index === 0 ? "0" : "5 5"}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold">
              {timeseries.length}
            </div>
            <div className="text-xs text-muted-foreground">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {allCategories.length}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {Math.max(...timeseries.map(p => p.total_remaining)).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Peak Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {Math.min(...timeseries.map(p => p.total_remaining)).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Min Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};