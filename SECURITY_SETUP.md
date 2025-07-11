# Security Setup Instructions

## Row Level Security (RLS) Configuration

To secure your database and ensure only authenticated users can access data, you need to enable Row Level Security on all tables in your Supabase dashboard.

### 1. Enable RLS on All Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS on all main tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_list_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_customers ENABLE ROW LEVEL SECURITY;

-- Add any other tables you have
-- ALTER TABLE public.your_other_table ENABLE ROW LEVEL SECURITY;
```

### 2. Create RLS Policies

Create policies to allow authenticated users to access data:

```sql
-- Policy for events table
CREATE POLICY "Allow authenticated users to view events" ON public.events
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for artists table
CREATE POLICY "Allow authenticated users to view artists" ON public.artists
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for venues table
CREATE POLICY "Allow authenticated users to view venues" ON public.venues
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for promoters table
CREATE POLICY "Allow authenticated users to view promoters" ON public.promoters
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for artist_list_summary table
CREATE POLICY "Allow authenticated users to view artist_list_summary" ON public.artist_list_summary
    FOR ALL USING (auth.role() = 'authenticated');

-- Policy for approved_customers table (read-only for checking email approval)
CREATE POLICY "Allow authenticated users to read approved_customers" ON public.approved_customers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow public access to approved_customers for registration email checking
CREATE POLICY "Allow public to check email approval" ON public.approved_customers
    FOR SELECT USING (true);
```

### 3. Edge Function Security

Your edge functions should already be secure because they use JWT tokens. Make sure they include the Authorization header:

```javascript
// Example in edge function
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 4. Test Security

1. Try accessing your application without logging in - should redirect to login
2. Try accessing API endpoints directly - should return 401 Unauthorized
3. Log in with an approved email - should work normally
4. Try registering with a non-approved email - should show error message

### 5. Add Customer Emails

To add approved customer emails, run:

```sql
INSERT INTO public.approved_customers (email, company_name, is_active) VALUES
('customer1@company.com', 'Company Name 1', true),
('customer2@company.com', 'Company Name 2', true);
-- Add more customers as needed
```

### 6. Security Best Practices

- Never expose your service_role key in frontend code
- Use the anon key for public operations only
- Always validate user permissions in edge functions
- Regularly audit your RLS policies
- Monitor authentication logs in Supabase dashboard

### 7. Emergency Access

If you get locked out, you can temporarily disable RLS:

```sql
-- EMERGENCY ONLY - Disable RLS temporarily
ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable after fixing the issue
```

## Environment Variables

Make sure your environment variables are secure:

- `SUPABASE_URL`: Public, safe to expose
- `SUPABASE_ANON_KEY`: Public, safe to expose (limited permissions)
- `SUPABASE_SERVICE_ROLE_KEY`: **NEVER expose this in frontend**

Your application is now secure and ready for production deployment!