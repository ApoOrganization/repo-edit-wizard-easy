import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PromoterTimeSeriesPoint } from '@/hooks/usePromoterTickets';
import { formatCurrency } from '@/utils/formatters';
import { getEventDisplayName } from '@/utils/eventFormatters';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface PromoterSalesTimeSeriesChartProps {
  timeseries: PromoterTimeSeriesPoint[];
  eventsPresent?: { [eventId: string]: string };
  isLoading?: boolean;
}

type ChartMode = 'revenue' | 'sales' | 'events';

export const PromoterSalesTimeSeriesChart: React.FC<PromoterSalesTimeSeriesChartProps> = ({
  timeseries,
  eventsPresent = {},
  isLoading = false
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>('revenue');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Promoter Sales Analytics
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
            <TrendingUp className="h-5 w-5" />
            Promoter Sales Analytics
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

  // Dynamic Y-axis scaling based on chart mode
  const getYAxisDomain = useMemo(() => {
    if (timeseries.length === 0) return [0, 100];

    const values = timeseries.map(point => {
      switch (chartMode) {
        case 'revenue':
          return point.daily_revenue;
        case 'sales':
          return point.tickets_sold;
        case 'events':
          return point.events.length;
        default:
          return 0;
      }
    });

    const maxValue = Math.max(...values);
    return [0, Math.ceil(maxValue * 1.1)]; // 10% padding at top
  }, [timeseries, chartMode]);

  // Transform data for recharts
  const chartData = timeseries.map(point => ({
    date: format(parseISO(point.date), 'MMM dd'),
    fullDate: point.date,
    daily_revenue: point.daily_revenue,
    tickets_sold: point.tickets_sold,
    events_count: point.events.length,
    events_list: point.events,
    // Calculate derived metrics
    avg_revenue_per_ticket: point.tickets_sold > 0 ? point.daily_revenue / point.tickets_sold : 0,
    revenue_per_event: point.events.length > 0 ? point.daily_revenue / point.events.length : 0
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-2">{format(parseISO(data.fullDate), 'MMM dd, yyyy')}</p>
          <div className="space-y-1">
            {/* Revenue Mode */}
            {chartMode === 'revenue' && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Daily Revenue:</span> {formatCurrency(data.daily_revenue, '₺')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tickets Sold:</span> {data.tickets_sold.toLocaleString()}
                </p>
                {data.tickets_sold > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Avg per Ticket:</span> {formatCurrency(data.avg_revenue_per_ticket, '₺')}
                  </p>
                )}
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
                {data.tickets_sold > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Avg Price:</span> {formatCurrency(data.avg_revenue_per_ticket, '₺')}
                  </p>
                )}
              </>
            )}
            
            {/* Events Mode */}
            {chartMode === 'events' && (
              <>
                <p className="text-sm">
                  <span className="font-medium">Active Events:</span> {data.events_count}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Revenue:</span> {formatCurrency(data.daily_revenue, '₺')}
                </p>
                {data.events_count > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Revenue per Event:</span> {formatCurrency(data.revenue_per_event, '₺')}
                  </p>
                )}
              </>
            )}
            
            {/* Event List */}
            {data.events_count > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-medium mb-1">Active Events ({data.events_count}):</p>
                <div className="space-y-1">
                  {data.events_list.slice(0, 3).map((eventId: string, idx: number) => (
                    <p key={eventId} className="text-xs text-muted-foreground">
                      • {eventsPresent[eventId] ? 
                          getEventDisplayName(eventsPresent[eventId], 35) : 
                          `Event ${eventId.slice(0, 8)}...`
                        }
                    </p>
                  ))}
                  {data.events_list.length > 3 && (
                    <p className="text-xs text-muted-foreground italic">...and {data.events_list.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getDataKey = () => {
    switch (chartMode) {
      case 'revenue':
        return 'daily_revenue';
      case 'sales':
        return 'tickets_sold';
      case 'events':
        return 'events_count';
      default:
        return 'daily_revenue';
    }
  };

  const getLineColor = () => {
    switch (chartMode) {
      case 'revenue':
        return '#10b981'; // green
      case 'sales':
        return '#8b5cf6'; // purple
      case 'events':
        return '#f59e0b'; // orange
      default:
        return '#10b981';
    }
  };

  const getChartTitle = () => {
    switch (chartMode) {
      case 'revenue':
        return 'Daily Revenue Performance';
      case 'sales':
        return 'Daily Ticket Sales';
      case 'events':
        return 'Event Activity Timeline';
      default:
        return 'Promoter Sales Analytics';
    }
  };

  const getChartDescription = () => {
    switch (chartMode) {
      case 'revenue':
        return 'Track daily revenue across all promoter events';
      case 'sales':
        return 'Monitor ticket sales velocity and patterns';
      case 'events':
        return 'Visualize event portfolio activity over time';
      default:
        return 'Comprehensive promoter performance analytics';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {chartMode === 'revenue' && <TrendingUp className="h-5 w-5 text-green-500" />}
          {chartMode === 'sales' && <Activity className="h-5 w-5 text-purple-500" />}
          {chartMode === 'events' && <Calendar className="h-5 w-5 text-orange-500" />}
          {getChartTitle()}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getChartDescription()}
        </p>
      </CardHeader>
      <CardContent>
        {/* Chart Mode Toggle */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Chart View:</span>
          <div className="flex gap-1">
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
              variant={chartMode === 'events' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setChartMode('events')}
              className="text-xs flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" /> Events
            </Button>
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
                  if (chartMode === 'revenue') {
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
              
              <Line
                type="monotone"
                dataKey={getDataKey()}
                stroke={getLineColor()}
                strokeWidth={3}
                dot={{ r: 4, fill: getLineColor() }}
                name={
                  chartMode === 'revenue' ? 'Daily Revenue' :
                  chartMode === 'sales' ? 'Tickets Sold' :
                  'Active Events'
                }
              />
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
          
          {chartMode === 'revenue' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(Math.max(...timeseries.map(p => p.daily_revenue)), '₺')}
                </div>
                <div className="text-xs text-muted-foreground">Peak Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(timeseries.reduce((sum, p) => sum + p.daily_revenue, 0), '₺')}
                </div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {formatCurrency(
                    timeseries.reduce((sum, p) => sum + p.daily_revenue, 0) / timeseries.length, 
                    '₺'
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Avg Daily Revenue</div>
              </div>
            </>
          )}
          
          {chartMode === 'sales' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.max(...timeseries.map(p => p.tickets_sold)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Peak Daily Sales</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {timeseries.reduce((sum, p) => sum + p.tickets_sold, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Sold</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.round(timeseries.reduce((sum, p) => sum + p.tickets_sold, 0) / timeseries.length).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Avg Daily Sales</div>
              </div>
            </>
          )}
          
          {chartMode === 'events' && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.max(...timeseries.map(p => p.events.length))}
                </div>
                <div className="text-xs text-muted-foreground">Max Concurrent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Array.from(new Set(timeseries.flatMap(p => p.events))).length}
                </div>
                <div className="text-xs text-muted-foreground">Unique Events</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {(timeseries.reduce((sum, p) => sum + p.events.length, 0) / timeseries.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Active Events</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};