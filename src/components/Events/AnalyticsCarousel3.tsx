import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsCarousel3Props {
  event: Event;
  hasOverflowFromCarousel2?: boolean;
}

const AnalyticsCarousel3 = ({ event, hasOverflowFromCarousel2 }: AnalyticsCarousel3Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Show message when overflow from carousel 2 */}
        {hasOverflowFromCarousel2 ? (
          <div className="h-[400px]">
            <Card className="media-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Extended Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Extended analytics for overflow content coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Placeholder for future additional components */
          <div className="h-[400px]">
            <Card className="media-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Additional Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Additional analytics coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Right Column - Always show right-column components */}
      <div className="space-y-8">
        <div className="h-[350px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Event Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Event insights coming soon...
                </p>
              </div>
                </CardContent>
              </Card>
        </div>
        
        <div className="h-[410px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Event Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Event metrics coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCarousel3;