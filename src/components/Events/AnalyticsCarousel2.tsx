import { useState, useEffect, useRef } from "react";
import { Event } from "@/data/types";
import { EventAnalyticsEnhancedResponse } from "@/hooks/useEventAnalyticsEnhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventTickets } from "@/hooks/useEventTickets";
import { TicketCategoriesCard } from "./TicketCategoriesCard";
import { RevenueMetricsCard } from "./RevenueMetricsCard";
import { TicketSalesTimeSeriesChart } from "./TicketSalesTimeSeriesChart";
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

  // Use new ticket data hook
  const { data: ticketData, isLoading: ticketLoading, error: ticketError } = useEventTickets(event.id);

  const hasBubiletData = enhancedData?.hasBubiletData || !!ticketData?.bubilet_sales;
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
      <div className="space-y-6">
        {/* Show new ticket components if we have ticket data */}
        {ticketData ? (
          <>
            {/* 1. Ticket Categories */}
            <TicketCategoriesCard 
              categories={ticketData.tickets.bubilet} 
              isLoading={ticketLoading}
            />
            
            {/* 2. Revenue Metrics */}
            <RevenueMetricsCard
              revenueRealized={ticketData.bubilet_sales.revenue_realized}
              remainingRevenue={ticketData.bubilet_sales.remaining_revenue}
              totalPotentialRevenue={ticketData.bubilet_sales.total_potential_revenue}
              isLoading={ticketLoading}
            />
            
            {/* 3. Time Series Chart */}
            {ticketData.bubilet_sales.timeseries && ticketData.bubilet_sales.timeseries.length > 0 && (
              <TicketSalesTimeSeriesChart
                timeseries={ticketData.bubilet_sales.timeseries}
                isLoading={ticketLoading}
              />
            )}
          </>
        ) : (
          <>
            {/* Fallback to original components when no ticket data */}
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
          </>
        )}
        
        {/* Show loading state */}
        {ticketLoading && !ticketData && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading ticket data...</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Show error state */}
        {ticketError && !ticketData && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load ticket data. Showing fallback data.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCarousel2;