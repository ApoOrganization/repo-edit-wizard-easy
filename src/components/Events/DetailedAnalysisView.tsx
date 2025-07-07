import { Event } from "@/data/types";
import { EventAnalytics } from "@/hooks/useEventAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DetailedAnalysisViewProps {
  event: Event;
  analytics?: EventAnalytics['analytics'];
}

const DetailedAnalysisView = ({ event, analytics }: DetailedAnalysisViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Market Analysis Card */}
        <div className="h-[480px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Detailed market analysis coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Competition Analysis Card */}
        <div className="h-[280px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Competition Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Competition analysis coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Performance Metrics Card */}
        <div className="h-[350px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Performance metrics coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Insights Card */}
        <div className="h-[410px]">
          <Card className="media-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">
                  AI-powered insights coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysisView;