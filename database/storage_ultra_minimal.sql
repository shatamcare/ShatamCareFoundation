-- =====================================================
-- ULTRA MINIMAL STORAGE SETUP (Maximum Compatibility)
-- =====================================================

-- STEP 1: Create bucket manually in Dashboard first!
-- Go to: Supabase Dashboard → Storage → Buckets
-- Click: "New bucket" 
-- Name: media
-- Check: "Public bucket"
-- Click: "Create bucket"

-- STEP 2: Run this SQL after bucket creation

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public media access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated media upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated media management" ON storage.objects;

-- Policy 1: Public can view/download files from media bucket
CREATE POLICY "Public media access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Policy 2: Authenticated users can upload to media bucket
CREATE POLICY "Authenticated media upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Policy 3: Authenticated users can manage files in media bucket
-- Simplified version without owner checking to avoid type issues
CREATE POLICY "Authenticated media management"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Policy 4: Authenticated users can delete from media bucket
CREATE POLICY "Authenticated media delete"
ON storage.objects FOR DELETE
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
  AND policyname LIKE '%media%';

-- Test bucket accessibility
SELECT 
  'Access Test' as test_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media' AND public = true)
    THEN '✅ Bucket is public and accessible'
    ELSE '⚠️ Check bucket public setting'
  END as result;

-- Success message
SELECT '🎉 Storage setup complete! You can now upload files.' as status;

-- Additional info
SELECT 
  '📋 Next steps:' as info,
  '1. Go to admin panel, 2. Try uploading a file, 3. Check if it works!' as instructions;
