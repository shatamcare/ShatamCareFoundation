# 🚨 STORAGE PERMISSION ERROR TROUBLESHOOTING

## Error: "must be owner of table objects"

### 🔍 **What This Means:**
You don't have sufficient permissions to modify the `storage.objects` table directly. This is normal in managed Supabase instances.

### ✅ **Solution Options:**

#### **Option 1: Use Minimal Storage Setup (Recommended)**
```sql
-- File: database/storage_minimal.sql
-- This uses only the essential policies that work in all Supabase instances
```

#### **Option 2: Storage Policies via Supabase Dashboard**
```
1. Go to: Supabase Dashboard → Storage → Policies
2. Click: "New Policy" 
3. Create policies manually through the UI
```

#### **Option 3: Check If You're Using Correct Project**
```
- Ensure you're connected to YOUR Supabase project
- Verify you have admin/owner access to the project
- Check project URL and API keys are correct
```

### 🎯 **Quick Fix Steps:**

1. **Skip Storage Policies for Now**
   - Create bucket manually: Dashboard → Storage → "New bucket" → name: "media" → Public
   - Test upload functionality - it might work without custom policies

2. **Use Minimal Setup**
   - Run: `database/storage_minimal.sql` instead of the full policy script
   - This has the most compatible policy setup

3. **Verify Bucket First**
   - Ensure the "media" bucket exists and is public
   - Sometimes that's all you need for basic functionality

### 🔧 **Alternative: Test Without Policies**

If policies keep failing, try this approach:
1. Create public bucket in Dashboard
2. Test upload functionality 
3. Add policies later if needed

Many times, a public bucket works fine for basic file uploads without custom RLS policies.

### 📋 **Verification Steps:**

```sql
-- Check if bucket exists (this should work)
SELECT id, name, public FROM storage.buckets WHERE id = 'media';

-- Check existing policies (see what's already there)
SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### 💡 **Pro Tip:**
Start with just the bucket creation. Test if uploads work. Add policies only if you encounter specific permission issues during actual usage.
