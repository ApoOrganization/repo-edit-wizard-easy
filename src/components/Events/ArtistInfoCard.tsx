
import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ArtistInfoCardProps {
  event: Event;
  eventData?: any; // Raw event data from edge function response
}

const ArtistInfoCard = ({ event, eventData }: ArtistInfoCardProps) => {
  const navigate = useNavigate();
  // Use real artist data from edge function response
  const primaryArtist = event.artists[0]; // For display name and genre
  const realArtistData = eventData?.artists?.[0]; // For real database values

  const handleArtistNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use real artist ID from eventData if available
    const artistId = eventData?.artists?.[0]?.id;
    
    if (!artistId) {
      console.error('No artist ID available for navigation');
      return;
    }
    
    console.log('Artist navigation clicked:', primaryArtist.name);
    console.log('Navigating to artist ID:', artistId);
    navigate(`/artists/${artistId}`);
  };

  if (!primaryArtist && !realArtistData) {
    return (
      <Card className="media-card h-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No artist information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="media-card h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={handleArtistNavigation}>
            {realArtistData?.name || primaryArtist?.name || 'Unknown Artist'}
          </span>
          <Badge variant="outline" className="text-xs">{primaryArtist?.genre || 'Unknown'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Agency</p>
            <p className="text-lg font-semibold">
              {realArtistData?.agency || 'Agency will be added later'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <p className="text-lg font-semibold">
              {realArtistData?.followers ? 
                realArtistData.followers.toLocaleString() : 
                'Followers will be added later'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Monthly Listeners</p>
            <p className="text-lg font-semibold">
              {realArtistData?.monthly_listeners ? 
                realArtistData.monthly_listeners.toLocaleString() : 
                'Monthly listeners will be added later'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Spotify Link</p>
          <p className="text-sm">
            {realArtistData?.spotify_link ? (
              <a 
                href={realArtistData.spotify_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on Spotify
              </a>
            ) : (
              <span className="text-muted-foreground">Spotify link will be added later</span>
            )}
          </p>
        </div>

        {/* Bottom Symbol Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="p-2">
              📷
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              🎧
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 cursor-pointer hover:bg-accent transition-colors" 
            onClick={handleArtistNavigation}
            title={`View ${realArtistData?.name || primaryArtist?.name || 'artist'} details`}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistInfoCard;
