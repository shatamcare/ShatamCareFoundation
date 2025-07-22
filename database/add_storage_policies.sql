-- Since bucket exists but API gives 400, this might be a RLS policy issue
-- Run this to add proper storage policies

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public access to view files in media bucket
CREATE POLICY "Public Access Media Files" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Policy 2: Allow authenticated users to upload to media bucket  
CREATE POLICY "Authenticated Upload Media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated Update Media" ON storage.objects
FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete Media" ON storage.objects
FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Verify policies were created
SELECT policyname, cmd, tablename 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
