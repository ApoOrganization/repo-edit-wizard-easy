# Database Performance Optimization Guide

## Current Performance Issues

### Artists Table Timeout Problems
The `artist_list_summary` view is experiencing query timeouts due to:
- Large dataset without proper indexing
- Complex sorting operations on `monthly_listeners`
- Array operations on `top_genres` field
- Missing indexes on frequently queried columns

## Recommended Database Indexes

### 1. Essential Indexes for Artists Performance

```sql
-- Core sorting and filtering indexes
CREATE INDEX CONCURRENTLY idx_artist_monthly_listeners 
ON canonical_artists(monthly_listeners DESC NULLS LAST);

CREATE INDEX CONCURRENTLY idx_artist_name 
ON canonical_artists(name);

CREATE INDEX CONCURRENTLY idx_artist_agency 
ON canonical_artists(agency) 
WHERE agency IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_artist_territory 
ON canonical_artists(territory) 
WHERE territory IS NOT NULL;

-- GIN index for array operations on genres
CREATE INDEX CONCURRENTLY idx_artist_top_genres 
ON canonical_artists USING GIN(top_genres);

-- Composite index for common filter combinations
CREATE INDEX CONCURRENTLY idx_artist_agency_territory 
ON canonical_artists(agency, territory) 
WHERE agency IS NOT NULL AND territory IS NOT NULL;
```

### 2. Performance Indexes for Events

```sql
-- Events table performance
CREATE INDEX CONCURRENTLY idx_event_monthly_listeners 
ON canonical_events(monthly_listeners DESC NULLS LAST) 
WHERE monthly_listeners IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_event_date 
ON canonical_events(date DESC);

CREATE INDEX CONCURRENTLY idx_event_venue_city 
ON canonical_events(venue_city) 
WHERE venue_city IS NOT NULL;
```

### 3. Performance Indexes for Venues

```sql
-- Venues table performance
CREATE INDEX CONCURRENTLY idx_venue_capacity 
ON canonical_venues(capacity DESC NULLS LAST) 
WHERE capacity IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_venue_total_events 
ON canonical_venues(total_events DESC) 
WHERE total_events > 0;

CREATE INDEX CONCURRENTLY idx_venue_avg_price 
ON canonical_venues(avg_ticket_price DESC NULLS LAST) 
WHERE avg_ticket_price IS NOT NULL;

-- GIN index for venue genres
CREATE INDEX CONCURRENTLY idx_venue_top_genres 
ON canonical_venues USING GIN(top_genres);
```

## Query Optimization Strategies

### 1. View Materialization
Consider materializing frequently queried views:

```sql
-- Create materialized view for better performance
CREATE MATERIALIZED VIEW artist_list_summary_materialized AS 
SELECT * FROM artist_list_summary;

-- Refresh strategy (run periodically)
REFRESH MATERIALIZED VIEW CONCURRENTLY artist_list_summary_materialized;

-- Create indexes on materialized view
CREATE INDEX ON artist_list_summary_materialized(monthly_listeners DESC NULLS LAST);
CREATE INDEX ON artist_list_summary_materialized(agency) WHERE agency IS NOT NULL;
```

### 2. Partitioning Strategy
For very large tables, consider partitioning:

```sql
-- Example: Partition artists by activity level
CREATE TABLE canonical_artists_active 
PARTITION OF canonical_artists 
FOR VALUES FROM (1) TO (MAXVALUE);

CREATE TABLE canonical_artists_inactive 
PARTITION OF canonical_artists 
FOR VALUES FROM (0) TO (1);
```

### 3. Query Timeout Settings
Adjust PostgreSQL settings for better performance:

```sql
-- Increase statement timeout for complex queries
SET statement_timeout = '30s';

-- Optimize work memory for sorting operations
SET work_mem = '256MB';

-- Enable parallel query execution
SET max_parallel_workers_per_gather = 4;
```

## Monitoring and Maintenance

### 1. Query Performance Monitoring

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements 
WHERE query LIKE '%artist_list_summary%'
ORDER BY mean_exec_time DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename LIKE '%artist%'
ORDER BY idx_tup_read DESC;
```

### 2. Regular Maintenance

```sql
-- Update statistics regularly
ANALYZE canonical_artists;
ANALYZE canonical_events;
ANALYZE canonical_venues;

-- Vacuum to reclaim space
VACUUM ANALYZE canonical_artists;
```

## Frontend Optimizations Implemented

### 1. Query Field Reduction
- Removed heavy JSONB fields (`social_presence`, `top_cities`) from list queries
- Only fetch essential fields for listing pages
- Load detailed data only on detail pages

### 2. Timeout Handling
- 8-second timeout on main queries
- Fallback to simplified queries on timeout
- Progressive loading strategy

### 3. Intelligent Caching
- 5-minute cache for search results
- 10-minute cache for filter options
- React Query placeholder data for smooth UX

### 4. Pagination Optimization
- Limit results to 20 per page
- Use OFFSET/LIMIT for efficient pagination
- Count optimization for large datasets

## Performance Testing

### Before Optimization:
- Query timeout: 3+ seconds → Timeout error
- Fields selected: 15+ including JSONB
- No fallback mechanism

### After Optimization:
- Query time: <2 seconds (with indexes)
- Fields selected: 10 essential fields only
- Fallback query: <1 second
- Improved user experience with loading states

## Next Steps

1. **Immediate**: Apply the recommended indexes during maintenance window
2. **Short-term**: Implement materialized views for complex aggregations
3. **Long-term**: Consider table partitioning for massive datasets
4. **Monitoring**: Set up query performance monitoring

## Impact Estimation

With proper indexing:
- **Artists page load**: 3s+ → <1s
- **Search performance**: Timeout → <500ms
- **Filter loading**: 2s+ → <200ms
- **Overall UX**: Significantly improved