
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockArtists, mockEvents } from "@/data/mockData";
import { ArrowLeft, Instagram, Spotify, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UpcomingEventsCard from "@/components/shared/UpcomingEventsCard";
import ExpandableCard from "@/components/shared/ExpandableCard";
import DetailPageCalendar from "@/components/shared/DetailPageCalendar";

const ArtistDetail = () => {
  const { id } = useParams();
  
  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockArtists.find(a => a.id === Number(id));
    },
  });

  const { data: artistEvents } = useQuery({
    queryKey: ['artist-events', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockEvents.filter(event => 
        event.artists.some(a => a.id === Number(id))
      );
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Loading Artist...</h1>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="hero">
          <h1 className="text-2xl font-bold text-foreground mb-1 font-manrope">Artist Not Found</h1>
        </div>
      </div>
    );
  }

  const upcomingEvents = artistEvents?.filter(event => 
    new Date(event.date) > new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            to="/artists" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Artists
          </Link>
        </div>

        {/* Header Section */}
        <div className="py-2">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground font-manrope">{artist.name}</h1>
            <Badge variant="secondary" className="text-xs">
              {artist.genre}
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
                          <span className="text-xs">Monthly Listeners</span>
                          <span className="text-xs font-medium">{formatNumber(artist.monthlyListeners)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-xs">Followers</span>
                          <span className="text-xs font-medium">{formatNumber(artist.followers)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Agency Information */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Agency</h4>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">{artist.agency}</p>
                        <p className="text-xs text-muted-foreground">{artist.agent}</p>
                        <p className="text-xs text-muted-foreground">{artist.territory}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Cities */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Top Cities</h4>
                    <div className="space-y-1">
                      {artist.topCities.slice(0, 5).map((city, index) => (
                        <div key={city} className="flex justify-between items-center py-1">
                          <span className="text-xs">{city}</span>
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        </div>
                      ))}
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
                      {artist.spotifyUrl && (
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <Spotify className="h-3 w-3" />
                        </Button>
                      )}
                      {artist.email && (
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                      {artist.profileUrl && (
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-lg font-semibold">{artistEvents?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Events</p>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-lg font-semibold">{upcomingEvents.length}</p>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expandable Bio Card */}
            <ExpandableCard
              title="Biography"
              defaultExpanded={false}
              maxCollapsedHeight="60px"
            >
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  {artist.name} is a {artist.genre.toLowerCase()} artist known for their innovative sound and captivating performances. 
                  With {formatNumber(artist.monthlyListeners)} monthly listeners on Spotify, they have established themselves as a major force in the music industry.
                </p>
                <p className="mt-3">
                  Represented by {artist.agency} and covering the {artist.territory} territory, {artist.name} continues to tour extensively, 
                  bringing their unique sound to fans across their top markets including {artist.topCities.slice(0, 3).join(', ')}.
                </p>
                <p className="mt-3">
                  Their music resonates with audiences worldwide, consistently drawing sold-out crowds and maintaining strong streaming numbers. 
                  {artist.name} represents the evolution of {artist.genre.toLowerCase()} music in the modern era.
                </p>
              </div>
            </ExpandableCard>
          </div>

          {/* Right Column */}
          <div>
            <UpcomingEventsCard 
              events={upcomingEvents}
              title="Upcoming Shows"
              maxEvents={5}
            />
          </div>
        </div>

        {/* Full Width Calendar */}
        <div className="mt-8">
          <DetailPageCalendar 
            events={artistEvents || []}
            title="Tour Calendar"
            entityType="artist"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
