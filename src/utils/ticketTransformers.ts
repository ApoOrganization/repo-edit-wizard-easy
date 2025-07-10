import { TicketCategory, EventTicketsResponse } from '@/hooks/useEventTickets';
import { ProviderData, CategoryData } from '@/hooks/useEventAnalyticsEnhanced';

/**
 * Transforms tickets data from get-event-tickets format to CategoryPriceTable format
 */
export const transformTicketsToProviderData = (
  tickets: EventTicketsResponse['tickets']
): ProviderData => {
  const providerData: ProviderData = {};

  // Helper function to calculate last_update from sellout_duration_days
  const calculateLastUpdate = (selloutDurationDays: number | null): string | undefined => {
    if (selloutDurationDays === null) return undefined;
    
    const now = new Date();
    const lastUpdateDate = new Date(now.getTime() - (selloutDurationDays * 24 * 60 * 60 * 1000));
    return lastUpdateDate.toISOString();
  };

  // Transform each provider's data
  Object.entries(tickets).forEach(([providerName, categories]) => {
    if (categories && Object.keys(categories).length > 0) {
      const transformedCategories: CategoryData[] = Object.entries(categories).map(
        ([categoryName, ticketCategory]: [string, TicketCategory]) => ({
          name: categoryName,
          price: ticketCategory.price,
          sold_out: ticketCategory.is_sold_out,
          last_update: calculateLastUpdate(ticketCategory.sellout_duration_days)
        })
      );

      providerData[providerName] = transformedCategories;
    }
  });

  return providerData;
};

/**
 * Checks if any provider has ticket data
 */
export const hasAnyTicketData = (
  tickets: EventTicketsResponse['tickets']
): boolean => {
  return Object.values(tickets).some(
    categories => categories && Object.keys(categories).length > 0
  );
};

/**
 * Gets total categories count across all providers
 */
export const getTotalCategoriesCount = (
  tickets: EventTicketsResponse['tickets']
): number => {
  return Object.values(tickets).reduce((total, categories) => {
    if (categories && Object.keys(categories).length > 0) {
      return total + Object.keys(categories).length;
    }
    return total;
  }, 0);
};