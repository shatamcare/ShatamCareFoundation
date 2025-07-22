# 🚨 IMMEDIATE FIX: Storage Bucket Not Found

## Error Summary
- **Status**: 400 Bad Request
- **Error**: "Bucket not found" 
- **Cause**: Storage bucket 'media' doesn't exist in Supabase
- **Fix Time**: ~2 minutes

## 🔧 Fix Steps (Do These Now):

### 1. Create Storage Bucket (REQUIRED)
```
1. Open https://supabase.com/dashboard
2. Select your project: "Shatam Care Foundation"
3. Go to Storage → Buckets (left sidebar)
4. Click "New bucket" button
5. Enter bucket name: media
6. Set bucket as "Public" (important!)
7. Click "Create bucket"
```

### 2. Apply Database Schema (REQUIRED)
```
1. In Supabase Dashboard → SQL Editor
2. Copy all content from: database/setup_complete.sql
3. Paste and click "Run"
4. Verify tables are created successfully
```

### 3. Apply Storage Policies (After bucket creation)
```sql
-- Run this in Supabase SQL Editor AFTER creating the bucket

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update files they uploaded
CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Allow authenticated users to delete files they uploaded
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Allow public read access to media files
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

## ✅ Verification Steps:

1. **Check Bucket**: Storage → Buckets → Should see "media" bucket
2. **Check Tables**: Database → Tables → Should see site_settings, content_items, media_files, admin_activity_log
3. **Test Upload**: Go to http://localhost:5174/admin → Media → Try uploading a file
4. **Check Status**: Admin Dashboard should show all green checkmarks

## 🎯 Expected Result:
- Upload errors will disappear
- Media files will upload successfully
- Admin panel will show "All systems operational"

## 📞 Need Help?
If errors persist after these steps:
1. Check browser console for new error messages
2. Verify Supabase project URL and API key in .env
3. Ensure you're logged in to the correct Supabase account
