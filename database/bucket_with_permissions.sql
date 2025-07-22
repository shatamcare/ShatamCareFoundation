-- Alternative approach: Create bucket through Supabase's built-in storage functions
-- This should automatically create the necessary policies

-- Method 1: Try to create bucket using storage.create_bucket function (if available)
SELECT storage.create_bucket('media'::text, true);

-- If that doesn't work, try inserting with proper owner
INSERT INTO storage.buckets (id, name, public, owner, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  (SELECT auth.uid()),  -- Use your user ID as owner
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  owner = EXCLUDED.owner,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Check what policies already exist
SELECT policyname, cmd, tablename 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
