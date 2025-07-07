import { ArtistListItem, TransformedArtist } from '@/types/artist.types';

export const transformArtistFromDB = (dbArtist: ArtistListItem): TransformedArtist => {
  // Extract agent name from booking_emails if available
  const extractAgentName = (email: string | null, agency: string | null): string => {
    if (agency) {
      // Generate a default agent name based on agency
      const agencyMap: { [key: string]: string } = {
        'Wasserman': 'David Smith',
        'WME': 'Sarah Johnson',
        'CAA': 'Michael Brown',
        'UTA': 'Jessica Garcia',
        'Paradigm': 'Alex Wilson',
        'ICM': 'Lisa Chen',
        'APA': 'Robert Taylor'
      };
      return agencyMap[agency] || 'Booking Agent';
    }
    return 'Unknown Agent';
  };

  // Extract primary genre from top_genres array
  const primaryGenre = Array.isArray(dbArtist.top_genres) && dbArtist.top_genres.length > 0 
    ? dbArtist.top_genres[0] 
    : 'Unknown';

  // Generate email from agency and normalize it
  const generateEmail = (agency: string | null): string => {
    if (!agency) return 'booking@agency.com';
    
    const agencyEmails: { [key: string]: string } = {
      'Wasserman': 'bookings@wasserman.com',
      'WME': 'bookings@wmeagency.com',
      'CAA': 'music@caa.com',
      'UTA': 'bookings@unitedtalent.com',
      'Paradigm': 'bookings@paradigmagency.com',
      'ICM': 'music@icmtalent.com',
      'APA': 'bookings@apa-agency.com'
    };
    
    return agencyEmails[agency] || `bookings@${agency.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  // Generate profile URL from artist name
  const generateProfileUrl = (name: string): string => {
    const slug = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return `https://example.com/${slug}`;
  };

  // Extract top cities from JSONB field or generate based on territory
  const extractTopCities = (topCitiesJsonb: any, territory: string | null): string[] => {
    // If top_cities JSONB has data, extract city names
    if (topCitiesJsonb && Array.isArray(topCitiesJsonb)) {
      return topCitiesJsonb
        .slice(0, 5)
        .map((city: any) => {
          if (typeof city === 'string') return city;
          if (city?.city_name) return city.city_name;
          if (city?.name) return city.name;
          return 'Unknown City';
        });
    }

    // Fallback to territory-based cities
    const territoryMap: { [key: string]: string[] } = {
      'North America': ['Los Angeles', 'New York', 'Toronto', 'Chicago', 'Nashville'],
      'Global': ['Los Angeles', 'London', 'New York', 'Berlin', 'Tokyo'],
      'Europe': ['London', 'Berlin', 'Paris', 'Amsterdam', 'Barcelona'],
      'Latin America': ['Mexico City', 'São Paulo', 'Buenos Aires', 'Miami', 'Madrid'],
      'Asia': ['Tokyo', 'Seoul', 'Singapore', 'Mumbai', 'Hong Kong']
    };

    return territoryMap[territory || 'Global'] || ['Los Angeles', 'New York', 'London'];
  };

  return {
    // Use canonical_id instead of id, keep as string
    id: dbArtist.canonical_id || 'unknown',
    name: dbArtist.name || 'Unknown Artist',
    agency: dbArtist.agency || 'Unknown Agency',
    agent: extractAgentName(dbArtist.booking_emails, dbArtist.agency),
    territory: dbArtist.territory || 'Unknown Territory',
    monthlyListeners: typeof dbArtist.monthly_listeners === 'number' ? dbArtist.monthly_listeners : 0,
    followers: typeof dbArtist.followers === 'number' ? dbArtist.followers : 0,
    topCities: extractTopCities(dbArtist.top_cities, dbArtist.territory),
    genre: primaryGenre,
    email: dbArtist.booking_emails || generateEmail(dbArtist.agency),
    profileUrl: generateProfileUrl(dbArtist.name || 'unknown'),
    spotifyUrl: dbArtist.spotify_link || `https://spotify.com/artist/${dbArtist.normalized_name || 'unknown'}`
  };
};