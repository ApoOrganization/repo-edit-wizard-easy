import { TransformedEvent } from "@/types/event.types";
import { MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPromoterIdFromName } from "@/data/promoters";

interface EventMetaProps {
  event: TransformedEvent;
}

const EventMeta = ({ event }: EventMetaProps) => {
  const navigate = useNavigate();

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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Promoter - Left */}
      <div>
        <span className="text-sm text-muted-foreground">Promoter</span>
        <p 
          className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
          onClick={handlePromoterNavigation}
        >
          {event.promoter}
        </p>
      </div>
      
      {/* Venue - Right */}
      <div className="flex items-center gap-2 text-base">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span 
          className="hover:text-primary transition-colors cursor-pointer"
          onClick={handleVenueNavigation}
        >
          {event.venue}
        </span>
      </div>
    </div>
  );
};

export default EventMeta;
