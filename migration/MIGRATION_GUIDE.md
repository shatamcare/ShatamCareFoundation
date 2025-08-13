# Supabase Project Migration Guide

## Overview
This guide helps you migrate your Supabase project from one account to another. Since Supabase doesn't support direct project transfers, we'll migrate all data and configurations.

## Current Project Details
- **Project ID**: `uumavtvxuncetfqwlgvp`
- **URL**: `https://uumavtvxuncetfqwlgvp.supabase.co`

## Migration Options

### Option 1: Complete Migration (Recommended)

#### Prerequisites
1. Access to current Supabase project (source)
2. New Supabase project created in target account
3. Supabase CLI installed
4. Database admin access to both projects

#### Step 1: Backup Current Project

##### 1.1 Export Database Schema and Data
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase CLI with your current account
supabase login

# Initialize local Supabase project
supabase init

# Link to your current project
supabase link --project-ref uumavtvxuncetfqwlgvp

# Generate migration files from existing database
supabase db diff --schema public --use-migra > migration/database/initial_schema.sql

# Export data using pg_dump (you'll need your database password)
# Get connection string from Supabase dashboard -> Settings -> Database
pg_dump "postgresql://postgres:[PASSWORD]@db.uumavtvxuncetfqwlgvp.supabase.co:5432/postgres" \
  --data-only --inserts --schema=public > migration/database/data_export.sql
```

##### 1.2 Export Storage Files
```bash
# Create storage backup script
node migration/export-storage.js
```

##### 1.3 Export Edge Functions
```bash
# Copy your edge functions
cp -r supabase/functions migration/functions/
```

#### Step 2: Set Up New Project

##### 2.1 Get New Project Credentials
1. Go to new Supabase project dashboard
2. Copy the new project URL and anon key
3. Note the new project ID

##### 2.2 Update Environment Variables
```bash
# Update .env files with new credentials
VITE_SUPABASE_URL=https://[NEW_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
```

#### Step 3: Import to New Project

##### 3.1 Import Database Schema
```bash
# Link CLI to new project
supabase link --project-ref [NEW_PROJECT_ID]

# Run migration
supabase db push

# Or import manually via SQL editor in Supabase dashboard
```

##### 3.2 Import Data
```bash
# Import data using psql
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_ID].supabase.co:5432/postgres" \
  -f migration/database/data_export.sql
```

##### 3.3 Import Storage Files
```bash
# Upload storage files using the import script
node migration/import-storage.js
```

##### 3.4 Deploy Edge Functions
```bash
# Deploy functions to new project
supabase functions deploy
```

### Option 2: Manual Export/Import via Dashboard

#### For Database:
1. **Export Schema**: Use SQL editor to run schema export queries
2. **Export Data**: Use `COPY` commands or manual CSV exports
3. **Import to New Project**: Run the exported SQL in new project

#### For Storage:
1. **Download Files**: Use Supabase dashboard or API
2. **Upload to New Project**: Use new project's storage interface

### Option 3: Request Supabase Support

#### Contact Supabase directly:
1. Open a support ticket at support@supabase.io
2. Explain you need to transfer project ownership
3. Provide both account emails and project details
4. They might be able to help with direct transfer

## Important Considerations

### 🚨 Critical Points:
1. **Downtime**: Plan for potential downtime during migration
2. **Testing**: Test the new project thoroughly before switching
3. **DNS/Domain**: Update any custom domains to point to new project
4. **API Keys**: All API keys will change
5. **Webhooks**: Update any webhook URLs
6. **Third-party Integrations**: Update all external service configurations

### 🔄 Rollback Plan:
- Keep old project active until migration is confirmed successful
- Have a rollback plan to switch back if issues arise
- Test all functionality in new project before decommissioning old one

### 📝 Migration Checklist:
- [ ] Database schema exported
- [ ] Database data exported
- [ ] Storage files backed up
- [ ] Edge functions copied
- [ ] New project created
- [ ] Schema imported to new project
- [ ] Data imported to new project
- [ ] Storage files uploaded
- [ ] Edge functions deployed
- [ ] Environment variables updated
- [ ] Application tested with new project
- [ ] Custom domains updated
- [ ] Third-party services updated
- [ ] Old project decommissioned

## Post-Migration Tasks

1. **Update Repository Secrets**: If using CI/CD, update all Supabase-related secrets
2. **Update Documentation**: Update any documentation with new project details
3. **Monitor Performance**: Ensure new project performs as expected
4. **Update Team Access**: Add team members to new project
5. **Clean Up**: Remove old project once migration is confirmed successful

## Need Help?

If you encounter issues during migration:
1. Check Supabase documentation: https://supabase.com/docs
2. Contact Supabase support: support@supabase.io
3. Use Supabase Discord community for quick help
4. Review migration logs for specific error messages

## Files Created for Migration:
- `migration/migrate-project.sh` - Main migration script
- `migration/export-schema.sql` - Schema export queries
- `migration/database/` - Database exports
- `migration/storage/` - Storage file backups
- `migration/config/` - Configuration backups
