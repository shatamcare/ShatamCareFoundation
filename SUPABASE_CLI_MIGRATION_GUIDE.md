# Supabase Migration CLI Commands Guide

This guide provides the exact CLI commands for migrating your Supabase project between accounts.

## Prerequisites Setup

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Verify required tools
command -v supabase && echo "✅ Supabase CLI installed" || echo "❌ Install Supabase CLI"
command -v psql && echo "✅ PostgreSQL client available" || echo "❌ Install PostgreSQL client"
command -v pg_dump && echo "✅ pg_dump available" || echo "❌ Install PostgreSQL client tools"
command -v node && echo "✅ Node.js available" || echo "❌ Install Node.js"

# 3. Navigate to your project directory
cd /path/to/your/ShatamCareFoundation
```

## Method 1: Automated Migration (Recommended)

### Step 1: Export from Source Project
```bash
# Run the migration orchestrator
./migration/migrate-project.sh

# When prompted, choose option 1
# Provide:
# - Source Project Ref: your-current-project-ref
# - Source DB Password: your-database-password
# - Source Service Role Key: your-service-role-key
# - Full export choice: y (for complete migration) or N (for schema only)
```

### Step 2: Import to Target Project
```bash
# Create new Supabase project first at https://app.supabase.com
# Then run the migration orchestrator again
./migration/migrate-project.sh

# When prompted, choose option 2
# Provide:
# - Target Project Ref: your-new-project-ref
# - Target DB Password: your-new-database-password
# - Target Service Role Key: your-new-service-role-key
```

### Step 3: Update Environment
```bash
# Update environment variables
./migration/migrate-project.sh

# When prompted, choose option 3
# Provide:
# - New Project ID: your-new-project-ref
# - New Anon Key: your-new-anon-key
```

### Step 4: Validate Migration
```bash
# Validate the migration was successful
./migration/validate-migration.sh

# Provide credentials for both source and target projects
```

## Method 2: Manual CLI Commands

### Phase 1: Export Source Project

```bash
# Set your source project variables
export SOURCE_REF="your-source-project-ref"
export SOURCE_DB_PW="your-source-db-password"
export SOURCE_SERVICE_KEY="your-source-service-role-key"
export SOURCE_DB_CONN="postgres://postgres:${SOURCE_DB_PW}@db.${SOURCE_REF}.supabase.co:5432/postgres"

# Create export directories
mkdir -p migration/database migration/storage

# Export complete database schema
pg_dump --schema=public --schema-only --no-owner --no-privileges \
  "$SOURCE_DB_CONN" > migration/database/schema_export.sql

echo "✅ Schema exported"

# Export all table data (optional - for complete migration)
pg_dump --schema=public --data-only --inserts --no-owner --no-privileges \
  "$SOURCE_DB_CONN" > migration/database/data_export.sql

echo "✅ Data exported"

# Export specific application tables as CSV (recommended)
psql "$SOURCE_DB_CONN" -c "\\COPY (SELECT * FROM public.site_settings) TO 'migration/database/site_settings.csv' CSV"
psql "$SOURCE_DB_CONN" -c "\\COPY (SELECT * FROM public.programs) TO 'migration/database/programs.csv' CSV"
psql "$SOURCE_DB_CONN" -c "\\COPY (SELECT * FROM public.events) TO 'migration/database/events.csv' CSV"

echo "✅ CSV exports completed"

# Export storage files
SUPABASE_SERVICE_ROLE_KEY="$SOURCE_SERVICE_KEY" \
SUPABASE_URL_OVERRIDE="https://${SOURCE_REF}.supabase.co" \
node migration/export-storage.js

echo "✅ Storage exported"
```

### Phase 2: Import to Target Project

```bash
# Set your target project variables  
export TARGET_REF="your-target-project-ref"
export TARGET_DB_PW="your-target-db-password"
export TARGET_SERVICE_KEY="your-target-service-role-key"
export TARGET_DB_CONN="postgres://postgres:${TARGET_DB_PW}@db.${TARGET_REF}.supabase.co:5432/postgres"

# Import database schema
psql "$TARGET_DB_CONN" -f migration/database/schema_export.sql

echo "✅ Schema imported"

# Import data from SQL dump (if you exported full data)
psql "$TARGET_DB_CONN" -f migration/database/data_export.sql

# OR import data from CSV files (recommended approach)
psql "$TARGET_DB_CONN" -c "\\COPY public.site_settings FROM 'migration/database/site_settings.csv' CSV"
psql "$TARGET_DB_CONN" -c "\\COPY public.programs FROM 'migration/database/programs.csv' CSV"
psql "$TARGET_DB_CONN" -c "\\COPY public.events FROM 'migration/database/events.csv' CSV"

echo "✅ Data imported"

# Import storage files
NEW_SUPABASE_URL="https://${TARGET_REF}.supabase.co" \
NEW_SUPABASE_SERVICE_ROLE_KEY="$TARGET_SERVICE_KEY" \
node migration/import-storage.js

echo "✅ Storage imported"
```

### Phase 3: Update Configuration

```bash
# Method A: Use the automated script
./migration/update-env.sh

# Method B: Manual environment update
# Update .env files with new values:
echo "VITE_SUPABASE_URL=https://${TARGET_REF}.supabase.co" > .env.new
echo "VITE_SUPABASE_ANON_KEY=your-new-anon-key" >> .env.new

# Backup and replace existing .env files
cp .env .env.backup
cp .env.new .env

# Update production environment file
cp .env.production .env.production.backup
sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=https://${TARGET_REF}.supabase.co|g" .env.production
sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=your-new-anon-key|g" .env.production

echo "✅ Environment updated"
```

## Phase 4: Validation & Testing

### Database Validation
```bash
# Compare table counts between source and target
echo "Validating table counts..."

# Source counts
psql "$SOURCE_DB_CONN" -Atc "SELECT 'site_settings', COUNT(*) FROM public.site_settings;"
psql "$SOURCE_DB_CONN" -Atc "SELECT 'programs', COUNT(*) FROM public.programs;"
psql "$SOURCE_DB_CONN" -Atc "SELECT 'events', COUNT(*) FROM public.events;"

# Target counts  
psql "$TARGET_DB_CONN" -Atc "SELECT 'site_settings', COUNT(*) FROM public.site_settings;"
psql "$TARGET_DB_CONN" -Atc "SELECT 'programs', COUNT(*) FROM public.programs;"
psql "$TARGET_DB_CONN" -Atc "SELECT 'events', COUNT(*) FROM public.events;"

# Verify RLS policies
psql "$TARGET_DB_CONN" -c "SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';"

echo "✅ Database validation completed"
```

### Application Testing
```bash
# Build application with new configuration
npm install
npm run typecheck
npm run build

echo "✅ Application built successfully"

# Test locally
npm run dev

# Test key functionality:
# - Admin login
# - Program management  
# - Event management
# - Storage upload/download
```

### Automated Validation
```bash
# Use the comprehensive validation script
./migration/validate-migration.sh

# Review validation report
cat migration/validation/validation_report.md

# Check for any differences
[ -s migration/validation/table_diff.txt ] && echo "⚠️ Table differences found" || echo "✅ Tables match"
[ -s migration/validation/policy_diff.txt ] && echo "⚠️ Policy differences found" || echo "✅ Policies match"
```

## Rollback Commands (If Needed)

### Restore Environment Variables
```bash
# Use rollback utility
./migration/rollback.sh
# Choose option 1 to restore environment variables

# OR manually restore from backup
cp .env.backup .env
cp .env.production.backup .env.production

echo "✅ Environment variables restored"
```

### Clear Target Database (Clean Slate)
```bash
# ⚠️ WARNING: This removes ALL data from target project
export TARGET_DB_CONN="postgres://postgres:${TARGET_DB_PW}@db.${TARGET_REF}.supabase.co:5432/postgres"

psql "$TARGET_DB_CONN" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "⚠️ Target database cleared"
```

## Troubleshooting Commands

### Connection Issues
```bash
# Test database connectivity
psql "$SOURCE_DB_CONN" -c "SELECT version();"
psql "$TARGET_DB_CONN" -c "SELECT version();"

# Check if schemas exist
psql "$TARGET_DB_CONN" -c "SELECT schema_name FROM information_schema.schemata;"
```

### Permission Issues
```bash
# Verify service role key permissions
curl -H "Authorization: Bearer $SOURCE_SERVICE_KEY" \
     -H "apikey: $SOURCE_SERVICE_KEY" \
     "https://${SOURCE_REF}.supabase.co/storage/v1/bucket"

# Test target project connectivity
curl -H "Authorization: Bearer $TARGET_SERVICE_KEY" \
     -H "apikey: $TARGET_SERVICE_KEY" \
     "https://${TARGET_REF}.supabase.co/storage/v1/bucket"
```

### Storage Issues
```bash
# Debug storage export
SUPABASE_SERVICE_ROLE_KEY="$SOURCE_SERVICE_KEY" \
SUPABASE_URL_OVERRIDE="https://${SOURCE_REF}.supabase.co" \
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL_OVERRIDE, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.storage.listBuckets().then(r => console.log('Buckets:', r));
"

# Check storage permissions in Supabase dashboard:
# 1. Go to Storage > Settings
# 2. Verify service role has storage admin permissions
```

## Production Deployment Commands

### Update CI/CD Secrets
```bash
# If using GitHub Actions, update repository secrets:
# - VITE_SUPABASE_URL: https://your-new-project-ref.supabase.co  
# - VITE_SUPABASE_ANON_KEY: your-new-anon-key
# - Any other Supabase-related secrets

# If using other CI/CD platforms, update environment variables accordingly
```

### Deploy Updated Application
```bash
# Build for production
npm run build

# Deploy to your hosting platform (Netlify, Vercel, etc.)
# The exact command depends on your deployment method

# For GitHub Pages:
npm run build:github-pages

# For custom domain:
npm run build:custom-domain
```

This guide provides all the necessary CLI commands for a successful Supabase migration. Choose the automated method for simplicity or use manual commands for full control over the process.