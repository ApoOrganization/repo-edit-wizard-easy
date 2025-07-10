import { TransformedEvent } from "@/types/event.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPromoterIdFromName } from "@/data/promoters";

interface EventGridItemProps {
  event: TransformedEvent;
}

const EventGridItem = ({ event }: EventGridItemProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale': return 'bg-accent/20 text-accent-foreground border-accent';
      case 'Sold Out': return 'bg-brand-success/20 text-brand-secondary border-brand-success';
      case 'Postponed': return 'bg-primary text-accent border-accent';
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
      <Card className="media-card hover-lift h-full cursor-pointer border-brand-border/20 hover:border-accent/50">
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-start">
            <Badge className={`${getStatusColor(event.status)} text-xs px-2 py-1 border`}>
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
            
            {event.promoter && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-2" />
                <span 
                  className="truncate hover:text-primary transition-colors cursor-pointer"
                  onClick={handlePromoterNavigation}
                >
                  {event.promoter}
                </span>
              </div>
            )}
          </div>

          {(event.revenue !== undefined || event.ticketsSold !== undefined) && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              {event.revenue !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                  <p className="font-semibold font-manrope text-sm">{formatCurrency(event.revenue)}</p>
                </div>
              )}
              {event.ticketsSold !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sold</p>
                  <p className="font-semibold font-manrope text-sm">
                    {event.ticketsSold.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

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
