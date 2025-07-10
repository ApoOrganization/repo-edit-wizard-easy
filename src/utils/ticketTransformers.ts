import { TicketCategory, EventTicketsResponse } from '@/hooks/useEventTickets';
import { ProviderData, CategoryData } from '@/hooks/useEventAnalyticsEnhanced';

/**
 * Transforms tickets data from get-event-tickets format to CategoryPriceTable format
 */
export const transformTicketsToProviderData = (
  tickets: EventTicketsResponse['tickets']
): ProviderData => {
  const providerData: ProviderData = {};

  // No longer need to calculate last_update from sellout_duration_days
  // sellout_duration_days represents how long it took to sell out, not when it sold out

  // Transform each provider's data
  Object.entries(tickets).forEach(([providerName, categories]) => {
    if (categories && Object.keys(categories).length > 0) {
      const transformedCategories: CategoryData[] = Object.entries(categories).map(
        ([categoryName, ticketCategory]: [string, TicketCategory]) => {
          const transformedCategory = {
            name: categoryName,
            price: ticketCategory.price,
            sold_out: ticketCategory.is_sold_out,
            sellout_duration_days: ticketCategory.sellout_duration_days,
            // Keep last_update undefined for now - not needed for sellout duration display
            last_update: undefined
          };
          
          // Debug logging for sold-out items
          if (ticketCategory.is_sold_out) {
            console.log('🔴 Sold-out ticket found:', {
              provider: providerName,
              category: categoryName,
              sellout_duration_days: ticketCategory.sellout_duration_days,
              transformed: transformedCategory
            });
          }
          
          return transformedCategory;
        }
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