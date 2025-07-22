# 🚨 STORAGE 400 ERROR TROUBLESHOOTING

## Error Pattern:
```
uumavtvxuncetfqwlgvp.supabase.co/storage/v1/bucket/media: Failed to load resource: 400 (Bad Request)
```

## 🔍 What This Means:
The error shows your React app is trying to access a storage bucket named "media" but getting a 400 Bad Request. This typically means:

1. **The bucket doesn't exist**
2. **The bucket exists but isn't properly configured**
3. **API permissions issue**
4. **Wrong project or environment variables**

## ✅ STEP-BY-STEP DIAGNOSIS & FIX:

### Step 1: Run Storage Verification (SQL Editor)
```sql
-- File: database/storage_verification.sql
-- This will tell you exactly what's in your storage
```

### Step 2: Use the Diagnostic Tool
1. Go to: http://localhost:5174/admin
2. Click: "Run Diagnostic" button
3. Review: All test results
4. Follow: Specific recommendations

### Step 3: Manual Bucket Creation (Most Common Fix)
```
🌐 Go to: https://supabase.com/dashboard
📁 Navigate: Storage → Buckets
➕ Click: "New bucket"
📝 Name: media
✅ Important: Check "Public bucket" checkbox
🚀 Click: "Create bucket"
```

### Step 4: Verify Environment Variables
Check your `.env` file has:
```
VITE_SUPABASE_URL=https://uumavtvxuncetfqwlgvp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Apply Storage Policies
After bucket creation, run ONE of these:
- **Option A**: `database/storage_ultra_minimal.sql` (Safest)
- **Option B**: `database/storage_minimal.sql` (Standard)

## 🎯 MOST LIKELY SOLUTIONS:

### Solution A: Bucket Missing (90% of cases)
```
Problem: Bucket "media" doesn't exist
Fix: Create bucket manually in Supabase Dashboard
Time: 2 minutes
```

### Solution B: Bucket Not Public (5% of cases)
```
Problem: Bucket exists but is private
Fix: Edit bucket → Set as Public
Time: 1 minute
```

### Solution C: Wrong Project (3% of cases)
```
Problem: Connected to wrong Supabase project
Fix: Check project URL in .env matches dashboard
Time: 5 minutes
```

### Solution D: API Key Issues (2% of cases)
```
Problem: Invalid or expired API keys
Fix: Regenerate API keys in Supabase Dashboard
Time: 5 minutes
```

## 🔧 QUICK FIXES TO TRY:

1. **Immediate Test**: Create bucket manually, refresh admin page
2. **Verification**: Run diagnostic tool to see exact issue
3. **Fallback**: Use storage_ultra_minimal.sql for policies
4. **Debug**: Check browser dev tools Network tab for detailed error

## 📱 Expected Results After Fix:

- ✅ No more 400 errors in browser console
- ✅ Storage diagnostic shows all green checkmarks
- ✅ Media upload functionality works
- ✅ Files appear in Supabase Storage dashboard

## 🆘 Still Not Working?

If you still get 400 errors after:
1. Creating the bucket
2. Setting it as public
3. Running the diagnostic

Then check:
- Are you in the correct Supabase project?
- Is your internet connection stable?
- Try creating a different bucket name for testing
- Check Supabase status page for outages
