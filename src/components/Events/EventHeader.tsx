import { Event } from "@/data/types";

interface EventHeaderProps {
  event: Event;
}

const EventHeader = ({ event }: EventHeaderProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Event Name - Left */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground font-manrope">
        {event.name}
      </h1>
      
      {/* Date - Right */}
      <div className="text-3xl md:text-4xl text-muted-foreground font-light">
        {formatDate(event.date)}
      </div>
    </div>
  );
};

export default EventHeader;