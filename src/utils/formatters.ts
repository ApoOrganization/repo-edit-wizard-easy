/**
 * Utility functions for formatting numbers, percentages, and currency
 * Used throughout the artist analytics pages
 */

/**
 * Format large numbers with K/M suffix
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2M", "350K", "100")
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
}

/**
 * Format percentage with +/- sign
 * @param value - Percentage value (as decimal, e.g., 0.155 for 15.5%)
 * @returns Formatted string (e.g., "+15.5%", "-8.3%", "0%")
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  const percentage = value * 100;
  
  if (percentage === 0) {
    return '0%';
  }
  
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
}

/**
 * Format currency amounts
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted string (e.g., "$45.50", "$1,234.00", "₺1,234.00")
 */
export function formatCurrency(amount: number | null | undefined, currency: string = '$'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0.00`;
  }
  
  // For Turkish Lira, format with thousands separator
  if (currency === '₺') {
    return `${currency}${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Format score values (0-100 range)
 * @param score - Score value
 * @returns Formatted string (e.g., "85", "0")
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    return '0';
  }
  
  return Math.round(score).toString();
}

/**
 * Format decimal percentage (already in percentage form)
 * @param value - Percentage value (e.g., 15.5 for 15.5%)
 * @returns Formatted string (e.g., "15.5%")
 */
export function formatDecimalPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(1)}%`;
}

/**
 * Format similarity score as percentage
 * @param score - Similarity score (0-1 range)
 * @returns Formatted string (e.g., "85%")
 */
export function formatSimilarityScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    return '0%';
  }
  
  return `${Math.round(score * 100)}%`;
}

/**
 * Format day of week for display
 * @param day - Day string from backend
 * @returns Formatted day name
 */
export function formatDayOfWeek(day: string): string {
  const dayMap: { [key: string]: string } = {
    'monday': 'Monday',
    'tuesday': 'Tuesday', 
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'mon': 'Monday',
    'tue': 'Tuesday',
    'wed': 'Wednesday', 
    'thu': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };
  
  return dayMap[day.toLowerCase()] || day;
}

/**
 * Safe array access with fallback
 * @param arr - Array to access
 * @param index - Index to access
 * @param fallback - Fallback value
 * @returns Value at index or fallback
 */
export function safeArrayAccess<T>(arr: T[] | null | undefined, index: number, fallback: T): T {
  if (!arr || !Array.isArray(arr) || index >= arr.length || index < 0) {
    return fallback;
  }
  return arr[index] || fallback;
}

/**
 * Get primary genre from genres array
 * @param genres - Array of genres
 * @returns Primary genre or default
 */
export function getPrimaryGenre(genres: string[] | null | undefined): string {
  return safeArrayAccess(genres, 0, 'Artist');
}

/**
 * Parse comma-separated booking emails string into array
 * @param emailsString - Comma-separated emails string
 * @returns Array of cleaned email addresses
 */
export function parseBookingEmails(emailsString: string | null | undefined): string[] {
  if (!emailsString || typeof emailsString !== 'string') {
    return [];
  }
  
  return emailsString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .filter((email, index, array) => array.indexOf(email) === index); // Remove duplicates
}