import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/formatters';
import { DollarSign, TrendingUp, Target, PieChart } from 'lucide-react';

interface RevenueMetricsCardProps {
  revenueRealized: number;
  remainingRevenue: number;
  totalPotentialRevenue: number;
  isLoading?: boolean;
}

export const RevenueMetricsCard: React.FC<RevenueMetricsCardProps> = ({
  revenueRealized,
  remainingRevenue,
  totalPotentialRevenue,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const revenuePercentage = totalPotentialRevenue > 0 
    ? (revenueRealized / totalPotentialRevenue) * 100 
    : 0;

  const remainingPercentage = totalPotentialRevenue > 0 
    ? (remainingRevenue / totalPotentialRevenue) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Revenue Progress</span>
              <span className="text-sm text-muted-foreground">
                {revenuePercentage.toFixed(1)}% realized
              </span>
            </div>
            <Progress value={revenuePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₺0</span>
              <span>{formatCurrency(totalPotentialRevenue / 100, '₺')}</span>
            </div>
          </div>

          {/* Revenue Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Realized Revenue */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(revenueRealized / 100, '₺')}
              </div>
              <div className="text-xs text-green-600 font-medium">Realized Revenue</div>
              <div className="text-xs text-muted-foreground mt-1">
                {revenuePercentage.toFixed(1)}% of potential
              </div>
            </div>

            {/* Remaining Revenue */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex justify-center mb-2">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-orange-700">
                {formatCurrency(remainingRevenue / 100, '₺')}
              </div>
              <div className="text-xs text-orange-600 font-medium">Remaining Revenue</div>
              <div className="text-xs text-muted-foreground mt-1">
                {remainingPercentage.toFixed(1)}% potential
              </div>
            </div>

            {/* Total Potential */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-center mb-2">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(totalPotentialRevenue / 100, '₺')}
              </div>
              <div className="text-xs text-blue-600 font-medium">Total Potential</div>
              <div className="text-xs text-muted-foreground mt-1">
                Maximum revenue
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div className="text-sm font-medium">Sales Efficiency</div>
              <div className="text-xs text-muted-foreground">
                {revenuePercentage < 25 ? 'Early stage' :
                 revenuePercentage < 50 ? 'Building momentum' :
                 revenuePercentage < 75 ? 'Strong performance' :
                 'Near capacity'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Revenue Per Sale</div>
              <div className="text-xs text-muted-foreground">
                Avg: {formatCurrency((revenueRealized / 100) / Math.max(1, Math.floor(revenueRealized / 300000)), '₺')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};