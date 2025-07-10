import { useState, useEffect, useRef } from "react";
import { Event } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventTickets } from "@/hooks/useEventTickets";
import { RevenueMetricsCard } from "./RevenueMetricsCard";
import { TicketSalesTimeSeriesChart } from "./TicketSalesTimeSeriesChart";
import CategoryPriceTable from "./CategoryPriceTable";
import { transformTicketsToProviderData, hasAnyTicketData, getTotalCategoriesCount } from "@/utils/ticketTransformers";

interface AnalyticsCarousel2Props {
  event: Event;
  onComponentOverflow?: (hasOverflow: boolean) => void;
}

const AnalyticsCarousel2 = ({ event, onComponentOverflow }: AnalyticsCarousel2Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  // Use new ticket data hook
  const { data: ticketData, isLoading: ticketLoading, error: ticketError } = useEventTickets(event.id);

  // Check if any provider has ticket data
  const hasTicketData = ticketData?.tickets ? hasAnyTicketData(ticketData.tickets) : false;
  
  // Transform ticket data to provider format for CategoryPriceTable
  const providerData = ticketData?.tickets ? transformTicketsToProviderData(ticketData.tickets) : {};
  
  // Check if sales data exists and has meaningful values
  const hasSalesData = ticketData?.bubilet_sales && (
    ticketData.bubilet_sales.revenue_realized > 0 ||
    ticketData.bubilet_sales.remaining_revenue > 0 ||
    ticketData.bubilet_sales.total_potential_revenue > 0
  );

  // Monitor container width and determine if we need to shift components
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Determine overflow based on total ticket categories count across all providers
        const categoriesCount = hasTicketData && ticketData?.tickets ? 
          getTotalCategoriesCount(ticketData.tickets) : 0;
        
        // Notify parent about overflow state (when table is very wide)
        if (onComponentOverflow) {
          onComponentOverflow(categoriesCount > 6 && hasTicketData);
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
  }, [hasTicketData, ticketData, onComponentOverflow]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="space-y-6">
        {/* Show ticket data if available */}
        {hasTicketData ? (
          <>
            {/* 1. Ticket Prices using existing CategoryPriceTable */}
            <div className="h-[250px]">
              <CategoryPriceTable 
                providers={providerData}
              />
            </div>
            
            {/* 2. Revenue Metrics - only if sales data exists */}
            {hasSalesData && ticketData.bubilet_sales && (
              <RevenueMetricsCard
                revenueRealized={ticketData.bubilet_sales.revenue_realized}
                remainingRevenue={ticketData.bubilet_sales.remaining_revenue}
                totalPotentialRevenue={ticketData.bubilet_sales.total_potential_revenue}
                isLoading={ticketLoading}
              />
            )}
            
            {/* 3. Time Series Chart - only if sales data and timeseries exist */}
            {hasSalesData && ticketData.bubilet_sales?.timeseries && ticketData.bubilet_sales.timeseries.length > 0 && (
              <TicketSalesTimeSeriesChart
                timeseries={ticketData.bubilet_sales.timeseries}
                isLoading={ticketLoading}
              />
            )}
          </>
        ) : (
          /* Show message when no ticket data */
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  No ticket information available for this event.
                </p>
              </div>
            </CardContent>
          </Card>
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