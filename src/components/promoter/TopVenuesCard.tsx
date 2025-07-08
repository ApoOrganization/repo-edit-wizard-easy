import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';
import { PromoterVenueStats } from '@/types/promoter.types';

interface TopVenuesCardProps {
  venueAnalytics: PromoterVenueStats[];
  isLoading?: boolean;
}

export const TopVenuesCard: React.FC<TopVenuesCardProps> = ({
  venueAnalytics,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Top Venues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!venueAnalytics || venueAnalytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Top Venues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No venue data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Top Venues
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {venueAnalytics.length} venue{venueAnalytics.length !== 1 ? 's' : ''} total
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {venueAnalytics.slice(0, 10).map((venue, index) => (
            <div key={venue.venue_id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/venues/${venue.venue_id}`}
                  className="text-sm hover:text-primary transition-colors font-medium block truncate"
                >
                  {venue.venue_name}
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{venue.city}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-medium">{venue.event_count} events</div>
                {venue.last_event_date && (
                  <div className="text-xs text-muted-foreground">
                    Last: {new Date(venue.last_event_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {venueAnalytics.length > 10 && (
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Showing top 10 of {venueAnalytics.length} venues
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};