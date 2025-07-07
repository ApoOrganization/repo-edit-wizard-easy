
import { Event } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVenueIdFromName } from "@/data/venues";

interface VenueCardProps {
  event: Event;
}

const VenueCard = ({ event }: VenueCardProps) => {
  const navigate = useNavigate();
  
  const handleVenueNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const venueId = getVenueIdFromName(event.venue);
    console.log('Venue navigation clicked:', event.venue);
    console.log('Navigating to:', `/venues/${venueId}`);
    navigate(`/venues/${venueId}`);
  };

  return (
    <Card className="media-card h-full relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/placeholder.svg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content Overlay */}
      <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div>
          <h3 
            className="text-xl font-bold mb-2 cursor-pointer hover:text-primary transition-colors" 
            onClick={handleVenueNavigation}
          >
            {event.venue}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Capacity information loading...</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{event.city}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={handleVenueNavigation}
            title={`View ${event.venue} details`}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
