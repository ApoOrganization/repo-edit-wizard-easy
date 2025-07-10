# Edge Functions Documentation

This document provides comprehensive documentation for all Supabase Edge Functions used in the application, including request/response examples and integration patterns.

## Table of Contents

1. [Market Analytics](#1-get-market-analytics)
2. [Ticket Analytics](#2-ticket-analytics-functions)
3. [Event Analytics](#3-event-analytics-functions)
4. [Artist Functions](#4-artist-functions)
5. [Promoter Analytics](#5-promoter-analytics)
6. [Venue Analytics](#6-venue-analytics)
7. [General Integration Notes](#general-integration-notes)

---

## 1. get-market-analytics

### Purpose
Retrieves comprehensive market analytics data for the dashboard overview.

### Request Parameters
None required.

### Response Example
```json
{
  "totals": {
    "revenue_realized": 15234567.89,
    "remaining_revenue": 8765432.11,
    "total_potential_revenue": 24000000.00
  },
  "timeseries": [
    {
      "date": "2024-01-01",
      "tickets_sold": 1250,
      "daily_revenue": 125000.50
    },
    {
      "date": "2024-01-02", 
      "tickets_sold": 980,
      "daily_revenue": 98750.25
    }
  ],
  "provider_distribution": {
    "Biletix": 12500,
    "Bubilet": 8750,
    "Passo": 3250
  },
  "genre_distribution": [
    {
      "count": 45,
      "genre": "Rock",
      "percentage": 35.5
    },
    {
      "count": 32,
      "genre": "Pop",
      "percentage": 25.2
    }
  ]
}
```

### Frontend Integration
```typescript
// hooks/useMarketAnalytics.ts
const { data, error } = await supabase.functions.invoke('get-market-analytics');
```

---

## 2. Ticket Analytics Functions

### 2.1 get-promoter-tickets

**Purpose**: Retrieves ticket analytics for a specific promoter.

**Request Parameters**:
```json
{
  "promoter_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response Example**:
```json
{
  "promoter_id": "123e4567-e89b-12d3-a456-426614174000",
  "totals": {
    "revenue_realized": 2500000.75,
    "remaining_revenue": 1750000.25,
    "total_potential_revenue": 4250001.00
  },
  "timeseries": [
    {
      "date": "2024-01-15",
      "events": ["event-id-1", "event-id-2"],
      "tickets_sold": 450,
      "daily_revenue": 45000.00
    }
  ],
  "events_present": {
    "event-id-1": "Rock Concert Istanbul",
    "event-id-2": "Jazz Festival Ankara"
  }
}
```

### 2.2 get-venue-tickets

**Purpose**: Retrieves ticket analytics for a specific venue.

**Request Parameters**:
```json
{
  "venue_id": "venue-uuid-here"
}
```

**Response Example**:
```json
{
  "venue_id": "venue-uuid-here",
  "totals": {
    "revenue_realized": 890000.50,
    "remaining_revenue": 610000.75,
    "total_potential_revenue": 1500001.25
  },
  "timeseries": [
    {
      "date": "2024-02-01",
      "events": ["event-a", "event-b"],
      "tickets_sold": 320,
      "daily_revenue": 32000.00
    }
  ],
  "events_present": {
    "event-a": "Concert Hall Performance",
    "event-b": "Theater Show"
  }
}
```

### 2.3 get-event-tickets

**Purpose**: Retrieves ticket data for a specific event.

**Request Parameters**:
```json
{
  "uuid": "event-uuid-here"
}
```

**Response Example**:
```json
{
  "event_id": "event-uuid-here",
  "tickets_data": [
    {
      "ticket_id": "ticket-123",
      "price": 150.00,
      "category": "VIP",
      "provider": "Biletix",
      "sold_date": "2024-01-20T14:30:00Z"
    }
  ],
  "totals": {
    "total_tickets": 500,
    "sold_tickets": 320,
    "total_revenue": 48000.00
  }
}
```

---

## 3. Event Analytics Functions

### 3.1 event-analytics-enhanced

**Purpose**: Comprehensive event analytics with detailed insights.

**Request Parameters**:
```json
{
  "eventId": "event-uuid-here"
}
```

**Response Example**:
```json
{
  "event": {
    "id": "event-uuid-here",
    "name": "Rock Festival 2024",
    "date": "2024-06-15T20:00:00Z",
    "venue_name": "Istanbul Arena",
    "artist_name": "Famous Band"
  },
  "analytics": {
    "overview": {
      "daysOnSale": 45,
      "salesStarted": "2024-01-01T00:00:00Z",
      "eventDate": "2024-06-15T20:00:00Z",
      "status": "on_sale",
      "providers": ["Biletix", "Bubilet"],
      "totalCapacity": 10000,
      "ticketsSold": 7500,
      "remaining": 2500,
      "soldPercentage": "75%"
    },
    "salesVelocity": {
      "ticketsPerDay": "166.7",
      "estimatedSelloutDays": 15
    },
    "priceComparison": {
      "marketAverage": 120.50,
      "currentPrice": 150.00,
      "difference": 29.50,
      "percentageDiff": "+24.5%"
    },
    "priceHistory": [
      {
        "date": "2024-01-01",
        "provider": "Biletix",
        "min_price": 100.00,
        "max_price": 200.00,
        "avg_price": 150.00
      }
    ],
    "similarEvents": [
      {
        "id": "similar-event-1",
        "name": "Similar Concert",
        "date": "2024-05-20",
        "venue": "Ankara Hall",
        "avgPrice": 140.00
      }
    ]
  }
}
```

### 3.2 event-analytics

**Purpose**: Basic event analytics (fallback function).

**Request Parameters**:
```json
{
  "eventId": "event-uuid-here"
}
```

**Response**: Simplified version of event-analytics-enhanced response.

---

## 4. Artist Functions

### 4.1 get-artist-list-new

**Purpose**: Advanced artist listing with comprehensive filtering and sorting.

**Request Parameters**:
```json
{
  "searchQuery": "artist name",
  "page": 1,
  "pageSize": 20,
  "sortBy": "monthly_listeners",
  "sortOrder": "desc"
}
```

**Response Example**:
```json
{
  "artists": [
    {
      "id": "artist-uuid-1",
      "name": "Famous Artist",
      "normalized_name": "famous_artist",
      "spotify_link": "https://open.spotify.com/artist/...",
      "monthly_listeners": 5000000,
      "followers": 2500000,
      "agency": "Wasserman Music",
      "territory": "Europe",
      "booking_emails": "booking@example.com",
      "social_presence": {
        "instagram": "@famousartist",
        "twitter": "@famousartist"
      },
      "total_events": 45,
      "upcoming_events": 12,
      "past_events": 33,
      "genres": ["Rock", "Alternative"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

### 4.2 search-artists

**Purpose**: Simple artist search functionality.

**Request Parameters**:
```json
{
  "search_term": "artist name",
  "min_events": 5,
  "has_upcoming_events": true,
  "page": 1,
  "page_size": 20
}
```

**Response**: Similar to get-artist-list-new but with filtered results.

### 4.3 artist-analytics

**Purpose**: Comprehensive artist analytics and insights.

**Request Parameters**:
```json
{
  "artistId": "artist-uuid-here",
  "includeComparisons": true,
  "timeRange": "year"
}
```

**Response Example**:
```json
{
  "artist": {
    "id": "artist-uuid-here",
    "name": "Artist Name",
    "normalized_name": "artist_name",
    "genres": ["Rock", "Alternative"],
    "agency": "Music Agency",
    "territory": "North America",
    "spotify_link": "https://open.spotify.com/artist/...",
    "monthly_listeners": 3500000,
    "followers": 1800000,
    "event_stats": {
      "total_events": 75,
      "avg_ticket_price": 85.50
    },
    "performance_cities": [
      {
        "city_name": "Istanbul",
        "event_count": 12,
        "avg_attendance": 8500
      }
    ],
    "favorite_venues": [
      {
        "venue_name": "Istanbul Arena",
        "city": "Istanbul",
        "performance_count": 8
      }
    ]
  },
  "analytics": {
    "diversityScore": 0.85,
    "touringIntensity": 0.72,
    "marketPenetration": 0.68,
    "growth": {
      "listener_growth_rate": 0.15,
      "event_growth_rate": 0.22,
      "venue_diversity_trend": 0.08
    }
  },
  "insights": [
    {
      "type": "growth",
      "message": "Strong listener growth of 15% in the past year"
    }
  ],
  "comparisons": [
    {
      "artist_id": "comparable-artist-1",
      "artist_name": "Similar Artist",
      "similarity_score": 0.92,
      "monthly_listeners": 3200000,
      "total_events": 68
    }
  ]
}
```

### 4.4 get-artist-details

**Purpose**: Basic artist information (fallback function).

**Request Parameters**:
```json
{
  "artistId": "artist-uuid-here"
}
```

**Response**: Simplified artist data for fallback scenarios.

---

## 5. promoter-analytics

**Purpose**: Comprehensive promoter analytics and portfolio insights.

**Request Parameters**:
```json
{
  "promoterId": "promoter-uuid-here",
  "timeRange": "year",
  "includeComparisons": true
}
```

**Response Example**:
```json
{
  "promoter": {
    "id": "promoter-uuid-here",
    "name": "Major Promoter Ltd",
    "city": "Istanbul",
    "established": "2010-01-01",
    "event_stats": {
      "total_events": 150,
      "upcoming_events": 25,
      "avg_attendance": 5500,
      "total_capacity": 825000
    },
    "financial_metrics": {
      "total_revenue": 12500000.00,
      "avg_ticket_price": 95.50,
      "revenue_per_event": 83333.33
    },
    "venue_partnerships": [
      {
        "venue_name": "Istanbul Arena",
        "event_count": 45,
        "avg_attendance": 8500
      }
    ],
    "top_artists": [
      {
        "artist_name": "Popular Artist",
        "collaboration_count": 12,
        "total_attendance": 102000
      }
    ]
  },
  "analytics": {
    "performance_score": 0.88,
    "market_share": 0.15,
    "growth_metrics": {
      "revenue_growth": 0.25,
      "event_growth": 0.18,
      "attendance_growth": 0.12
    }
  },
  "insights": [
    {
      "type": "strength",
      "message": "Strong partnership with premium venues"
    }
  ]
}
```

---

## 6. venue-analytics

**Purpose**: Comprehensive venue analytics with utilization metrics.

**Request Parameters**:
```json
{
  "venueId": "venue-uuid-here",
  "timeRange": "year",
  "compareWith": ["venue-uuid-2", "venue-uuid-3"]
}
```

**Response Example**:
```json
{
  "venue": {
    "id": "venue-uuid-here",
    "name": "Istanbul Arena",
    "city": "Istanbul",
    "capacity": 15000,
    "event_stats": {
      "total_events": 85,
      "upcoming_events": 20,
      "recent_events": 65
    },
    "utilization_metrics": {
      "avg_events_per_month": 7.1,
      "capacity_utilization": 0.78,
      "peak_months": ["June", "September", "December"]
    },
    "pricing_analytics": {
      "avg_ticket_price": 125.50,
      "price_range": {
        "min": 50.00,
        "max": 300.00
      }
    },
    "top_artists": [
      {
        "artist_name": "Frequent Performer",
        "performance_count": 8,
        "avg_attendance": 12500
      }
    ]
  },
  "analytics": {
    "timeRange": "year",
    "uniqueArtists": 45,
    "artistReturnRate": 0.35,
    "peakDays": ["Friday", "Saturday"]
  },
  "timeSeries": [
    {
      "date": "2024-01-01",
      "events_count": 3,
      "total_attendance": 25000,
      "revenue": 150000.00
    }
  ]
}
```

---

## General Integration Notes

### Error Handling
All edge functions implement standardized error responses:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Authentication
All functions require valid Supabase authentication via:
- `Authorization: Bearer <jwt_token>` header
- Valid API key in `apikey` header

### Rate Limiting
- Functions are rate-limited per user/IP
- Implement exponential backoff in client code
- Use React Query caching to reduce API calls

### CORS Configuration
All functions include proper CORS headers for frontend access:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

### Frontend Integration Pattern
```typescript
// Standard pattern for all edge functions
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { ...parameters }
});

if (error) {
  console.error('Function error:', error);
  // Handle error appropriately
}

return data;
```

### Caching Strategy
All functions use React Query with:
- 5-minute staleTime
- Automatic retry on failure
- Background refetching
- Optimistic updates where appropriate