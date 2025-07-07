# Complete Setup Guide - Shatam Care Foundation Website

## Step 1: Clean Supabase Setup

### 1.1 Delete Everything in Supabase
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run this cleanup script:

```sql
-- Complete cleanup - removes everything
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### 1.2 Create Fresh Tables and Policies
After cleanup, run this setup script:

```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users
CREATE POLICY "contacts_insert_policy" ON contacts
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "newsletter_insert_policy" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Test the setup
SELECT 'Setup complete!' as status;
```

## Step 2: Environment Variables

### 2.1 Check .env file
Make sure your `.env` file has correct values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2.2 Get correct values from Supabase
1. Go to Supabase dashboard
2. Click on **Settings** → **API**
3. Copy the **URL** and **anon/public** key

## Step 3: Fix Frontend Code

We'll create minimal, working components that only do INSERT operations.

## Step 4: Test Everything

1. Start dev server: `npm run dev`
2. Test contact form
3. Test newsletter signup
4. Check Supabase dashboard for data

---

**Next Steps:**
1. Run the Supabase cleanup script
2. Run the setup script
3. Update .env file
4. I'll create the fixed frontend components
