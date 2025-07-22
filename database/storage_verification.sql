-- =====================================================
-- STORAGE VERIFICATION SCRIPT
-- =====================================================
-- Run this to see what's actually in your Supabase storage

-- Check all buckets in your project
SELECT 
    'All Buckets' as check_type,
    id as bucket_name,
    name as display_name,
    public as is_public,
    created_at,
    updated_at
FROM storage.buckets
ORDER BY created_at;

-- Check if media bucket specifically exists
SELECT 
    'Media Bucket Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media' AND public = true) 
        THEN 'PUBLIC' 
        ELSE 'PRIVATE OR MISSING' 
    END as access_level;

-- Check storage policies
SELECT 
    'Storage Policies' as check_type,
    schemaname,
    tablename,
    policyname,
    roles,
    cmd as operation,
    CASE 
        WHEN policyname LIKE '%media%' THEN 'MEDIA RELATED'
        ELSE 'OTHER'
    END as relevance
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- Check if there are any objects in media bucket (if it exists)
SELECT 
    'Media Files Count' as check_type,
    COUNT(*) as file_count,
    COALESCE(string_agg(DISTINCT split_part(name, '/', 1), ', '), 'No files') as folders
FROM storage.objects 
WHERE bucket_id = 'media';

-- Environment check - see what storage configuration exists
SELECT 
    'Storage Configuration' as check_type,
    COUNT(DISTINCT bucket_id) as total_buckets_with_files,
    COUNT(*) as total_files
FROM storage.objects;

-- Final recommendation
SELECT 
    'Recommendation' as check_type,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') 
        THEN '❌ CREATE MEDIA BUCKET: Go to Dashboard → Storage → New bucket → name: media → Public'
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media' AND public = false)
        THEN '⚠️ MAKE BUCKET PUBLIC: Edit media bucket → Set as Public'
        WHEN NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%media%')
        THEN '⚠️ ADD STORAGE POLICIES: Run storage_ultra_minimal.sql'
        ELSE '✅ STORAGE LOOKS CONFIGURED - Check your React app connection'
    END as action_needed;
