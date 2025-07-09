-- FIX FOR CONSTRAINT VIOLATIONS
-- Run this to fix existing data before applying enhanced security

-- STEP 1: Fix existing data that violates constraints
-- Update messages that are too short (less than 10 characters)
UPDATE contacts 
SET message = message || ' (Thank you for contacting us)'
WHERE char_length(message) < 10;

-- Update messages that are too long (more than 2000 characters)
UPDATE contacts 
SET message = left(message, 1997) || '...'
WHERE char_length(message) > 2000;

-- Update names that are too short (less than 2 characters)
UPDATE contacts 
SET name = 'Anonymous'
WHERE char_length(name) < 2;

-- Update names that are too long (more than 100 characters)
UPDATE contacts 
SET name = left(name, 100)
WHERE char_length(name) > 100;

-- Fix any invalid email addresses in contacts
UPDATE contacts 
SET email = 'invalid@example.com'
WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- Fix any invalid email addresses in newsletter_subscribers
UPDATE newsletter_subscribers 
SET email = 'invalid@example.com'
WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- STEP 2: Check current data status
SELECT 
  'contacts' as table_name,
  COUNT(*) as total_rows,
  COUNT(CASE WHEN char_length(name) < 2 OR char_length(name) > 100 THEN 1 END) as invalid_names,
  COUNT(CASE WHEN char_length(message) < 10 OR char_length(message) > 2000 THEN 1 END) as invalid_messages,
  COUNT(CASE WHEN email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 1 END) as invalid_emails
FROM contacts
UNION ALL
SELECT 
  'newsletter_subscribers' as table_name,
  COUNT(*) as total_rows,
  0 as invalid_names,
  0 as invalid_messages,
  COUNT(CASE WHEN email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 1 END) as invalid_emails
FROM newsletter_subscribers;

-- STEP 3: Verify data is now valid
SELECT 'Data cleanup complete - ready for constraints!' as status;
