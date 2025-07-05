
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import EventHeader from "@/components/Events/EventHeader";
import EventMeta from "@/components/Events/EventMeta";
import EventDetailContainer from "@/components/Events/EventDetailContainer";

const EventDetail = () => {
  const { id } = useParams();
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockEvents.find(e => e.id === id);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Event...</h1>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Event Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Compact Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/events" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Events
          </Link>
        </div>

        {/* Header Section - Reduced height */}
        <div className="py-2">
          <EventHeader event={event} />
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Meta Section */}
        <EventMeta event={event} />

        {/* Event Detail Container with Carousel */}
        <EventDetailContainer event={event} />
      </div>
    </div>
  );
};

export default EventDetail;
