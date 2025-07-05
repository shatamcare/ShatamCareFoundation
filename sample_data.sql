-- Sample data for testing the Supabase integration
-- Run this in your Supabase SQL Editor after creating the tables

-- Insert sample events that match the frontend data
INSERT INTO events (id, title, description, date, time, location, max_participants, current_participants, registration_fee, is_active) VALUES
  ('caregiver-training-workshop-july-2025', 'Caregiver Training Workshop', 'Comprehensive training session for aspiring caregivers focusing on elderly care techniques and dementia support.', '2025-07-15', '10:00 AM - 4:00 PM', 'Mumbai Community Center', 25, 10, 0, true),
  ('family-support-group-july-2025', 'Family Support Group Meeting', 'Monthly gathering for families dealing with dementia. Share experiences, get support, and learn coping strategies.', '2025-07-20', '2:00 PM - 4:00 PM', 'Pune Center', 50, 15, 0, true);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, rating, location, program_attended, is_approved, is_featured) VALUES
  ('Priya Sharma', 'Family Caregiver', 'The training program completely transformed how I care for my mother with dementia. The practical skills and emotional support have been invaluable.', 5, 'Mumbai', 'Caregiver Training Workshop', true, true),
  ('Dr. Rajesh Kumar', 'Healthcare Professional', 'Shatam Care Foundation is doing exceptional work in dementia care. Their comprehensive approach makes a real difference in families'' lives.', 5, 'Delhi', 'Professional Development Program', true, true),
  ('Meera Patel', 'Volunteer', 'Being part of this community has been incredibly rewarding. The support group meetings provide comfort and practical advice to families.', 5, 'Pune', 'Family Support Group', true, false);

-- Insert sample impact statistics
INSERT INTO impact_statistics (metric_name, metric_value, year, quarter, description) VALUES
  ('Caregivers Trained', 1500, 2024, 4, 'Total number of caregivers trained since inception'),
  ('Families Helped', 800, 2024, 4, 'Number of families that have received support'),
  ('Support Groups', 25, 2024, 4, 'Active support groups across different cities'),
  ('Cities Reached', 7, 2024, 4, 'Number of cities where programs are active'),
  ('Monthly Participants', 150, 2024, 4, 'Average monthly participants in all programs');

-- Insert sample newsletter subscribers (for testing)
INSERT INTO newsletter_subscribers (email, name, source, is_active) VALUES
  ('test@example.com', 'Test User', 'website', true),
  ('demo@shatamcare.org', 'Demo User', 'website', true);
