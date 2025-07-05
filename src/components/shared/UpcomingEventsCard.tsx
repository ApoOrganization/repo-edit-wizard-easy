
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/data/types";

interface UpcomingEventsCardProps {
  events: Event[];
  title?: string;
  maxEvents?: number;
}

const UpcomingEventsCard = ({ 
  events, 
  title = "Upcoming Events", 
  maxEvents = 5 
}: UpcomingEventsCardProps) => {
  const displayEvents = events.slice(0, maxEvents);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No upcoming events</p>
        ) : (
          <div className="space-y-2">
            {displayEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block p-2 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-medium group-hover:text-primary line-clamp-1">
                    {event.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsCard;
