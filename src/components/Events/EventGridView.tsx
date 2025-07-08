import { Event } from "@/data/types";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import OverviewCard from "./OverviewCard";
import VenueCard from "./VenueCard";
import PromoterInfoCard from "./PromoterInfoCard";
import ArtistInfoCard from "./ArtistInfoCard";

interface EventGridViewProps {
  event: Event;
  analytics?: EventAnalytics['analytics'];
  eventData?: any; // Raw event data from edge function response
}

const EventGridView = ({ event, analytics, eventData }: EventGridViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Overview Card */}
        <div className="h-[480px]">
          <OverviewCard event={event} analytics={analytics} eventData={eventData} />
        </div>
        
        {/* Venue Analysis Card */}
        <div className="h-[280px]">
          <VenueCard event={event} eventData={eventData} />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Promoter Info Card */}
        <div className="h-[350px]">
          <PromoterInfoCard event={event} eventData={eventData} />
        </div>
        
        {/* Artist Info Card */}
        <div className="h-[410px]">
          <ArtistInfoCard event={event} eventData={eventData} />
        </div>
      </div>
    </div>
  );
};

export default EventGridView;