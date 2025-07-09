import { useState, useEffect, useRef } from "react";
import { Event } from "@/data/types";
import { EventAnalyticsEnhancedResponse } from "@/hooks/useEventAnalyticsEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPriceTable from "./CategoryPriceTable";
import TicketSalesChart from "./TicketSalesChart";

interface AnalyticsCarousel2Props {
  event: Event;
  enhancedData?: EventAnalyticsEnhancedResponse;
  onComponentOverflow?: (hasOverflow: boolean) => void;
}

const AnalyticsCarousel2 = ({ event, enhancedData, onComponentOverflow }: AnalyticsCarousel2Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  const hasBubiletData = enhancedData?.hasBubiletData;
  const providers = enhancedData?.providers || {};

  // Monitor container width and determine if we need to shift components
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Calculate if we have enough space for both table and chart
        // If container is too narrow or there are many categories, hide chart
        const maxCategories = Math.max(
          ...Object.values(providers).map(categories => categories.length),
          0
        );
        
        const tableMinWidth = Math.min(maxCategories * 120, 480); // ~120px per category, max 480px
        const chartMinWidth = 400; // Minimum width for chart
        const totalMinWidth = tableMinWidth + chartMinWidth + 32; // 32px for gap
        
        const shouldShowChart = hasBubiletData && width >= totalMinWidth;
        setShowChart(shouldShowChart);
        
        // Notify parent about overflow state
        if (onComponentOverflow) {
          onComponentOverflow(!shouldShowChart && hasBubiletData);
        }
      }
    };

    updateWidth();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [providers, hasBubiletData, onComponentOverflow]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Always show table, conditionally show chart */}
      {showChart && hasBubiletData ? (
        // Two-column layout: Table + Chart
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 h-full">
          {/* Left Column - Table */}
          <div className="space-y-8">
            <div className="h-[300px]">
              <CategoryPriceTable providers={providers} />
            </div>
          </div>
          
          {/* Right Column - Chart */}
          <div className="space-y-8">
            <div className="h-[400px]">
              {enhancedData?.bubiletSalesHistory ? (
                <TicketSalesChart salesHistory={enhancedData.bubiletSalesHistory} />
              ) : (
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
              )}
            </div>
          </div>
        </div>
      ) : (
        // Single-column layout: Just Table
        <div className="w-full">
          <div className="h-[300px] max-w-4xl mx-auto">
            <CategoryPriceTable providers={providers} />
          </div>
          
          {/* Show notice if chart was moved due to space constraints */}
          {hasBubiletData && !showChart && (
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Sales chart moved to next slide due to table width
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCarousel2;