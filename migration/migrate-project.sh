#!/usr/bin/env bash
set -euo pipefail

#############################################
# Supabase Project Migration Orchestrator   #
# Interactive helper to export from source  #
# project and import into a target project. #
#############################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Supabase Project Migration Orchestrator"
echo "==========================================="

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "❌ Required command '$1' not found."; missing=1; }; }
missing=0
need_cmd supabase
need_cmd psql
need_cmd pg_dump
need_cmd node
if [ "${missing}" = 1 ]; then
    echo "Install missing dependencies then re-run."; exit 1
fi

echo ""; echo "Choose an action:";
echo "  1) Full export (schema+selected data+storage)"
echo "  2) Import into new project (schema+data+storage)"
echo "  3) Update environment (.env files)"
echo "  4) Quit"
read -rp "Enter choice (1-4): " ACTION

case "$ACTION" in
    1)
        echo "🔐 Source project credentials"
        read -rp "Source Project Ref (e.g. uumavtvxuncetfqwlgvp): " SRC_REF
        read -rp "Source DB Password: " SRC_DB_PW
        read -rp "Source Service Role Key (for storage export): " SRC_SERVICE_ROLE
        export SUPABASE_SERVICE_ROLE_KEY="$SRC_SERVICE_ROLE"
        SRC_DB_CONN="postgres://postgres:${SRC_DB_PW}@db.${SRC_REF}.supabase.co:5432/postgres"
        EXPORT_DIR="$SCRIPT_DIR/database"; mkdir -p "$EXPORT_DIR" "$SCRIPT_DIR/storage"
        echo "📦 Exporting schema..."
        pg_dump --schema-only --no-owner --no-privileges "$SRC_DB_CONN" > "$EXPORT_DIR/schema_export.sql"
        echo "✅ Schema exported -> migration/database/schema_export.sql"
        echo "📦 Exporting data for application tables..."
        TABLES=(site_settings programs events)
        for t in "${TABLES[@]}"; do
            echo "  ⏳ $t";
            psql "$SRC_DB_CONN" -c "\\COPY (SELECT * FROM public.${t}) TO '$EXPORT_DIR/${t}.csv' CSV" >/dev/null
        done
        echo "✅ Table data exported (CSV)"
        echo "🗄️ Exporting storage (root files only & flat) — use export-storage.js for recursive if needed"
        # Use existing Node script (will leverage service role env var update below)
        SRC_SUPABASE_URL="https://${SRC_REF}.supabase.co" SUPABASE_URL_OVERRIDE="https://${SRC_REF}.supabase.co" node "$SCRIPT_DIR/export-storage.js"
        echo "🎉 Export phase complete"
        ;;
    2)
        echo "🆕 Target project credentials"
        read -rp "Target Project Ref: " NEW_REF
        read -rp "Target DB Password: " NEW_DB_PW
        read -rp "Target Service Role Key: " NEW_SERVICE_ROLE
        export SUPABASE_SERVICE_ROLE_KEY="$NEW_SERVICE_ROLE"
        NEW_DB_CONN="postgres://postgres:${NEW_DB_PW}@db.${NEW_REF}.supabase.co:5432/postgres"
        IMPORT_DIR="$SCRIPT_DIR/database"
        if [ ! -f "$IMPORT_DIR/schema_export.sql" ]; then
            echo "❌ schema_export.sql not found in migration/database. Run export first."; exit 1; fi
        echo "📥 Importing schema..."
        psql "$NEW_DB_CONN" -f "$IMPORT_DIR/schema_export.sql" >/dev/null
        echo "✅ Schema imported"
        echo "� Importing table data...";
        for csv in "$IMPORT_DIR"/*.csv; do
            [ -e "$csv" ] || { echo "⚠️ No CSV files found."; break; }
            base=$(basename "$csv" .csv)
            echo "  ⏳ $base";
            psql "$NEW_DB_CONN" -c "TRUNCATE TABLE public.${base} RESTART IDENTITY CASCADE;" >/dev/null || true
            psql "$NEW_DB_CONN" -c "\\COPY public.${base} FROM '$csv' CSV" >/dev/null
        done
        echo "✅ Data imported"
        echo "�️ Importing storage files"
        NEW_SUPABASE_URL="https://${NEW_REF}.supabase.co" NEW_SUPABASE_SERVICE_ROLE_KEY="$NEW_SERVICE_ROLE" node "$SCRIPT_DIR/import-storage.js"
        echo "🎉 Import phase complete"
        ;;
    3)
        bash "$SCRIPT_DIR/update-env.sh"; ;;
    4)
        echo "Bye"; exit 0; ;;
    *) echo "Invalid choice"; exit 1; ;;
esac

echo ""; echo "Next steps:";
echo "  • If you just exported: create new project then run this script again and choose option 2."
echo "  • After import: choose option 3 to update environment variables, rebuild, redeploy."
echo "  • Finally test all admin features before deleting old project." 
echo "✅ Done"
