-- Programs Management Schema

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT NOT NULL,
    image_url TEXT,
    icon TEXT NOT NULL, -- Store icon name (e.g., 'Heart', 'Users', 'BookOpen')
    cta_text TEXT NOT NULL DEFAULT 'Get Involved',
    impact_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Public can view active programs" ON programs;
DROP POLICY IF EXISTS "Admins can manage programs" ON programs;

-- Create RLS policies for programs table
CREATE POLICY "Public can view active programs"
ON programs FOR SELECT
TO authenticated, anon
USING (is_active = true);

CREATE POLICY "Admins can manage programs"
ON programs FOR ALL
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM admin_users)
);

-- Grant permissions
GRANT SELECT ON programs TO anon, authenticated;
GRANT ALL PRIVILEGES ON programs TO service_role;

-- Insert sample programs
INSERT INTO programs (title, description, details, icon, cta_text, impact_text, display_order, image_url)
VALUES
    (
        'Caregiver Training Workshops',
        'Comprehensive training programs equipping family caregivers with essential skills for dementia care and emotional support techniques.',
        'Our comprehensive training workshops provide hands-on learning experiences, covering topics from basic care techniques to advanced dementia support strategies. Participants gain practical skills in communication, medication management, behavioral interventions, and self-care for caregivers.',
        'Heart',
        'Join Training',
        '1,200+ caregivers trained',
        1,
        'images/Caregivers/training.jpg'
    ),
    (
        'Memory Care Support Groups',
        'Safe spaces for caregivers and families to share experiences, learn from each other, and build lasting support networks.',
        'Our support groups offer a caring environment where families can connect with others facing similar challenges. Led by experienced facilitators, these sessions provide emotional support, practical advice, and lasting friendships that make the caregiving journey less isolating.',
        'Users',
        'Find Group',
        '80+ active support groups',
        2,
        'images/Caregivers/sessions.jpg'
    ),
    (
        'Educational Resources',
        'Evidence-based materials, guides, and toolkits designed to enhance understanding of dementia care and management strategies.',
        'Our educational resources provide evidence-based information on dementia care and management strategies.',
        'BookOpen',
        'Access Resources',
        '50,000+ resources accessed',
        3,
        'images/Brain Kit/brain_bridge_boxcontent-1024x1024.jpeg'
    ),
    (
        'Home Care Consultation',
        'Personalized assessments and recommendations to create safe, comfortable living environments for those with dementia.',
        'Our home care consultations provide personalized assessments to optimize living environments for individuals with dementia. Our experts evaluate safety, accessibility, and comfort factors to create recommendations that enhance quality of life for both patients and caregivers.',
        'Home',
        'Book Consultation',
        '500+ homes assessed',
        4,
        'images/Users/care.jpg'
    )
ON CONFLICT DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
