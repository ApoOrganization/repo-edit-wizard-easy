import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Instagram, Music, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UpcomingEventsCard from "@/components/shared/UpcomingEventsCard";
import { EnhancedCalendar } from "@/components/shared/EnhancedCalendar";
import { ArtistDetails } from "@/types/artist.types";
const ArtistDetail = () => {
  const {
    id
  } = useParams();
  const {
    data: artistDetails,
    isLoading,
    error
  } = useQuery<ArtistDetails>({
    queryKey: ['artist-details', id],
    queryFn: async () => {
      if (!id) throw new Error('Artist ID is required');
      
      const { data, error } = await supabase.functions.invoke('get-artist-details', {
        body: {
          artistId: id
        }
      });

      if (error) {
        console.error('Error fetching artist details:', error);
        throw new Error(`Failed to fetch artist details: ${error.message}`);
      }

      if (!data || !data.artist) {
        throw new Error('Artist not found');
      }

      return data;
    },
    enabled: !!id
  });
  const artist = artistDetails?.artist;
  const stats = artistDetails?.stats;
  const upcomingEvents = artistDetails?.upcoming_events || [];
  const recentEvents = artistDetails?.recent_events || [];
  const topVenues = artistDetails?.top_venues || [];
  const topCities = artistDetails?.top_cities || [];
  const artistEvents = [...(upcomingEvents || []), ...(recentEvents || [])];
  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Artist...</h1>
        </div>
      </div>;
  }
  if (error || !artist) {
    return <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Artist Not Found</h1>
        </div>
      </div>;
  }
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  return <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/artists" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Artists
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground font-manrope">{artist?.name}</h1>
            <Badge variant="secondary" className="text-xs">
              Artist
            </Badge>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Artist Overview Card */}
            <Card className="h-[480px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Artist Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 h-full flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Spotify Metrics */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Spotify Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs">Total Events</span>
                          <span className="text-xs font-medium">{stats?.total_events || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs">Upcoming Events</span>
                          <span className="text-xs font-medium">{stats?.upcoming_events || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs">Past Events</span>
                          <span className="text-xs font-medium">{stats?.past_events || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs">Cities Performed</span>
                          <span className="text-xs font-medium">{stats?.cities_performed || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Venues */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Top Venues</h4>
                      <div className="space-y-1">
                        {topVenues.slice(0, 5).map((venue: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-xs">{venue.name || venue.venue_name || 'Unknown Venue'}</span>
                            <span className="text-xs text-muted-foreground">{venue.event_count || 1}</span>
                          </div>
                        ))}
                        {topVenues.length === 0 && (
                          <p className="text-xs text-muted-foreground">No venue data available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Cities */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Top Cities</h4>
                    <div className="space-y-1">
                      {topCities.slice(0, 5).map((city: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-xs">{city.name || city.city_name || 'Unknown City'}</span>
                          <span className="text-xs text-muted-foreground">{city.event_count || 1}</span>
                        </div>
                      ))}
                      {topCities.length === 0 && (
                        <p className="text-xs text-muted-foreground">No city data available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links & Stats - Bottom Section */}
                <div className="mt-6 space-y-4">
                  {/* Social Links */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Links</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <Instagram className="h-3 w-3" />
                      </Button>
                      {artist?.spotify_link && (
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" asChild>
                          <a href={artist.spotify_link} target="_blank" rel="noopener noreferrer">
                            <Music className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      
                      
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Events Card */}
            <UpcomingEventsCard events={upcomingEvents} title="Upcoming Shows" maxEvents={5} />
            
            {/* Biography Card - Simple version */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Biography</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    {artist?.name} is a talented artist known for their captivating performances and strong audience connection. 
                    With {stats?.total_events || 0} total events and {stats?.upcoming_events || 0} upcoming shows, they maintain an active touring schedule.
                  </p>
                  <p>
                    Having performed in {stats?.cities_performed || 0} different cities, {artist?.name} continues to expand their reach and 
                    connect with audiences across diverse markets{topCities.length > 0 ? `, including ${topCities.slice(0, 3).map((city: any) => city.name || city.city_name).join(', ')}` : ''}.
                  </p>
                  <p>
                    Their consistent touring schedule and strong performance history demonstrate their commitment to live music and fan engagement. 
                    {artist?.name} represents the dedication and artistry that defines today's touring musicians.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Calendar */}
        <div className="mt-8">
          <EnhancedCalendar events={artistEvents || []} title="Tour Calendar" entityType="artist" />
        </div>
      </div>
    </div>;
};
export default ArtistDetail;