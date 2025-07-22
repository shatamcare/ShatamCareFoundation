# 🔧 URGENT FIX GUIDE - Storage Bucket Setup

## The problem: 
- Supabase Storage bucket 'media' doesn't exist
- Database tables are missing
- Storage policies not configured

## IMMEDIATE ACTIONS NEEDED:

### 1. CREATE STORAGE BUCKET (CRITICAL)
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `uumavtvxuncetfqwlgvp`
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Set bucket name: `media`
6. Set to **Public** (so files can be accessed publicly)
7. Click **"Create bucket"**

### 2. APPLY DATABASE SCHEMA (CRITICAL)
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy ALL content from `database/setup_complete.sql`
3. Paste and **Run** the SQL
4. Verify tables are created: `site_settings`, `content_items`, `media_files`, `admin_activity_log`

### 3. SET STORAGE POLICIES (After bucket creation)
Run this SQL in Supabase SQL Editor:

```sql
-- Storage policies for media bucket
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

CREATE POLICY "Users can delete own media"  
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

### 4. VERIFY SETUP
After completing steps 1-3:
- Try uploading a file in the admin panel
- Check if files appear in Storage > media bucket
- Verify database entries in media_files table

## Current Status:
❌ Storage bucket 'media' - MISSING (CRITICAL)
❌ Database tables - MISSING (CRITICAL)  
✅ Admin panel code - COMPLETE
✅ Upload functions - COMPLETE

**Next step: Create the storage bucket immediately!**
