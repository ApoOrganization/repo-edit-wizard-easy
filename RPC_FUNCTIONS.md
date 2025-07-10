# RPC Functions Documentation

This document provides comprehensive documentation for all Supabase RPC (Remote Procedure Call) functions used in the application, including request/response examples and integration patterns.

## Table of Contents

1. [Calendar Functions](#1-calendar-functions)
2. [Event Listing Functions](#2-event-listing-functions)
3. [General Integration Notes](#3-general-integration-notes)

---

## 1. Calendar Functions

### 1.1 get_promoter_calendar

**Purpose**: Retrieves calendar events for a specific promoter by month and year.

**Parameters**:
- `promoter_uuid` (UUID): The unique identifier for the promoter
- `year_param` (INTEGER): The year for calendar data (e.g., 2024)
- `month_param` (INTEGER): The month for calendar data (1-12)

**Request Example**:
```typescript
const { data, error } = await supabase.rpc('get_promoter_calendar', {
  promoter_uuid: '123e4567-e89b-12d3-a456-426614174000',
  year_param: 2024,
  month_param: 6
});
```

**Response Example**:
```json
[
  {
    "id": "event-uuid-1",
    "name": "Summer Rock Festival",
    "date": "2024-06-15",
    "time": "20:00:00",
    "venue_name": "Istanbul Arena",
    "venue_city": "Istanbul",
    "artist_name": "Famous Rock Band",
    "ticket_price_range": "100-300",
    "status": "on_sale",
    "capacity": 15000,
    "tickets_sold": 8500,
    "sales_percentage": 56.7
  },
  {
    "id": "event-uuid-2", 
    "name": "Jazz Night",
    "date": "2024-06-22",
    "time": "19:30:00",
    "venue_name": "Concert Hall",
    "venue_city": "Ankara",
    "artist_name": "Jazz Quartet",
    "ticket_price_range": "80-150",
    "status": "sold_out",
    "capacity": 2000,
    "tickets_sold": 2000,
    "sales_percentage": 100.0
  }
]
```

**Frontend Integration**:
```typescript
// hooks/usePromoterCalendar.ts
export const usePromoterCalendar = (
  promoterId: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ['promoter-calendar', promoterId, year, month],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_promoter_calendar', {
        promoter_uuid: promoterId,
        year_param: year,
        month_param: month
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!promoterId
  });
};
```

### 1.2 get_venue_calendar

**Purpose**: Retrieves calendar events for a specific venue by month and year.

**Parameters**:
- `venue_uuid` (UUID): The unique identifier for the venue
- `year_param` (INTEGER): The year for calendar data
- `month_param` (INTEGER): The month for calendar data (1-12)

**Request Example**:
```typescript
const { data, error } = await supabase.rpc('get_venue_calendar', {
  venue_uuid: 'venue-uuid-here',
  year_param: 2024,
  month_param: 7
});
```

**Response Example**:
```json
[
  {
    "id": "event-uuid-3",
    "name": "Classical Concert",
    "date": "2024-07-10",
    "time": "20:00:00",
    "promoter_name": "Classical Events Ltd",
    "artist_name": "Symphony Orchestra",
    "ticket_price_range": "120-250",
    "status": "on_sale",
    "capacity": 3000,
    "tickets_sold": 1800,
    "sales_percentage": 60.0,
    "genre": "Classical"
  },
  {
    "id": "event-uuid-4",
    "name": "Pop Concert",
    "date": "2024-07-25",
    "time": "21:00:00", 
    "promoter_name": "Major Promotions",
    "artist_name": "Pop Star",
    "ticket_price_range": "150-400",
    "status": "on_sale",
    "capacity": 3000,
    "tickets_sold": 2100,
    "sales_percentage": 70.0,
    "genre": "Pop"
  }
]
```

### 1.3 get_artist_calendar

**Purpose**: Retrieves calendar events for a specific artist by month and year.

**Parameters**:
- `artist_uuid` (UUID): The unique identifier for the artist
- `year_param` (INTEGER): The year for calendar data
- `month_param` (INTEGER): The month for calendar data (1-12)

**Request Example**:
```typescript
const { data, error } = await supabase.rpc('get_artist_calendar', {
  artist_uuid: 'artist-uuid-here',
  year_param: 2024,
  month_param: 8
});
```

**Response Example**:
```json
[
  {
    "id": "event-uuid-5",
    "name": "World Tour - Istanbul",
    "date": "2024-08-05",
    "time": "20:30:00",
    "venue_name": "Stadium",
    "venue_city": "Istanbul",
    "venue_capacity": 50000,
    "promoter_name": "Global Events",
    "ticket_price_range": "200-800",
    "status": "on_sale",
    "tickets_sold": 35000,
    "sales_percentage": 70.0
  },
  {
    "id": "event-uuid-6",
    "name": "World Tour - Ankara",
    "date": "2024-08-12",
    "time": "20:30:00",
    "venue_name": "Arena",
    "venue_city": "Ankara", 
    "venue_capacity": 25000,
    "promoter_name": "Global Events",
    "ticket_price_range": "200-800",
    "status": "on_sale",
    "tickets_sold": 18000,
    "sales_percentage": 72.0
  }
]
```

---

## 2. Event Listing Functions

### 2.1 get_artist_events

**Purpose**: Retrieves all events for a specific artist (used in Events tab).

**Parameters**:
- `artist_uuid` (UUID): The unique identifier for the artist

**Request Example**:
```typescript
const { data, error } = await supabase.rpc('get_artist_events', {
  artist_uuid: 'artist-uuid-here'
});
```

**Response Example**:
```json
[
  {
    "id": "event-uuid-7",
    "name": "Solo Concert Series - Show 1",
    "date": "2024-09-15",
    "venue_name": "Concert Hall",
    "venue_city": "Istanbul",
    "status": "upcoming"
  },
  {
    "id": "event-uuid-8", 
    "name": "Solo Concert Series - Show 2",
    "date": "2024-09-22",
    "venue_name": "Theater",
    "venue_city": "Izmir",
    "status": "upcoming"
  },
  {
    "id": "event-uuid-9",
    "name": "Festival Performance",
    "date": "2024-05-20",
    "venue_name": "Festival Grounds",
    "venue_city": "Antalya",
    "status": "completed"
  }
]
```

**Frontend Integration**:
```typescript
// hooks/useArtistAnalytics.ts - Events tab
export const useArtistEvents = (
  artistId: string,
  includePast: boolean = false,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['artist-events', artistId, includePast],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_artist_events', {
        artist_uuid: artistId
      });
      
      if (error) throw error;
      
      // Filter by past/upcoming in frontend
      const now = new Date();
      const filtered = data.filter(event => {
        const eventDate = new Date(event.date);
        return includePast ? eventDate < now : eventDate >= now;
      });
      
      return { events: filtered.slice(0, 10) }; // Limit to 10
    },
    enabled: !!artistId && enabled
  });
};
```

### 2.2 get_venue_events

**Purpose**: Retrieves events for a specific venue with time filtering and pagination.

**Parameters**:
- `venue_uuid` (UUID): The unique identifier for the venue
- `time_filter` (TEXT): Filter by time period ('past', 'upcoming', 'all')
- `limit_count` (INTEGER): Maximum number of events to return
- `offset_count` (INTEGER): Number of events to skip (for pagination)

**Request Example**:
```typescript
const { data, error } = await supabase.rpc('get_venue_events', {
  venue_uuid: 'venue-uuid-here',
  time_filter: 'upcoming',
  limit_count: 10,
  offset_count: 0
});
```

**Response Example**:
```json
[
  {
    "id": "event-uuid-10",
    "name": "Electronic Music Night",
    "date": "2024-10-05",
    "time": "22:00:00",
    "artist_name": "DJ Famous",
    "promoter_name": "Night Events",
    "ticket_price_range": "80-200",
    "status": "on_sale",
    "capacity": 5000,
    "tickets_sold": 2800,
    "genre": "Electronic"
  },
  {
    "id": "event-uuid-11",
    "name": "Rock Revival",
    "date": "2024-10-18",
    "time": "20:00:00",
    "artist_name": "Classic Rock Band", 
    "promoter_name": "Rock Promotions",
    "ticket_price_range": "100-300",
    "status": "on_sale",
    "capacity": 5000,
    "tickets_sold": 3200,
    "genre": "Rock"
  }
]
```

**Frontend Integration**:
```typescript
// hooks/useVenueAnalytics.ts - Events functionality
export const useVenueEvents = (
  venueId: string,
  includePast: boolean = false,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['venue-events', venueId, includePast],
    queryFn: async () => {
      const timeFilter = includePast ? 'past' : 'upcoming';
      
      const { data, error } = await supabase.rpc('get_venue_events', {
        venue_uuid: venueId,
        time_filter: timeFilter,
        limit_count: 10,
        offset_count: 0
      });

      if (error) throw error;
      return { events: data || [] };
    },
    enabled: !!venueId && enabled
  });
};
```

---

## 3. General Integration Notes

### Parameter Types

All RPC functions use standard PostgreSQL data types:
- `UUID`: Standard UUID format (e.g., `123e4567-e89b-12d3-a456-426614174000`)
- `INTEGER`: Standard integer values
- `TEXT`: String values with specific constraints

### Error Handling

RPC functions return standard PostgreSQL errors that should be handled appropriately:

```typescript
const { data, error } = await supabase.rpc('function_name', parameters);

if (error) {
  console.error('RPC Error:', {
    message: error.message,
    code: error.code,
    details: error.details
  });
  
  // Handle specific error cases
  if (error.code === '42883') {
    // Function does not exist
  } else if (error.code === '22P02') {
    // Invalid UUID format
  }
  
  throw error;
}
```

### Common Error Codes

- `42883`: Function does not exist
- `22P02`: Invalid input syntax (often UUID format issues)
- `23503`: Foreign key violation
- `42501`: Insufficient privileges

### Caching Strategy

All RPC functions should be cached using React Query:

```typescript
return useQuery({
  queryKey: ['function-name', ...parameters],
  queryFn: async () => {
    // RPC call implementation
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  enabled: !!requiredParameter
});
```

### Performance Considerations

- **Pagination**: Use `limit_count` and `offset_count` for large datasets
- **Time Filtering**: Apply filters at the database level rather than in frontend
- **Caching**: Implement appropriate cache invalidation strategies
- **Batching**: Consider batching multiple RPC calls when possible

### Authentication

All RPC functions require valid Supabase authentication:
- Row Level Security (RLS) policies may apply
- Function execution privileges are required
- Some functions may have additional role-based restrictions

### Date Handling

- All dates are returned in ISO 8601 format
- Times are in 24-hour format (HH:MM:SS)
- Timezone handling should be implemented in the frontend
- Calendar functions work with local month/year parameters

### Frontend Integration Pattern

```typescript
// Standard pattern for RPC functions
export const useRPCFunction = (param1: string, param2: number) => {
  return useQuery({
    queryKey: ['rpc-function', param1, param2],
    queryFn: async () => {
      if (!param1) throw new Error('Required parameter missing');
      
      const { data, error } = await supabase.rpc('rpc_function_name', {
        parameter_1: param1,
        parameter_2: param2
      });
      
      if (error) {
        console.error('RPC function error:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!param1,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
};
```

### Database Function Requirements

For all RPC functions to work properly, ensure:

1. **Security Definer**: Functions should be created with appropriate security settings
2. **Return Types**: Consistent return type definitions
3. **Parameter Validation**: Input validation within the function
4. **Error Handling**: Proper error messages and codes
5. **Performance**: Appropriate indexing on queried columns
6. **Documentation**: Function comments explaining purpose and parameters