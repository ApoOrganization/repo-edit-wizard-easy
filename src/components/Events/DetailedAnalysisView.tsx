import { Event } from "@/data/types";
import { EventAnalyticsEnhancedResponse } from "@/hooks/useEventAnalyticsEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPriceTable from "./CategoryPriceTable";

interface DetailedAnalysisViewProps {
  event: Event;
  enhancedData?: EventAnalyticsEnhancedResponse;
}

const DetailedAnalysisView = ({ event, enhancedData }: DetailedAnalysisViewProps) => {
  const hasBubiletData = enhancedData?.hasBubiletData;
  const providers = enhancedData?.providers || {};
  const analytics = enhancedData?.analytics;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Table ALWAYS shows (all providers) */}
        <div className="h-[300px]">
          <CategoryPriceTable providers={providers} />
        </div>
        
        {/* Chart ONLY shows if Bubilet exists */}
        {hasBubiletData && (
          <div className="h-[400px]">
            <Card className="media-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Sales Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Sales history chart coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Right Column changes based on Bubilet */}
      <div className="space-y-8">
        {hasBubiletData ? (
          <>
            {/* Bubilet-specific components */}
            <div className="h-[350px]">
              <Card className="media-card h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Remaining Tickets</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Remaining tickets analysis coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[410px]">
              <Card className="media-card h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Revenue analytics coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Default components when no Bubilet data */}
            <div className="h-[350px]">
              <Card className="media-card h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Market analysis coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[410px]">
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
          </>
        )}
      </div>
    </div>
  );
};

export default DetailedAnalysisView;