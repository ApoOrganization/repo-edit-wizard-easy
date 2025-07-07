# Required Edge Functions Documentation

## search_artists Edge Function

### Purpose
Search and filter artists from the `artist_list_summary` database view with pagination support.

### Location
Create this file in your Supabase project: `supabase/functions/search_artists/index.ts`

### Implementation
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const {
      searchTerm,
      genres,
      agencies,
      territories,
      minListeners,
      page = 1,
      limit = 20,
      sortBy = 'monthly_listeners',
      sortOrder = 'desc'
    } = await req.json()
    
    let query = supabase
      .from('artist_list_summary')
      .select('*', { count: 'exact' })
    
    // Search term filter
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,agency.ilike.%${searchTerm}%,territory.ilike.%${searchTerm}%`)
    }
    
    // Genre filter - check if genres array contains specified genres
    if (genres?.length) {
      const genreConditions = genres
        .map(genre => `genres.cs.{${genre}}`)
        .join(',');
      query = query.or(genreConditions);
    }
    
    // Agency filter
    if (agencies?.length) {
      query = query.in('agency', agencies)
    }
    
    // Territory filter
    if (territories?.length) {
      query = query.in('territory', territories)
    }
    
    // Minimum listeners filter
    if (minListeners) {
      query = query.gte('monthly_listeners', minListeners)
    }
    
    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    
    // Pagination
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({
        artists: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        artists: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    )
  }
})
```

### Deployment Commands
```bash
# Deploy the function
supabase functions deploy search_artists

# Test the function
supabase functions invoke search_artists --data '{"searchTerm":"test","page":1,"limit":10}'
```

### API Usage
The frontend calls this function via:
```typescript
const { data, error } = await supabase.functions.invoke('search_artists', {
  body: {
    searchTerm: "artist name",
    genres: ["Pop", "Rock"],
    agencies: ["Wasserman", "WME"],
    territories: ["North America"],
    minListeners: 1000000,
    page: 1,
    limit: 20,
    sortBy: 'monthly_listeners',
    sortOrder: 'desc'
  }
});
```

### Expected Response Format
```typescript
{
  artists: ArtistListItem[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Database Requirements
Ensure the `artist_list_summary` view exists with these columns:
- id, name, normalized_name, spotify_link
- monthly_listeners, followers
- agency, territory, booking_emails
- social_presence (JSONB)
- total_events, upcoming_events, past_events
- genres (text[])

### Notes
- The frontend has fallback logic to use direct Supabase queries if the edge function fails
- All parameters are optional except for pagination defaults
- Genre filtering uses PostgreSQL's `cs` (contains) operator for array fields
- CORS headers are included for frontend access