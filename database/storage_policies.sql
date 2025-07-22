-- =====================================================
-- STORAGE BUCKET SETUP (Run AFTER creating bucket manually)
-- =====================================================

-- Note: You MUST create the storage bucket manually first:
-- 1. Go to Supabase Dashboard → Storage → Buckets
-- 2. Click "New bucket"
-- 3. Name: "media"
-- 4. Set as "Public bucket" (check the checkbox)
-- 5. Click "Create bucket"
-- 
-- Then run this SQL script to set up the storage policies:

-- =====================================================
-- STORAGE POLICIES FOR MEDIA BUCKET
-- =====================================================

-- Enable RLS for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage all media" ON storage.objects;

-- Policy 1: Allow authenticated users to upload files to media bucket
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Policy 2: Allow users to update files they uploaded
CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Policy 3: Allow users to delete files they uploaded
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = owner);

-- Policy 4: Allow public read access to media files
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Policy 5: Allow admins to manage all media files
CREATE POLICY "Admin can manage all media"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'media' AND 
  auth.uid() IN (
    SELECT id FROM admin_users WHERE is_active = true
  )
);

-- =====================================================
-- BUCKET POLICIES (for bucket management)
-- =====================================================

-- Drop existing bucket policies if they exist
DROP POLICY IF EXISTS "Public can view media bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can use media bucket" ON storage.buckets;

-- Allow public to view bucket info
CREATE POLICY "Public can view media bucket"
ON storage.buckets FOR SELECT
TO public
USING (id = 'media');

-- Allow authenticated users to use bucket
CREATE POLICY "Authenticated users can use media bucket"
ON storage.buckets FOR SELECT
TO authenticated
USING (id = 'media');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if bucket exists
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'media';

-- Check policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Test bucket access (this should not error if everything is set up correctly)
SELECT bucket_id, name, created_at 
FROM storage.objects 
WHERE bucket_id = 'media' 
LIMIT 1;

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If you get errors, check:
-- 1. Bucket 'media' exists in Storage → Buckets
-- 2. Bucket is set as "Public"
-- 3. admin_users table exists (run database/setup_complete.sql first)
-- 4. No conflicting policies exist

COMMENT ON SCHEMA storage IS 'Storage policies configured for media bucket';
