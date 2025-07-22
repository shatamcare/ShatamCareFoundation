-- Quick check to verify if media bucket exists
-- Run this in Supabase SQL Editor after creating the bucket

-- 1. Check if bucket exists
SELECT 
  name,
  public,
  created_at
FROM storage.buckets 
WHERE name = 'media';

-- 2. If no results, create the bucket via SQL (alternative method)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Verify bucket is now available
SELECT 
  name,
  public,
  created_at
FROM storage.buckets 
WHERE name = 'media';

-- 4. Check if any files exist (should be empty initially)
SELECT COUNT(*) as file_count
FROM storage.objects 
WHERE bucket_id = 'media';
