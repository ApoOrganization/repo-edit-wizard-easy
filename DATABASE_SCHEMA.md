# Database Schema Documentation

This document provides comprehensive documentation for key database structures, views, and tables used by the application's Edge Functions and RPC calls.

## Table of Contents

1. [Core Tables](#1-core-tables)
2. [Summary Views](#2-summary-views)
3. [Analytics Views](#3-analytics-views)
4. [RPC Function Schemas](#4-rpc-function-schemas)
5. [Data Relationships](#5-data-relationships)
6. [Indexing Strategy](#6-indexing-strategy)

---

## 1. Core Tables

Based on the API responses and edge function integrations, these are the core tables in the system:

### 1.1 Events Table

**Purpose**: Central table storing all event information.

**Key Columns**:
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  time TIME,
  venue_id UUID REFERENCES venues(id),
  artist_id UUID REFERENCES artists(id),
  promoter_id UUID REFERENCES promoters(id),
  status TEXT CHECK (status IN ('upcoming', 'on_sale', 'sold_out', 'cancelled', 'completed')),
  capacity INTEGER,
  tickets_sold INTEGER DEFAULT 0,
  ticket_price_min DECIMAL(10,2),
  ticket_price_max DECIMAL(10,2),
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Artists Table

**Purpose**: Stores artist information and metadata.

**Key Columns**:
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  spotify_link TEXT,
  monthly_listeners INTEGER,
  followers INTEGER,
  agency TEXT,
  territory TEXT,
  booking_emails TEXT,
  social_presence JSONB,
  social_links JSONB,
  genres TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Social Presence Structure**:
```json
{
  "instagram": "@artist_handle",
  "twitter": "@artist_handle",
  "facebook": "artist.page",
  "website": "https://artist.com",
  "youtube": "artist_channel"
}
```

**Social Links Structure**:
```json
{
  "twitter": "https://twitter.com/artist",
  "youtube": "https://youtube.com/artist",
  "facebook": "https://facebook.com/artist",
  "instagram": "https://instagram.com/artist",
  "wikipedia": "https://wikipedia.org/wiki/artist",
  "soundcloud": "https://soundcloud.com/artist",
  "apple_music": "https://music.apple.com/artist"
}
```

### 1.3 Venues Table

**Purpose**: Stores venue information and capacity details.

**Key Columns**:
```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  address TEXT,
  coordinates POINT,
  venue_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 Promoters Table

**Purpose**: Stores promoter/organizer information.

**Key Columns**:
```sql
CREATE TABLE promoters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  established DATE,
  contact_email TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.5 Tickets Table

**Purpose**: Stores individual ticket sales data.

**Key Columns**:
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  provider TEXT NOT NULL, -- 'Biletix', 'Bubilet', 'Passo'
  category TEXT,
  price DECIMAL(10,2) NOT NULL,
  sold_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Summary Views

These views provide optimized data access for list pages and quick lookups.

### 2.1 artist_list_summary

**Purpose**: Optimized view for artist listing and search functionality.

**Columns**:
```sql
CREATE VIEW artist_list_summary AS
SELECT 
  a.id,
  a.name,
  a.normalized_name,
  a.spotify_link,
  a.monthly_listeners,
  a.followers,
  a.agency,
  a.territory,
  a.booking_emails,
  a.social_presence,
  a.genres,
  COUNT(e.id) as total_events,
  COUNT(CASE WHEN e.date >= NOW() THEN 1 END) as upcoming_events,
  COUNT(CASE WHEN e.date < NOW() THEN 1 END) as past_events,
  AVG(CASE WHEN t.price IS NOT NULL THEN t.price END) as avg_ticket_price
FROM artists a
LEFT JOIN events e ON a.id = e.artist_id
LEFT JOIN tickets t ON e.id = t.event_id AND t.status = 'sold'
GROUP BY a.id, a.name, a.normalized_name, a.spotify_link, 
         a.monthly_listeners, a.followers, a.agency, 
         a.territory, a.booking_emails, a.social_presence, a.genres;
```

### 2.2 venue_list_summary

**Purpose**: Optimized view for venue listing and analytics fallback.

**Columns**:
```sql
CREATE VIEW venue_list_summary AS
SELECT 
  v.id,
  v.name,
  v.city,
  v.capacity,
  COUNT(e.id) as total_events,
  COUNT(CASE WHEN e.date >= NOW() THEN 1 END) as upcoming_events,
  COUNT(CASE WHEN e.date < NOW() THEN 1 END) as recent_events,
  AVG(CASE WHEN t.price IS NOT NULL THEN t.price END) as avg_ticket_price,
  AVG(e.tickets_sold::FLOAT / NULLIF(e.capacity, 0)) as avg_capacity_utilization
FROM venues v
LEFT JOIN events e ON v.id = e.venue_id
LEFT JOIN tickets t ON e.id = t.event_id AND t.status = 'sold'
GROUP BY v.id, v.name, v.city, v.capacity;
```

---

## 3. Analytics Views

These views support the analytics functions and provide aggregated metrics.

### 3.1 market_analytics_summary

**Purpose**: Supports get-market-analytics edge function.

**Columns**:
```sql
CREATE VIEW market_analytics_summary AS
SELECT 
  -- Revenue totals
  SUM(CASE WHEN t.status = 'sold' THEN t.price ELSE 0 END) as revenue_realized,
  SUM(CASE WHEN t.status = 'available' THEN t.price ELSE 0 END) as remaining_revenue,
  SUM(t.price) as total_potential_revenue,
  
  -- Provider distribution
  json_object_agg(t.provider, provider_counts.count) as provider_distribution,
  
  -- Time series data (daily aggregates)
  array_agg(
    json_build_object(
      'date', daily_stats.date,
      'tickets_sold', daily_stats.tickets_sold,
      'daily_revenue', daily_stats.daily_revenue
    ) ORDER BY daily_stats.date
  ) as timeseries_data
FROM tickets t
LEFT JOIN (
  SELECT provider, COUNT(*) as count 
  FROM tickets 
  WHERE status = 'sold' 
  GROUP BY provider
) provider_counts ON t.provider = provider_counts.provider
LEFT JOIN (
  SELECT 
    DATE(sold_date) as date,
    COUNT(*) as tickets_sold,
    SUM(price) as daily_revenue
  FROM tickets 
  WHERE status = 'sold' AND sold_date IS NOT NULL
  GROUP BY DATE(sold_date)
) daily_stats ON DATE(t.sold_date) = daily_stats.date
WHERE t.sold_date >= NOW() - INTERVAL '1 year';
```

### 3.2 ticket_analytics_base

**Purpose**: Base view for promoter/venue ticket analytics.

**Columns**:
```sql
CREATE VIEW ticket_analytics_base AS
SELECT 
  e.id as event_id,
  e.name as event_name,
  e.promoter_id,
  e.venue_id,
  e.artist_id,
  e.date as event_date,
  DATE(t.sold_date) as sale_date,
  COUNT(CASE WHEN t.status = 'sold' THEN 1 END) as tickets_sold,
  SUM(CASE WHEN t.status = 'sold' THEN t.price ELSE 0 END) as daily_revenue,
  SUM(CASE WHEN t.status = 'available' THEN t.price ELSE 0 END) as remaining_revenue,
  SUM(t.price) as total_potential_revenue
FROM events e
LEFT JOIN tickets t ON e.id = t.event_id
GROUP BY e.id, e.name, e.promoter_id, e.venue_id, e.artist_id, 
         e.date, DATE(t.sold_date);
```

---

## 4. RPC Function Schemas

### 4.1 Calendar Function Return Type

**Used by**: `get_promoter_calendar`, `get_venue_calendar`, `get_artist_calendar`

```sql
CREATE TYPE calendar_event_type AS (
  id UUID,
  name TEXT,
  date DATE,
  time TIME,
  venue_name TEXT,
  venue_city TEXT,
  artist_name TEXT,
  promoter_name TEXT,
  ticket_price_range TEXT,
  status TEXT,
  capacity INTEGER,
  tickets_sold INTEGER,
  sales_percentage DECIMAL(5,2),
  genre TEXT
);
```

### 4.2 Event List Return Type

**Used by**: `get_artist_events`, `get_venue_events`

```sql
CREATE TYPE event_list_type AS (
  id UUID,
  name TEXT,
  date DATE,
  time TIME,
  venue_name TEXT,
  venue_city TEXT,
  artist_name TEXT,
  promoter_name TEXT,
  status TEXT,
  capacity INTEGER,
  tickets_sold INTEGER,
  genre TEXT
);
```

---

## 5. Data Relationships

### 5.1 Core Entity Relationships

```
Events (Central Hub)
├── artist_id → Artists (Many-to-One)
├── venue_id → Venues (Many-to-One)
├── promoter_id → Promoters (Many-to-One)
└── Tickets (One-to-Many)

Artists
├── Events (One-to-Many)
└── Social Links (JSONB)

Venues
├── Events (One-to-Many)
└── Location Data

Promoters
├── Events (One-to-Many)
└── Contact Information

Tickets
├── event_id → Events (Many-to-One)
└── Provider Information
```

### 5.2 Analytics Aggregation Paths

```
Market Analytics:
Tickets → Events → (Artists, Venues, Promoters)

Promoter Analytics:
Promoters → Events → (Artists, Venues, Tickets)

Venue Analytics:
Venues → Events → (Artists, Promoters, Tickets)

Artist Analytics:
Artists → Events → (Venues, Promoters, Tickets)
```

---

## 6. Indexing Strategy

### 6.1 Primary Indexes

```sql
-- Events table
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_artist_id ON events(artist_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_promoter_id ON events(promoter_id);
CREATE INDEX idx_events_status ON events(status);

-- Tickets table
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_sold_date ON tickets(sold_date);
CREATE INDEX idx_tickets_provider ON tickets(provider);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Artists table
CREATE INDEX idx_artists_normalized_name ON artists(normalized_name);
CREATE INDEX idx_artists_monthly_listeners ON artists(monthly_listeners);
CREATE INDEX idx_artists_agency ON artists(agency);
CREATE INDEX idx_artists_territory ON artists(territory);
CREATE INDEX idx_artists_genres ON artists USING GIN(genres);

-- Venues table
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_capacity ON venues(capacity);

-- Promoters table
CREATE INDEX idx_promoters_city ON promoters(city);
```

### 6.2 Composite Indexes

```sql
-- For calendar queries
CREATE INDEX idx_events_calendar_promoter ON events(promoter_id, date);
CREATE INDEX idx_events_calendar_venue ON events(venue_id, date);
CREATE INDEX idx_events_calendar_artist ON events(artist_id, date);

-- For analytics queries
CREATE INDEX idx_tickets_analytics ON tickets(event_id, status, sold_date);
CREATE INDEX idx_events_analytics ON events(date, status, promoter_id, venue_id, artist_id);

-- For time-based queries
CREATE INDEX idx_events_upcoming ON events(date) WHERE date >= NOW();
CREATE INDEX idx_events_past ON events(date) WHERE date < NOW();
```

### 6.3 JSONB Indexes

```sql
-- For social presence searches
CREATE INDEX idx_artists_social_presence ON artists USING GIN(social_presence);
CREATE INDEX idx_artists_social_links ON artists USING GIN(social_links);

-- For specific social platform queries
CREATE INDEX idx_artists_instagram ON artists((social_presence->>'instagram'));
CREATE INDEX idx_artists_spotify ON artists(spotify_link) WHERE spotify_link IS NOT NULL;
```

---

## Data Constraints and Business Rules

### 6.1 Data Validation

```sql
-- Events constraints
ALTER TABLE events ADD CONSTRAINT chk_events_date_future 
  CHECK (date >= '2020-01-01');
ALTER TABLE events ADD CONSTRAINT chk_events_capacity_positive 
  CHECK (capacity > 0);
ALTER TABLE events ADD CONSTRAINT chk_events_tickets_sold_valid 
  CHECK (tickets_sold >= 0 AND tickets_sold <= capacity);

-- Tickets constraints
ALTER TABLE tickets ADD CONSTRAINT chk_tickets_price_positive 
  CHECK (price >= 0);

-- Artists constraints
ALTER TABLE artists ADD CONSTRAINT chk_artists_listeners_positive 
  CHECK (monthly_listeners >= 0);
ALTER TABLE artists ADD CONSTRAINT chk_artists_followers_positive 
  CHECK (followers >= 0);
```

### 6.2 Triggers

```sql
-- Update tickets_sold when tickets change
CREATE OR REPLACE FUNCTION update_event_tickets_sold()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events 
  SET tickets_sold = (
    SELECT COUNT(*) 
    FROM tickets 
    WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) 
    AND status = 'sold'
  )
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tickets_sold
  AFTER INSERT OR UPDATE OR DELETE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_event_tickets_sold();
```

This schema supports all the documented Edge Functions and RPC calls, providing efficient data access patterns and maintaining data integrity across the application.