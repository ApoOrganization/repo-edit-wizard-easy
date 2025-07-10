import { TransformedEvent } from "@/types/event.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPromoterIdFromName } from "@/data/promoters";

interface EventListItemProps {
  event: TransformedEvent;
}

const EventListItem = ({ event }: EventListItemProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale': return 'bg-brand-primary/20 text-brand-secondary border-brand-primary';
      case 'Sold Out': return 'bg-brand-success/20 text-brand-secondary border-brand-success';
      case 'Postponed': return 'bg-brand-accent/20 text-brand-accent border-brand-accent';
      case 'Past': return 'bg-brand-text-secondary/20 text-brand-text-secondary border-brand-text-secondary';
      default: return 'bg-brand-text-secondary/20 text-brand-text-secondary border-brand-text-secondary';
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
    if (event.venue_id) {
      navigate(`/venues/${event.venue_id}`);
    }
  };

  const handlePromoterNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const promoterId = getPromoterIdFromName(event.promoter);
    navigate(`/promoters/${promoterId}`);
  };

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="media-card hover-lift cursor-pointer border-brand-border/20 hover:border-brand-primary/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-4">
            {/* Left side - Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={`${getStatusColor(event.status)} text-xs px-2 py-1 border`}>
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
