
import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";

interface ArtistInfoCardProps {
  event: Event;
}

const ArtistInfoCard = ({ event }: ArtistInfoCardProps) => {
  // For now, we'll use the first artist from the event
  const primaryArtist = event.artists[0];

  if (!primaryArtist) {
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
          <Link to={`/artists/${primaryArtist.id}`} className="hover:text-primary transition-colors">
            {primaryArtist.name}
          </Link>
          <Badge variant="outline" className="text-xs">{primaryArtist.genre}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <p className="text-lg font-semibold">{primaryArtist.followers.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Monthly Listeners</p>
            <p className="text-lg font-semibold">{primaryArtist.monthlyListeners.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Top 5 Cities</p>
          <div className="space-y-1">
            {primaryArtist.topCities.slice(0, 5).map((city, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{city}</span>
                <span className="text-muted-foreground">
                  {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
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
          
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistInfoCard;
