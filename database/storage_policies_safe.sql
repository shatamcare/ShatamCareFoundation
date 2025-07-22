-- =====================================================
-- SIMPLIFIED STORAGE POLICIES (No RLS modification)
-- =====================================================

-- Note: You MUST create the storage bucket manually first:
-- 1. Go to Supabase Dashboard → Storage → Buckets
-- 2. Click "New bucket"
-- 3. Name: "media"
-- 4. Set as "Public bucket" (check the checkbox)
-- 5. Click "Create bucket"

-- =====================================================
-- STORAGE POLICIES FOR MEDIA BUCKET (SAFE VERSION)
-- =====================================================

-- Drop existing policies if they exist (safe operation)
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
-- VERIFICATION QUERIES
-- =====================================================

-- Check if bucket exists
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'media';

-- Check if policies were created successfully
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%media%';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Storage policies for media bucket have been configured successfully!';
  RAISE NOTICE 'You can now upload files to the media bucket.';
END $$;
