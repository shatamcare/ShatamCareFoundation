# 🚨 URGENT: Fix Event Registration

## The Problem
Event registration is failing because:
1. **Database expects UUID format** for event_id
2. **Events don't exist in database** yet

## 🔧 IMMEDIATE FIX (2 steps):

### Step 1: Create Events in Database
1. Go to your Supabase dashboard
2. Click **"SQL Editor"**
3. Copy and paste this SQL:

```sql
-- Insert sample events with proper UUIDs
INSERT INTO events (id, title, description, date, time, location, max_participants, is_active) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Caregiver Training Workshop',
  'Comprehensive training session for aspiring caregivers focusing on elderly care techniques and dementia support.',
  '2025-07-15',
  '10:00 AM - 4:00 PM',
  'Mumbai Community Center',
  30,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Family Support Group Meeting',
  'Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.',
  '2025-07-20',
  '2:00 PM - 4:00 PM',
  'Pune Center',
  50,
  true
);

-- Verify the events were created
SELECT * FROM events ORDER BY date;
```

4. Click **"Run"**
5. You should see 2 events created

### Step 2: Test Event Registration
1. Go back to your website: `http://localhost:5173`
2. Scroll to the Events section
3. Click **"Reserve Your Seat"** on any event
4. Fill out the registration form
5. Click **"Register for Event"**
6. Should show **green success message** ✅

## ✅ What I Already Fixed:
- Updated event IDs in your code to use proper UUIDs
- Fixed the data structure to match database requirements
- Enhanced error logging for better debugging

## 🎯 Expected Result:
After running the SQL, event registration should work perfectly!

## 🔍 If It Still Doesn't Work:
1. Check browser console for new error messages
2. Use the Supabase Diagnostic Tool at the top of your page
3. Make sure the `events` table exists and has the RLS policies

## 📋 Quick Verification:
- ✅ Events exist in database (after running SQL)
- ✅ Event IDs are UUIDs (fixed in code)
- ✅ RLS policies allow inserts (should be set up)
- ✅ Frontend uses correct event IDs (updated)

**Run that SQL and event registration will work immediately!**
