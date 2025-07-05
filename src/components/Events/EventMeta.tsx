import { Event } from "@/data/types";
import { MapPin } from "lucide-react";

interface EventMetaProps {
  event: Event;
}

const EventMeta = ({ event }: EventMetaProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Promoter - Left */}
      <div>
        <span className="text-sm text-muted-foreground">Promoter</span>
        <p className="text-base font-medium">{event.promoter}</p>
      </div>
      
      {/* Venue - Right */}
      <div className="flex items-center gap-2 text-base">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{event.venue}</span>
      </div>
    </div>
  );
};

export default EventMeta;