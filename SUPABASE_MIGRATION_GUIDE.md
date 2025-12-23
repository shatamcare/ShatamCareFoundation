# Complete Supabase Project Migration Guide

## Quick Start

**For immediate migration with our automated tools:**

```bash
# 1. Export from current project
./migration/migrate-project.sh
# Choose option 1, provide source project credentials

# 2. Import to new project  
./migration/migrate-project.sh
# Choose option 2, provide target project credentials

# 3. Update environment variables
./migration/migrate-project.sh  
# Choose option 3, provide new project details

# 4. Validate migration
./migration/validate-migration.sh

# 5. Deploy updated application
npm run build
```

---

## Overview

This repository includes a complete migration framework for transferring Supabase projects between accounts. The migration preserves:

- ✅ **Database Schema** (tables, columns, constraints, indexes)
- ✅ **Row-Level Security (RLS) Policies**
- ✅ **Database Functions & Triggers**
- ✅ **Table Data** (optional, configurable)
- ✅ **Storage Buckets & Files**
- ✅ **Environment Configuration**

## Prerequisites

Before starting migration:

1. **Access to source project** (database password, service role key)
2. **New Supabase project created** in target account
3. **Required tools installed:**
   ```bash
   # Check prerequisites
   command -v supabase >/dev/null || echo "Install Supabase CLI"
   command -v psql >/dev/null || echo "Install PostgreSQL client"
   command -v pg_dump >/dev/null || echo "Install PostgreSQL client"
   command -v node >/dev/null || echo "Install Node.js"
   ```

## Migration Methods

### Method 1: Automated Migration (Recommended)

Our migration orchestrator handles the complete process:

```bash
./migration/migrate-project.sh
```

**Step 1: Export** (Option 1)
- Exports complete schema and RLS policies
- Exports selected or all table data as CSV and SQL
- Recursively exports all storage buckets and files
- Creates manifest files for validation

**Step 2: Import** (Option 2)  
- Creates schema in target project
- Imports all RLS policies and constraints
- Imports table data from CSV files
- Recreates storage buckets and uploads files

**Step 3: Update Environment** (Option 3)
- Updates all .env files with new project URLs and keys
- Creates backups of original configuration
- Provides rollback instructions

### Method 2: Manual CLI Commands

For full control or troubleshooting:

#### Export Phase
```bash
# Set source project variables
SOURCE_REF="your-source-project-ref"
SOURCE_DB_PW="your-source-db-password"
SOURCE_SERVICE_KEY="your-source-service-role-key"

# Export database schema
pg_dump --schema=public --schema-only --no-owner --no-privileges \
  "postgres://postgres:${SOURCE_DB_PW}@db.${SOURCE_REF}.supabase.co:5432/postgres" \
  > migration/database/schema_export.sql

# Export data (optional)
pg_dump --schema=public --data-only --inserts --no-owner --no-privileges \
  "postgres://postgres:${SOURCE_DB_PW}@db.${SOURCE_REF}.supabase.co:5432/postgres" \
  > migration/database/data_export.sql

# Export storage
SUPABASE_SERVICE_ROLE_KEY="$SOURCE_SERVICE_KEY" \
SUPABASE_URL_OVERRIDE="https://${SOURCE_REF}.supabase.co" \
node migration/export-storage.js
```

#### Import Phase  
```bash
# Set target project variables
TARGET_REF="your-target-project-ref"  
TARGET_DB_PW="your-target-db-password"
TARGET_SERVICE_KEY="your-target-service-role-key"

# Import schema
psql "postgres://postgres:${TARGET_DB_PW}@db.${TARGET_REF}.supabase.co:5432/postgres" \
  -f migration/database/schema_export.sql

# Import data (optional)
psql "postgres://postgres:${TARGET_DB_PW}@db.${TARGET_REF}.supabase.co:5432/postgres" \
  -f migration/database/data_export.sql

# Import storage
NEW_SUPABASE_URL="https://${TARGET_REF}.supabase.co" \
NEW_SUPABASE_SERVICE_ROLE_KEY="$TARGET_SERVICE_KEY" \
node migration/import-storage.js
```

## Migration Options

### Schema & Policies Only
For new projects where you only need the database structure:

```bash
./migration/migrate-project.sh
# Option 1: Choose "schema only" when prompted
# Option 2: Import schema and empty tables
```

### Schema + Data Migration
For complete project migration including all data:

```bash
./migration/migrate-project.sh  
# Option 1: Choose "full export" when prompted
# Option 2: Import schema and all data
```

### Selective Data Migration
For partial data migration (recommended tables only):

```bash
# The orchestrator automatically exports key application tables:
# - site_settings
# - programs  
# - events
# Custom tables can be added by modifying migrate-project.sh
```

## Post-Migration Tasks

### 1. Validation
```bash
# Comprehensive migration validation
./migration/validate-migration.sh

# Manual validation
psql "postgres://postgres:${TARGET_DB_PW}@db.${TARGET_REF}.supabase.co:5432/postgres" \
  -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

### 2. Environment Updates
```bash
# Update all environment files
./migration/update-env.sh

# Or manually update:
# VITE_SUPABASE_URL=https://new-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=new-anon-key
```

### 3. Application Deployment
```bash
# Build with new configuration
npm run build

# Deploy to production
# Update CI/CD secrets with new Supabase credentials
```

### 4. Additional Adjustments

**API Keys & Services:**
- Update webhook URLs in external services
- Update third-party integrations (payment processors, email services)
- Regenerate and update service role keys in CI/CD

**Custom Domains & DNS:**
- Update CNAME records if using custom domains
- Update CORS settings in new Supabase project

**Team Access:**
- Invite team members to new Supabase project
- Update access permissions and roles

## Troubleshooting

### Common Issues

**Schema Import Warnings:**
```
⚠️ Some schema import warnings (normal for constraints/indexes)
```
This is expected - constraints may reference tables not yet created.

**Storage Permission Errors:**
```
❌ Storage export failed: permissions
```
Ensure service role key has storage admin permissions.

**Connection Timeouts:**
```bash
# Increase PostgreSQL timeout
export PGCONNECT_TIMEOUT=60
```

### Rollback Procedures

If migration fails or needs to be undone:

```bash
# Rollback utilities
./migration/rollback.sh

# Options:
# 1. Restore environment variables from backup
# 2. Clear target project (clean slate)  
# 3. Restore specific .env files
# 4. List available backups
```

### Validation Failures

If validation detects differences:

```bash
# Review detailed differences
cat migration/validation/validation_report.md
cat migration/validation/table_diff.txt
cat migration/validation/policy_diff.txt
```

## Migration Checklist

### Pre-Migration
- [ ] Source project credentials collected
- [ ] Target project created in new account  
- [ ] Prerequisites installed (CLI tools)
- [ ] Application tested in source environment
- [ ] Backup plan established

### Export Phase
- [ ] Schema exported successfully
- [ ] RLS policies captured
- [ ] Data exported (if required)
- [ ] Storage files backed up
- [ ] Export validation completed

### Import Phase  
- [ ] Schema imported to target
- [ ] RLS policies applied
- [ ] Data imported (if applicable)
- [ ] Storage recreated
- [ ] Import validation passed

### Post-Migration
- [ ] Environment variables updated
- [ ] Application rebuilt with new config
- [ ] Production deployment updated
- [ ] All features tested
- [ ] Team access configured
- [ ] External services updated
- [ ] Old project decommissioned (after grace period)

## Migration Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `migrate-project.sh` | Main orchestrator | Interactive migration wizard |
| `export-storage.js` | Storage backup | Exports all buckets and files |
| `import-storage.js` | Storage restore | Recreates buckets and uploads files |
| `update-env.sh` | Environment config | Updates .env files for new project |
| `validate-migration.sh` | Validation | Compares source vs target |
| `rollback.sh` | Rollback tools | Cleanup and restoration utilities |

## Getting Help

**For migration issues:**
1. Check validation reports in `migration/validation/`
2. Review Supabase logs in both projects
3. Use rollback tools for cleanup
4. Contact Supabase support for account-level issues

**For application issues:**
1. Verify environment variables are correct
2. Check browser console for API errors
3. Validate database connectivity
4. Test with fresh browser session (clear cache)

---

## Advanced Migration Scenarios

### Large Dataset Migration
For projects with large amounts of data:

```bash
# Use table-by-table export for better control
psql "$SOURCE_CONN" -c "\COPY (SELECT * FROM large_table) TO 'large_table.csv' CSV"

# Import with proper memory settings
psql "$TARGET_CONN" -c "SET work_mem = '256MB';"
psql "$TARGET_CONN" -c "\COPY large_table FROM 'large_table.csv' CSV"
```

### Production Zero-Downtime Migration
For production applications requiring minimal downtime:

1. **Phase 1:** Schema migration (off-peak hours)
2. **Phase 2:** Data synchronization with source still active
3. **Phase 3:** Final sync and cutover (minimal downtime)
4. **Phase 4:** Validation and rollback capability

### Multi-Environment Migration
For applications with staging/production environments:

```bash
# Export once, import to multiple targets
./migration/migrate-project.sh  # Export
# Change target credentials for each environment
./migration/migrate-project.sh  # Import to staging
./migration/migrate-project.sh  # Import to production
```

This migration framework provides a robust, tested solution for Supabase project transfers while minimizing risks and downtime.