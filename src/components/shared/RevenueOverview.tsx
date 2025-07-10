import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TicketTotals, EntityType } from '@/types/ticketAnalytics';
import { formatCurrency } from '@/utils/formatters';
import { DollarSign, TrendingUp, Target, PieChart } from 'lucide-react';

interface RevenueOverviewProps {
  totals: TicketTotals;
  entityType: EntityType;
  isLoading?: boolean;
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  totals,
  entityType,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                <div className="h-2 w-full bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate completion rate
  const completionRate = totals.total_potential_revenue > 0 
    ? (totals.revenue_realized / totals.total_potential_revenue) * 100 
    : 0;

  // Calculate remaining rate
  const remainingRate = totals.total_potential_revenue > 0
    ? (totals.remaining_revenue / totals.total_potential_revenue) * 100
    : 0;

  // Entity-specific text
  const totalPotentialText = entityType === 'promoter' 
    ? 'Maximum possible revenue' 
    : 'Maximum venue revenue';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Revenue Realized */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Realized</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totals.revenue_realized, '₺')}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              {completionRate.toFixed(1)}% of potential
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Earned</span>
            </div>
          </div>
          <Progress 
            value={completionRate} 
            className="h-2 mt-2"
            style={{
              background: 'rgb(220 252 231)', // green-100
            }}
          />
        </CardContent>
      </Card>

      {/* Remaining Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Revenue</CardTitle>
          <Target className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totals.remaining_revenue, '₺')}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              {remainingRate.toFixed(1)}% still available
            </p>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">Potential</span>
            </div>
          </div>
          <Progress 
            value={remainingRate} 
            className="h-2 mt-2"
            style={{
              background: 'rgb(254 243 199)', // orange-100
            }}
          />
        </CardContent>
      </Card>

      {/* Total Potential */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Potential</CardTitle>
          <PieChart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totals.total_potential_revenue, '₺')}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              {totalPotentialText}
            </p>
            <div className="flex items-center gap-1">
              <PieChart className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Total</span>
            </div>
          </div>
          {/* Split progress bar showing realized vs remaining */}
          <div className="mt-2 space-y-1">
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
              <div 
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
              <div 
                className="bg-orange-400 transition-all duration-300"
                style={{ width: `${remainingRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Realized</span>
              <span>Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};