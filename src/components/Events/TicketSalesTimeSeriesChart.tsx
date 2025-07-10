import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesDataPoint } from '@/hooks/useEventTickets';
import { formatCurrency } from '@/utils/formatters';
import { TrendingDown, Calendar, TrendingUp, Activity, Target } from 'lucide-react';
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
  const [chartMode, setChartMode] = useState<'remaining' | 'revenue' | 'sales' | 'performance'>('remaining');
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
          if (visibleCategories[category] && point.by_category) {
            const value = point.by_category[category]?.remaining || 0;
            visibleValues.push(value);
          }
        });
      } else {
        // Non-remaining modes
        if (showTotal) {
          if (chartMode === 'revenue') {
            visibleValues.push(point.daily_revenue);
          } else if (chartMode === 'sales') {
            visibleValues.push(point.tickets_sold);
          } else if (chartMode === 'performance') {
            // Average revenue per ticket for the day
            const avgEfficiency = point.tickets_sold > 0 ? point.daily_revenue / point.tickets_sold : 0;
            visibleValues.push(avgEfficiency);
          }
        }
        
        // Use real category revenue/sales data
        allCategories.forEach(category => {
          if (visibleCategories[category] && point.by_category) {
            const categoryData = point.by_category[category];
            if (categoryData) {
              if (chartMode === 'revenue') {
                visibleValues.push(categoryData.revenue);
              } else if (chartMode === 'sales') {
                visibleValues.push(categoryData.tickets_sold);
              } else if (chartMode === 'performance') {
                // Revenue per ticket (price efficiency)
                const efficiency = categoryData.tickets_sold > 0 ? categoryData.revenue / categoryData.tickets_sold : 0;
                visibleValues.push(efficiency);
              }
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
      tickets_sold: point.tickets_sold,
      avg_price: point.avg_price,
      // Calculate total performance metric
      total_performance: point.tickets_sold > 0 ? point.daily_revenue / point.tickets_sold : 0
    };

    // Add each category's data for all modes
    allCategories.forEach(category => {
      const categoryData = point.by_category?.[category];
      transformedPoint[`${category}_remaining`] = categoryData?.remaining || 0;
      transformedPoint[`${category}_price`] = categoryData?.price || 0;
      transformedPoint[`${category}_revenue`] = categoryData?.revenue || 0;
      transformedPoint[`${category}_tickets_sold`] = categoryData?.tickets_sold || 0;
      
      // Calculate performance metric (revenue per ticket)
      const ticketsSold = categoryData?.tickets_sold || 0;
      const revenue = categoryData?.revenue || 0;
      transformedPoint[`${category}_performance`] = ticketsSold > 0 ? revenue / ticketsSold : 0;
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
            {/* Remaining Mode */}
            {chartMode === 'remaining' && (
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
                          <span className="font-medium">{category}:</span> {remaining.toLocaleString()} left
                          <span className="text-muted-foreground ml-1">({formatCurrency(price, '₺')})</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
            
            {/* Revenue Mode */}
            {chartMode === 'revenue' && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Daily Revenue:</span> {formatCurrency(data.daily_revenue, '₺')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tickets Sold:</span> {data.tickets_sold.toLocaleString()}
                </p>
                <div className="border-t pt-2 mt-2">
                  {allCategories.map(category => {
                    const revenue = data[`${category}_revenue`] as number;
                    const ticketsSold = data[`${category}_tickets_sold`] as number;
                    if (revenue > 0 || ticketsSold > 0) {
                      return (
                        <p key={category} className="text-xs">
                          <span className="font-medium">{category}:</span> {formatCurrency(revenue, '₺')}
                          <span className="text-muted-foreground ml-1">({ticketsSold} sold)</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
            
            {/* Sales Mode */}
            {chartMode === 'sales' && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Tickets Sold:</span> {data.tickets_sold.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Revenue Generated:</span> {formatCurrency(data.daily_revenue, '₺')}
                </p>
                <div className="border-t pt-2 mt-2">
                  {allCategories.map(category => {
                    const ticketsSold = data[`${category}_tickets_sold`] as number;
                    const revenue = data[`${category}_revenue`] as number;
                    if (ticketsSold > 0) {
                      return (
                        <p key={category} className="text-xs">
                          <span className="font-medium">{category}:</span> {ticketsSold.toLocaleString()} sold
                          <span className="text-muted-foreground ml-1">({formatCurrency(revenue, '₺')})</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
            
            {/* Performance Mode */}
            {chartMode === 'performance' && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Avg Revenue per Ticket:</span> {formatCurrency(data.total_performance, '₺')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Sold:</span> {data.tickets_sold.toLocaleString()} tickets
                </p>
                <div className="border-t pt-2 mt-2">
                  {allCategories.map(category => {
                    const performance = data[`${category}_performance`] as number;
                    const ticketsSold = data[`${category}_tickets_sold`] as number;
                    if (performance > 0 && ticketsSold > 0) {
                      return (
                        <p key={category} className="text-xs">
                          <span className="font-medium">{category}:</span> {formatCurrency(performance, '₺')}/ticket
                          <span className="text-muted-foreground ml-1">({ticketsSold} sold)</span>
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
          {chartMode === 'remaining' && <TrendingDown className="h-5 w-5 text-blue-500" />}
          {chartMode === 'revenue' && <TrendingUp className="h-5 w-5 text-green-500" />}
          {chartMode === 'sales' && <Activity className="h-5 w-5 text-purple-500" />}
          {chartMode === 'performance' && <Target className="h-5 w-5 text-orange-500" />}
          {chartMode === 'remaining' && 'Remaining Tickets Over Time'}
          {chartMode === 'revenue' && 'Daily Revenue Over Time'}
          {chartMode === 'sales' && 'Tickets Sold Over Time'}
          {chartMode === 'performance' && 'Revenue per Ticket Over Time'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {chartMode === 'remaining' && 'Track remaining ticket inventory by category'}
          {chartMode === 'revenue' && 'Track daily revenue performance by category'}
          {chartMode === 'sales' && 'Track ticket sales velocity by category'}
          {chartMode === 'performance' && 'Track pricing efficiency and revenue per ticket sold'}
        </p>
      </CardHeader>
      <CardContent>
        {/* Chart Mode Toggle */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Chart View:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            <Button 
              variant={chartMode === 'remaining' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setChartMode('remaining')}
              className="text-xs flex items-center gap-1"
            >
              <TrendingDown className="h-3 w-3" /> Remaining
            </Button>
            <Button 
              variant={chartMode === 'revenue' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setChartMode('revenue')}
              className="text-xs flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3" /> Revenue
            </Button>
            <Button 
              variant={chartMode === 'sales' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setChartMode('sales')}
              className="text-xs flex items-center gap-1"
            >
              <Activity className="h-3 w-3" /> Sales
            </Button>
            <Button 
              variant={chartMode === 'performance' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setChartMode('performance')}
              className="text-xs flex items-center gap-1"
            >
              <Target className="h-3 w-3" /> Efficiency
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
              {chartMode === 'remaining' && 'Total Remaining'}
              {chartMode === 'revenue' && 'Daily Revenue'}
              {chartMode === 'sales' && 'Total Sales'}
              {chartMode === 'performance' && 'Avg Efficiency'}
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
                tickFormatter={(value: number) => {
                  if (chartMode === 'revenue' || chartMode === 'performance') {
                    return formatCurrency(value, '₺');
                  }
                  return value.toLocaleString();
                }}
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
                  dataKey={
                    chartMode === 'remaining' ? 'total_remaining' :
                    chartMode === 'revenue' ? 'daily_revenue' :
                    chartMode === 'sales' ? 'tickets_sold' :
                    'total_performance'
                  }
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={
                    chartMode === 'remaining' ? 'Total Remaining' :
                    chartMode === 'revenue' ? 'Daily Revenue' :
                    chartMode === 'sales' ? 'Total Sales' :
                    'Avg Efficiency'
                  }
                />
              )}
              
              {/* Individual category lines - only show if toggled on */}
              {allCategories.map((category, index) => {
                if (!visibleCategories[category]) return null;
                
                const dataKey = 
                  chartMode === 'remaining' ? `${category}_remaining` :
                  chartMode === 'revenue' ? `${category}_revenue` :
                  chartMode === 'sales' ? `${category}_tickets_sold` :
                  `${category}_performance`;
                
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
          
          {/* Remaining Mode Stats */}
          {chartMode === 'remaining' && (
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
          )}
          
          {/* Revenue Mode Stats */}
          {chartMode === 'revenue' && (
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
          
          {/* Sales Mode Stats */}
          {chartMode === 'sales' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.max(...timeseries.map((p: TimeSeriesDataPoint) => p.tickets_sold)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Peak Daily Sales</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {timeseries.reduce((sum: number, p: TimeSeriesDataPoint) => sum + p.tickets_sold, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Sold</div>
              </div>
            </>
          )}
          
          {/* Performance Mode Stats */}
          {chartMode === 'performance' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(
                    Math.max(...timeseries
                      .filter((p: TimeSeriesDataPoint) => p.tickets_sold > 0)
                      .map((p: TimeSeriesDataPoint) => p.daily_revenue / p.tickets_sold)
                    ), '₺'
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Best Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {(() => {
                    const totalRevenue = timeseries.reduce((sum: number, p: TimeSeriesDataPoint) => sum + p.daily_revenue, 0);
                    const totalSold = timeseries.reduce((sum: number, p: TimeSeriesDataPoint) => sum + p.tickets_sold, 0);
                    return formatCurrency(totalSold > 0 ? totalRevenue / totalSold : 0, '₺');
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">Avg Revenue/Ticket</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};