# Troubleshooting Guide

## Current Issues and Solutions

### 1. Supabase Connection Error
**Error**: `your-project.supabase.co/rest/v1/event_registrations... Failed to load resource: net::ERR_NAME_NOT_RESOLVED`

**Solution**: 
1. Update your `.env` file with your actual Supabase credentials
2. Go to your Supabase project dashboard
3. Navigate to Settings > API
4. Copy the "Project URL" and replace `https://your-project-id.supabase.co` in your `.env` file
5. Copy the "anon" key and replace `your-anon-key` in your `.env` file
6. Restart your development server: `npm run dev`

### 2. Image Loading Errors
**Error**: `images/Team/SC_LOGO-removebg-preview.png:1 Failed to load resource: the server responded with a status of 404 (Not Found)`

**Current Status**: Images exist in the public directory but may have URL encoding issues with spaces.

**Solutions**:
1. **Short term**: The images should load correctly once the page is refreshed
2. **Long term**: Consider renaming images to avoid spaces (e.g., `dementia-care-1.jpg` instead of `dementia care 1.jpg`)

### 3. How to Fix Your Environment

#### Step 1: Update .env file
```env
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

#### Step 2: Restart Development Server
```bash
npm run dev
```

#### Step 3: Test the Contact Form
1. Go to your website
2. Scroll down to the contact form
3. Fill out and submit the form
4. Check your Supabase dashboard > Table Editor > contacts to see if the data was inserted

### 4. Admin Dashboard Access
To access the admin dashboard to view submitted data:
1. Go to `http://localhost:5173/admin` (if you set up the admin route)
2. Or temporarily add the AdminDashboard component to your main page

### 5. Common Issues

#### Environment Variables Not Loading
- Make sure your `.env` file is in the project root (same level as `package.json`)
- Variable names must start with `VITE_` for Vite to include them
- Restart the development server after changing environment variables

#### CORS Issues
- Supabase should handle CORS automatically
- If you have issues, check your Supabase project settings

#### Database Table Issues
- Make sure you ran all the SQL commands from `SUPABASE_SETUP.md`
- Check that Row Level Security policies are set up correctly

### 6. Testing Steps

1. **Test Supabase Connection**:
   ```javascript
   // Open browser console and run:
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

2. **Test Database Connection**:
   - Submit the contact form
   - Check Supabase dashboard for new entries

3. **Test Image Loading**:
   - Check browser network tab for 404 errors
   - Verify images exist in `public/images/` directory

### 7. Next Steps

Once you have:
1. ✅ Updated `.env` with real Supabase credentials
2. ✅ Restarted the development server
3. ✅ Verified the contact form works

You can then:
- Test the newsletter signup
- Test event registration
- Access the admin dashboard to view submitted data
- Deploy to production

### Need Help?
If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project is active and accessible
3. Make sure all SQL tables were created successfully
4. Check that your `.env` file has the correct values and is in the right location
