# Migration Tools

This directory contains comprehensive tools for migrating Supabase projects between accounts.

## Quick Start

```bash
# 1. Export current project
./migrate-project.sh

# 2. Import to new project
./migrate-project.sh

# 3. Update environment 
./migrate-project.sh

# 4. Validate migration
./validate-migration.sh
```

## Available Tools

| Script | Purpose |
|--------|---------|
| **migrate-project.sh** | 🚀 Main migration orchestrator (interactive) |
| **validate-migration.sh** | ✅ Validates migration success |
| **rollback.sh** | 🔄 Rollback and cleanup utilities |
| **update-env.sh** | 🔧 Updates environment variables |
| **export-storage.js** | 📦 Exports storage buckets and files |
| **import-storage.js** | 📤 Imports storage to new project |

## Documentation

- **[Migration Guide](MIGRATION_GUIDE.md)** - Quick overview
- **[Complete Guide](../SUPABASE_MIGRATION_GUIDE.md)** - Comprehensive documentation
- **[CLI Commands](../SUPABASE_CLI_MIGRATION_GUIDE.md)** - Step-by-step CLI instructions

## Directory Structure

```
migration/
├── migrate-project.sh          # Main orchestrator
├── validate-migration.sh       # Migration validation
├── rollback.sh                 # Rollback utilities
├── update-env.sh               # Environment updates
├── export-storage.js           # Storage export
├── import-storage.js           # Storage import
├── export-schema.sql          # Schema export queries
├── export-introspection.sql   # Database introspection
├── MIGRATION_GUIDE.md         # Quick guide
├── database/                  # Export destination
├── storage/                   # Storage backups
└── validation/               # Validation reports
```

## Prerequisites

- Supabase CLI: `npm install -g supabase`
- PostgreSQL client: `psql`, `pg_dump`
- Node.js for storage scripts

## Migration Process

1. **Export** - Backs up schema, data, and storage from source project
2. **Import** - Restores everything to target project
3. **Validate** - Compares source vs target to ensure successful migration
4. **Update** - Updates environment variables and configurations

## Safety Features

- ✅ Comprehensive validation
- ✅ Backup creation before changes
- ✅ Rollback utilities
- ✅ Error handling and warnings
- ✅ Progress reporting

## Support

- Review validation reports in `validation/`
- Use rollback tools if needed
- Check comprehensive documentation
- Contact Supabase support for account-level issues