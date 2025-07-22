-- =====================================================
-- MINIMAL STORAGE SETUP (Most Compatible)
-- =====================================================

-- STEP 1: Create bucket manually in Dashboard first!
-- Go to: Supabase Dashboard → Storage → Buckets
-- Click: "New bucket" 
-- Name: media
-- Check: "Public bucket"
-- Click: "Create bucket"

-- STEP 2: Run this SQL after bucket creation

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Owner manage files" ON storage.objects;

-- Essential Policy 1: Public can view/download files
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Essential Policy 2: Authenticated users can upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Essential Policy 3: Users can manage files (simplified)
-- Allows all authenticated users to manage files in media bucket
CREATE POLICY "Owner manage files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'media');

-- Verify setup
SELECT 
  'Bucket Check' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') 
    THEN '✅ Media bucket exists' 
    ELSE '❌ Media bucket missing - create it in Dashboard first!' 
  END as result;

SELECT 
  'Policy Check' as test_type,
  COUNT(*)::text || ' storage policies created' as result
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname IN ('Public read access', 'Authenticated upload', 'Owner manage files');

-- Success message
SELECT '🎉 Storage setup complete! You can now upload files.' as status;
