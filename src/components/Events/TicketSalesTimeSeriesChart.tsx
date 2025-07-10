import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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

  // Toggle state management
  const [showTotal, setShowTotal] = useState(true);
  const [chartMode, setChartMode] = useState<'remaining' | 'revenue'>('remaining');
  const [visibleCategories, setVisibleCategories] = useState<{ [key: string]: boolean }>(() => {
    // Initialize all categories as visible
    const initial: { [key: string]: boolean } = {};
    allCategories.forEach(category => {
      initial[category] = true;
    });
    return initial;
  });

  // Toggle individual category
  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle all categories
  const toggleAllCategories = (visible: boolean) => {
    const newState: { [key: string]: boolean } = {};
    allCategories.forEach(category => {
      newState[category] = visible;
    });
    setVisibleCategories(newState);
  };

  // Dynamic Y-axis scaling based on visible lines and chart mode
  const getYAxisDomain = useMemo(() => {
    if (timeseries.length === 0) return [0, 100];

    const visibleValues: number[] = [];
    
    timeseries.forEach(point => {
      if (chartMode === 'remaining') {
        // Include total if visible
        if (showTotal) {
          visibleValues.push(point.total_remaining);
        }
        
        // Include visible categories
        allCategories.forEach(category => {
          if (visibleCategories[category]) {
            const value = point.by_category?.[category]?.remaining || 0;
            visibleValues.push(value);
          }
        });
      } else {
        // Revenue mode
        if (showTotal) {
          visibleValues.push(point.daily_revenue);
        }
        
        // Estimate category revenue (price * tickets sold)
        allCategories.forEach(category => {
          if (visibleCategories[category] && point.by_category) {
            const categoryData = point.by_category[category];
            if (categoryData) {
              // Estimate revenue for this category (simplified)
              const estimatedRevenue = categoryData.price * Math.max(0, 100 - categoryData.remaining);
              visibleValues.push(estimatedRevenue);
            }
          }
        });
      }
    });

    if (visibleValues.length === 0) return [0, 100];

    const maxValue = Math.max(...visibleValues);
    return [0, Math.ceil(maxValue * 1.1)]; // 10% padding at top
  }, [timeseries, showTotal, visibleCategories, allCategories, chartMode]);

  // Transform data for recharts
  const chartData = timeseries.map(point => {
    const transformedPoint: any = {
      date: format(parseISO(point.date), 'MMM dd'),
      fullDate: point.date,
      total_remaining: point.total_remaining,
      daily_revenue: point.daily_revenue,
      avg_price: point.avg_price
    };

    // Add each category's data for both modes
    allCategories.forEach(category => {
      const categoryData = point.by_category?.[category];
      transformedPoint[`${category}_remaining`] = categoryData?.remaining || 0;
      transformedPoint[`${category}_price`] = categoryData?.price || 0;
      
      // Estimate category revenue (simplified calculation)
      if (categoryData) {
        const estimatedCategoryRevenue = categoryData.price * Math.max(0, 100 - categoryData.remaining);
        transformedPoint[`${category}_revenue`] = estimatedCategoryRevenue;
      } else {
        transformedPoint[`${category}_revenue`] = 0;
      }
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
            {chartMode === 'remaining' ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">Total Remaining:</span> {data.total_remaining.toLocaleString()} tickets
                </p>
                <p className="text-sm">
                  <span className="font-medium">Avg Price:</span> {formatCurrency(data.avg_price, '₺')}
                </p>
                <div className="border-t pt-2 mt-2">
                  {allCategories.map(category => {
                    const remaining = data[`${category}_remaining`] as number;
                    const price = data[`${category}_price`] as number;
                    if (remaining > 0) {
                      return (
                        <p key={category} className="text-xs">
                          <span className="font-medium">{category}:</span> {remaining.toLocaleString()} 
                          <span className="text-muted-foreground ml-1">({formatCurrency(price, '₺')})</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm">
                  <span className="font-medium">Daily Revenue:</span> {formatCurrency(data.daily_revenue, '₺')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Avg Price:</span> {formatCurrency(data.avg_price, '₺')}
                </p>
                <div className="border-t pt-2 mt-2">
                  {allCategories.map(category => {
                    const revenue = data[`${category}_revenue`] as number;
                    const price = data[`${category}_price`] as number;
                    if (revenue > 0) {
                      return (
                        <p key={category} className="text-xs">
                          <span className="font-medium">{category}:</span> {formatCurrency(revenue, '₺')} 
                          <span className="text-muted-foreground ml-1">({formatCurrency(price, '₺')})</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
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
          {chartMode === 'remaining' ? 'Remaining Tickets Over Time' : 'Daily Revenue Over Time'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {chartMode === 'remaining' 
            ? 'Track remaining ticket inventory by category'
            : 'Track daily revenue performance by category'
          }
        </p>
      </CardHeader>
      <CardContent>
        {/* Chart Mode Toggle */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Chart View:</span>
          <div className="flex gap-1">
            <Button 
              variant={chartMode === 'remaining' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setChartMode('remaining')}
            >
              📊 Remaining Tickets
            </Button>
            <Button 
              variant={chartMode === 'revenue' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setChartMode('revenue')}
            >
              💰 Daily Revenue
            </Button>
          </div>
        </div>
        {/* Toggle Controls */}
        <div className="mb-6 space-y-4">
          {/* Total Toggle */}
          <div className="flex items-center gap-3">
            <Switch 
              checked={showTotal} 
              onCheckedChange={setShowTotal}
              id="total-toggle"
            />
            <label 
              htmlFor="total-toggle"
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
              style={{ color: showTotal ? '#2563eb' : '#6b7280' }}
            >
              <div 
                className="w-3 h-0.5 rounded"
                style={{ backgroundColor: '#2563eb' }}
              />
              {chartMode === 'remaining' ? 'Total Remaining' : 'Daily Revenue'}
            </label>
          </div>

          {/* Category Toggles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Categories</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleAllCategories(true)}
                  className="h-6 px-2 text-xs"
                >
                  Show All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleAllCategories(false)}
                  className="h-6 px-2 text-xs"
                >
                  Hide All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allCategories.map((category, index) => {
                const isVisible = visibleCategories[category];
                const color = categoryColors[index % categoryColors.length];
                return (
                  <div key={category} className="flex items-center gap-2">
                    <Switch 
                      checked={isVisible} 
                      onCheckedChange={() => toggleCategory(category)}
                      id={`category-${category}`}
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="text-xs cursor-pointer flex items-center gap-2 truncate"
                      style={{ color: isVisible ? color : '#6b7280' }}
                      title={category}
                    >
                      <div 
                        className="w-3 h-0.5 rounded"
                        style={{ 
                          backgroundColor: color,
                          opacity: isVisible ? 1 : 0.3
                        }}
                      />
                      {category}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart */}
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
                tickFormatter={(value: number) => chartMode === 'revenue' ? formatCurrency(value, '₺') : value.toLocaleString()}
                domain={getYAxisDomain}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                fontSize={12}
                iconType="line"
              />
              
              {/* Total line - only show if toggled on */}
              {showTotal && (
                <Line
                  type="monotone"
                  dataKey={chartMode === 'remaining' ? 'total_remaining' : 'daily_revenue'}
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={chartMode === 'remaining' ? 'Total Remaining' : 'Daily Revenue'}
                />
              )}
              
              {/* Individual category lines - only show if toggled on */}
              {allCategories.map((category, index) => {
                if (!visibleCategories[category]) return null;
                
                const dataKey = chartMode === 'remaining' ? `${category}_remaining` : `${category}_revenue`;
                
                return (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={categoryColors[index % categoryColors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={category}
                    strokeDasharray="5 5"
                  />
                );
              })}
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
          {chartMode === 'remaining' ? (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.max(...timeseries.map((p: TimeSeriesDataPoint) => p.total_remaining)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Peak Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.min(...timeseries.map((p: TimeSeriesDataPoint) => p.total_remaining)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Min Remaining</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(Math.max(...timeseries.map((p: TimeSeriesDataPoint) => p.daily_revenue)), '₺')}
                </div>
                <div className="text-xs text-muted-foreground">Peak Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(timeseries.reduce((sum: number, p: TimeSeriesDataPoint) => sum + p.daily_revenue, 0), '₺')}
                </div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};