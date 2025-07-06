import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getVenueIdFromName } from "@/data/venues";
import { getPromoterIdFromName } from "@/data/promoters";

interface EventGridItemProps {
  event: Event;
}

const EventGridItem = ({ event }: EventGridItemProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Sold Out': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Postponed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleVenueNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const venueId = getVenueIdFromName(event.venue);
    navigate(`/venues/${venueId}`);
  };

  const handlePromoterNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const promoterId = getPromoterIdFromName(event.promoter);
    navigate(`/promoters/${promoterId}`);
  };

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="media-card hover-lift h-full cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-start">
            <Badge className={`${getStatusColor(event.status)} text-xs px-2 py-1`}>
              {event.status}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">{event.genre}</span>
          </div>
          <CardTitle className="text-sm font-bold leading-tight line-clamp-2">{event.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-2" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-2" />
              <span 
                className="truncate hover:text-primary transition-colors cursor-pointer"
                onClick={handleVenueNavigation}
              >
                {event.venue}, {event.city}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2" />
              <span 
                className="truncate hover:text-primary transition-colors cursor-pointer"
                onClick={handlePromoterNavigation}
              >
                {event.promoter}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
              <p className="font-semibold font-manrope text-sm">{formatCurrency(event.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sold</p>
              <p className="font-semibold font-manrope text-sm">
                {event.ticketsSold.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.providers.slice(0, 2).map((provider, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                {provider}
              </Badge>
            ))}
            {event.providers.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{event.providers.length - 2}
              </Badge>
            )}
          </div>

          {/* Artists section with clickable names */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {event.artists.map((artist, index) => (
                <span key={artist.id}>
                  {index > 0 && ', '}
                  <Link 
                    to={`/artists/${artist.id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-primary transition-colors"
                  >
                    {artist.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventGridItem;
