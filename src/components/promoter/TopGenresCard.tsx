import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PromoterGenreDistribution } from '@/types/promoter.types';
import { formatDecimalPercentage } from '@/utils/formatters';

interface TopGenresCardProps {
  genreAnalytics: PromoterGenreDistribution[];
  isLoading?: boolean;
}

export const TopGenresCard: React.FC<TopGenresCardProps> = ({
  genreAnalytics,
  isLoading = false
}) => {
  const renderTrendIcon = (trendValue: number) => {
    if (trendValue > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trendValue < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" />
            Genre Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!genreAnalytics || genreAnalytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" />
            Genre Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No genre data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEvents = genreAnalytics.reduce((sum, genre) => sum + genre.event_count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Music className="h-4 w-4" />
          Genre Distribution
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {genreAnalytics.length} genre{genreAnalytics.length !== 1 ? 's' : ''} • {totalEvents} total events
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {genreAnalytics.slice(0, 8).map((genre, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm truncate">{genre.genre}</span>
                {renderTrendIcon(genre.growth_trend)}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-medium">{genre.event_count} events</div>
                <div className="text-xs text-muted-foreground">
                  {formatDecimalPercentage(genre.percentage)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {genreAnalytics.length > 8 && (
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Showing top 8 of {genreAnalytics.length} genres
            </p>
          </div>
        )}
        
        {/* Genre Focus Analysis */}
        {genreAnalytics.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Genre Strategy:</div>
            {genreAnalytics[0].percentage > 70 ? (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <strong>Specialist:</strong> Highly focused on {genreAnalytics[0].genre} ({formatDecimalPercentage(genreAnalytics[0].percentage)})
              </div>
            ) : genreAnalytics[0].percentage > 40 ? (
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <strong>Focused:</strong> Strong emphasis on {genreAnalytics[0].genre} ({formatDecimalPercentage(genreAnalytics[0].percentage)})
              </div>
            ) : (
              <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                <strong>Diversified:</strong> Multi-genre approach across {genreAnalytics.length} genres
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};