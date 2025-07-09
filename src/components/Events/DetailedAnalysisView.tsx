import { Event } from "@/data/types";
import { useEventAnalyticsEnhanced } from "@/hooks/useEventAnalyticsEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPriceTable from "./CategoryPriceTable";

interface DetailedAnalysisViewProps {
  event: Event;
}

const DetailedAnalysisView = ({ event }: DetailedAnalysisViewProps) => {
  // Fetch enhanced analytics data with provider information
  const { data: enhancedData } = useEventAnalyticsEnhanced(event.id);
  const analytics = enhancedData?.analytics;
  const providers = enhancedData?.providers || {};
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Category Price Table */}
        <div className="h-[300px]">
          <CategoryPriceTable providers={providers} />
        </div>
        
        {/* Market Analysis Card */}
        <div className="h-[460px]">
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