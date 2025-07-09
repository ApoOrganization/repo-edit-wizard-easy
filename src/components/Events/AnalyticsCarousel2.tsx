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
        
        // Since we're now using single column layout, we can always show the chart
        // We only need to notify parent if chart would be too wide for the carousel
        const maxCategories = Math.max(
          ...Object.values(providers).map(categories => categories.length),
          0
        );
        
        // Check if table is too wide for the carousel (this will move chart to next slide)
        const tableMinWidth = Math.min(maxCategories * 120, 800); // Allow wider table now
        const shouldShowChart = hasBubiletData && width >= 600; // Minimum width for chart
        setShowChart(shouldShowChart);
        
        // Notify parent about overflow state (when table is very wide)
        if (onComponentOverflow) {
          onComponentOverflow(maxCategories > 6 && hasBubiletData); // Move to next slide if > 6 categories
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
      {/* Single column layout: Table on top, Chart below */}
      <div className="space-y-6">
        {/* Always show table */}
        <div className="h-[250px]">
          <CategoryPriceTable providers={providers} />
        </div>
        
        {/* Show chart if we have Bubilet data */}
        {hasBubiletData && (
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
        )}
      </div>
    </div>
  );
};

export default AnalyticsCarousel2;