/**
 * Parse event name string to extract event title and venue/location
 * Example: "%100 Metal Sunar: Blind Guardian | İstanbul" 
 * Returns: { title: "Blind Guardian", presenter: "%100 Metal Sunar", location: "İstanbul" }
 */
export function parseEventName(eventName: string) {
  const parts = eventName.split('|');
  const location = parts[1]?.trim() || '';
  
  const titlePart = parts[0]?.trim() || eventName;
  const colonIndex = titlePart.indexOf(':');
  
  if (colonIndex > -1) {
    const presenter = titlePart.substring(0, colonIndex).trim();
    const title = titlePart.substring(colonIndex + 1).trim();
    return { title, presenter, location };
  }
  
  return { title: titlePart, presenter: '', location };
}

/**
 * Get a shortened version of the event name for display
 * Prioritizes the main event title over presenter info
 */
export function getEventDisplayName(eventName: string, maxLength: number = 40) {
  const { title, location } = parseEventName(eventName);
  
  let displayName = title;
  if (location && displayName.length + location.length + 3 <= maxLength) {
    displayName = `${title} - ${location}`;
  }
  
  if (displayName.length > maxLength) {
    return displayName.substring(0, maxLength - 3) + '...';
  }
  
  return displayName;
}

/**
 * Format event name for tooltips (can be longer)
 */
export function formatEventNameForTooltip(eventName: string) {
  const { title, presenter, location } = parseEventName(eventName);
  
  if (presenter && location) {
    return `${title} (${presenter}) - ${location}`;
  } else if (location) {
    return `${title} - ${location}`;
  } else if (presenter) {
    return `${title} (${presenter})`;
  }
  
  return title;
}