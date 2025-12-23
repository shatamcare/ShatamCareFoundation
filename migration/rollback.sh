#!/usr/bin/env bash
set -euo pipefail

#############################################
# Supabase Migration Rollback Script       #
# Helps rollback or cleanup after failed   #
# migration attempts.                       #
#############################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Supabase Migration Rollback Utility"
echo "======================================"

echo "Choose rollback action:"
echo "  1) Restore environment variables from backup"
echo "  2) Clear target project data (clean slate)"
echo "  3) Restore local .env from backup"
echo "  4) List available backups"
echo "  5) Quit"
read -rp "Enter choice (1-5): " ACTION

case "$ACTION" in
    1)
        echo "🔄 Restoring environment variables..."
        if [ -f ".env.backup" ]; then
            cp .env.backup .env
            echo "✅ Restored .env from backup"
        fi
        if [ -f ".env.production.backup" ]; then
            cp .env.production.backup .env.production
            echo "✅ Restored .env.production from backup"
        fi
        if [ -f ".env.local.backup" ]; then
            cp .env.local.backup .env.local
            echo "✅ Restored .env.local from backup"
        fi
        echo "🔧 Environment variables restored to pre-migration state"
        ;;
    2)
        echo "⚠️ This will CLEAR ALL DATA in target project!"
        read -rp "Target Project Ref: " TGT_REF
        read -rp "Target DB Password: " TGT_DB_PW
        echo "⚠️ Are you sure? This cannot be undone! (type 'CLEAR' to confirm): "
        read -r CONFIRM
        if [ "$CONFIRM" = "CLEAR" ]; then
            TGT_CONN="postgres://postgres:${TGT_DB_PW}@db.${TGT_REF}.supabase.co:5432/postgres"
            echo "🗑️ Clearing public schema..."
            psql "$TGT_CONN" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" >/dev/null
            echo "✅ Target project cleared"
        else
            echo "❌ Cancelled"
        fi
        ;;
    3)
        echo "📂 Available .env backups:"
        ls -la *.backup 2>/dev/null || echo "No backup files found"
        echo ""
        read -rp "Which backup to restore? (e.g., .env.backup): " BACKUP_FILE
        if [ -f "$BACKUP_FILE" ]; then
            TARGET_FILE="${BACKUP_FILE%.backup}"
            cp "$BACKUP_FILE" "$TARGET_FILE"
            echo "✅ Restored $TARGET_FILE from $BACKUP_FILE"
        else
            echo "❌ Backup file not found"
        fi
        ;;
    4)
        echo "📂 Available backups:"
        echo "Environment backups:"
        ls -la *.backup 2>/dev/null || echo "  No .env backups found"
        echo ""
        echo "Database backups:"
        ls -la migration/database/ 2>/dev/null || echo "  No database backups found"
        echo ""
        echo "Storage backups:"
        ls -la migration/storage/ 2>/dev/null || echo "  No storage backups found"
        ;;
    5)
        echo "Goodbye"; exit 0 ;;
    *)
        echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo "✅ Rollback operation completed"