-- Insert sample events with proper UUIDs
-- Run this in your Supabase SQL Editor

INSERT INTO events (id, title, description, date, time, location, max_participants, is_active) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Caregiver Training Workshop',
  'Comprehensive training session for aspiring caregivers focusing on elderly care techniques and dementia support.',
  '2025-07-15',
  '10:00 AM - 4:00 PM',
  'Mumbai Center',
  30,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Family Support Group Meeting',
  'Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.',
  '2025-07-20',
  '2:00 PM - 4:00 PM',
  'Pune Center',
  50,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Brain Health Awareness Session',
  'Educational workshop about brain health, early signs of dementia, and preventive measures for cognitive wellness.',
  '2025-07-25',
  '11:00 AM - 1:00 PM',
  'Delhi Center',
  40,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Advanced Dementia Care Techniques',
  'Advanced training for experienced caregivers on specialized dementia care techniques and behavioral management.',
  '2025-08-05',
  '9:00 AM - 5:00 PM',
  'Bangalore Center',
  25,
  true
);

-- Verify the events were created
SELECT * FROM events ORDER BY date;
