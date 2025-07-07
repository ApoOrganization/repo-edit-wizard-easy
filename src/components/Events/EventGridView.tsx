import { Event } from "@/data/types";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import OverviewCard from "./OverviewCard";
import VenueCard from "./VenueCard";
import CampaignInfoCard from "./CampaignInfoCard";
import ArtistInfoCard from "./ArtistInfoCard";

interface EventGridViewProps {
  event: Event;
  analytics?: EventAnalytics['analytics'];
}

const EventGridView = ({ event, analytics }: EventGridViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Overview Card */}
        <div className="h-[480px]">
          <OverviewCard event={event} analytics={analytics} />
        </div>
        
        {/* Venue Analysis Card */}
        <div className="h-[280px]">
          <VenueCard event={event} />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Campaign & Info Card */}
        <div className="h-[350px]">
          <CampaignInfoCard event={event} />
        </div>
        
        {/* Artist Info Card */}
        <div className="h-[410px]">
          <ArtistInfoCard event={event} />
        </div>
      </div>
    </div>
  );
};

export default EventGridView;