import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import EventHeader from "@/components/Events/EventHeader";
import EventMeta from "@/components/Events/EventMeta";
import EventDetailContainer from "@/components/Events/EventDetailContainer";
import { useEventAnalytics } from "@/hooks/useEventAnalytics";
import { useEventAnalyticsEnhanced } from "@/hooks/useEventAnalyticsEnhanced";
import { transformEventFromDB } from "@/utils/eventTransformers";

const EventDetail = () => {
  const { id } = useParams();
  
  // Fetch event basic data from database
  const { data: eventData, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      // Try to get from the same table we use for events list
      const { data, error } = await supabase
        .from('event_list_summary')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
    retry: 2,
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useEventAnalytics(id);
  
  // Fetch enhanced analytics data
  const { data: enhancedData, isLoading: enhancedLoading, error: enhancedError } = useEventAnalyticsEnhanced(id);

  const isLoading = eventLoading || analyticsLoading || enhancedLoading;
  const event = eventData ? transformEventFromDB(eventData) : null;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Event...</h1>
          <p className="text-sm text-muted-foreground">
            {eventLoading && "Loading event details..."}
            {analyticsLoading && !eventLoading && "Loading analytics..."}
          </p>
        </div>
      </div>
    );
  }

  if (eventError || !event || !eventData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Event Not Found</h1>
          <p className="text-sm text-muted-foreground">
            {eventError ? 'Error loading event data.' : 'The requested event could not be found.'}
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
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

        {/* Analytics Error Warning */}
        {analyticsError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Notice:</strong> Analytics data could not be loaded. Basic event information is still available.
            </p>
          </div>
        )}

        {/* Event Detail Container with Carousel */}
        <EventDetailContainer 
          event={event} 
          analytics={analyticsData?.analytics}
          eventData={analyticsData?.event}
          enhancedData={enhancedData}
        />
      </div>
    </div>
  );
};

export default EventDetail;