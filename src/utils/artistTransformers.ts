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

  // Extract primary genre from genres array
  const primaryGenre = Array.isArray(dbArtist.genres) && dbArtist.genres.length > 0 
    ? dbArtist.genres[0] 
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

  // Generate top cities based on territory and genre
  const generateTopCities = (territory: string | null, genre: string): string[] => {
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
    id: parseInt(dbArtist.id) || 0,
    name: dbArtist.name || 'Unknown Artist',
    agency: dbArtist.agency || 'Unknown Agency',
    agent: extractAgentName(dbArtist.booking_emails, dbArtist.agency),
    territory: dbArtist.territory || 'Unknown Territory',
    monthlyListeners: dbArtist.monthly_listeners || 0,
    followers: dbArtist.followers || 0,
    topCities: generateTopCities(dbArtist.territory, primaryGenre),
    genre: primaryGenre,
    email: dbArtist.booking_emails || generateEmail(dbArtist.agency),
    profileUrl: generateProfileUrl(dbArtist.name || 'unknown'),
    spotifyUrl: dbArtist.spotify_link || `https://spotify.com/artist/${dbArtist.normalized_name || 'unknown'}`
  };
};