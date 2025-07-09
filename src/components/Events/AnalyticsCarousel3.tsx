import { Event } from "@/data/types";
import { EventAnalyticsEnhancedResponse } from "@/hooks/useEventAnalyticsEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketSalesChart from "./TicketSalesChart";
import SalesInsightsCard from "./SalesInsightsCard";

interface AnalyticsCarousel3Props {
  event: Event;
  enhancedData?: EventAnalyticsEnhancedResponse;
  hasOverflowFromCarousel2?: boolean;
}

const AnalyticsCarousel3 = ({ event, enhancedData, hasOverflowFromCarousel2 }: AnalyticsCarousel3Props) => {
  const hasBubiletData = enhancedData?.hasBubiletData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Show chart and insights when overflow from carousel 2 */}
        {hasOverflowFromCarousel2 && hasBubiletData && enhancedData?.bubiletSalesHistory ? (
          <>
            <div className="h-[400px]">
              <TicketSalesChart salesHistory={enhancedData.bubiletSalesHistory} />
            </div>
            <div className="h-[400px]">
              <SalesInsightsCard salesHistory={enhancedData.bubiletSalesHistory} />
            </div>
          </>
        ) : hasOverflowFromCarousel2 && hasBubiletData ? (
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

export default AnalyticsCarousel3;