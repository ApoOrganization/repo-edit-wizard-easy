import { Event } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getVenueIdFromName } from "@/data/venues";
import { getPromoterIdFromName } from "@/data/promoters";

interface EventListItemProps {
  event: Event;
}

const EventListItem = ({ event }: EventListItemProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Sold Out': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Postponed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Past': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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

  const selloutPercentage = (event.ticketsSold && event.capacity) ? (event.ticketsSold / event.capacity) * 100 : 0;

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
      <Card className="media-card hover-lift cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-4">
            {/* Left side - Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`${getStatusColor(event.status)} text-xs px-2 py-1`}>
                  {event.status}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1">{event.genre}</Badge>
              </div>
              
              <h3 className="text-sm font-bold leading-tight line-clamp-1 mb-2">{event.name}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{event.city}</span>
                </div>
                
                <div className="flex items-center col-span-2">
                  <Users className="h-3 w-3 mr-1" />
                  <span 
                    className="truncate hover:text-primary transition-colors cursor-pointer"
                    onClick={handleVenueNavigation}
                  >
                    {event.venue}
                  </span>
                  {event.promoter && (
                    <>
                      <span className="mx-1">•</span>
                      <span 
                        className="truncate hover:text-primary transition-colors cursor-pointer"
                        onClick={handlePromoterNavigation}
                      >
                        {event.promoter}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Metrics */}
            {(event.revenue !== undefined || event.ticketsSold !== undefined) && (
              <div className="flex-shrink-0 text-right space-y-2">
                {event.revenue !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold font-manrope text-sm">{formatCurrency(event.revenue)}</p>
                  </div>
                )}
                
                {event.ticketsSold !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sold</p>
                    <p className="font-semibold font-manrope text-sm">
                      {event.ticketsSold.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {selloutPercentage > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sellout</p>
                    <p className="font-semibold font-manrope text-sm">
                      {selloutPercentage.toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom row - Artists and providers */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
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
            
            <div className="flex flex-wrap gap-1 ml-2">
              {event.providers.slice(0, 2).map((provider, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {provider}
                </Badge>
              ))}
              {event.providers.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{event.providers.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventListItem;
