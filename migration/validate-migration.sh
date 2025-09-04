#!/usr/bin/env bash
set -euo pipefail

#############################################
# Supabase Migration Validation Script     #
# Validates migration success by comparing  #
# schema, policies, and data between        #
# source and target projects.              #
#############################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔍 Supabase Migration Validation"
echo "================================="

# Get project details
read -rp "Source Project Ref: " SRC_REF
read -rp "Source DB Password: " SRC_DB_PW
read -rp "Target Project Ref: " TGT_REF
read -rp "Target DB Password: " TGT_DB_PW

SRC_CONN="postgres://postgres:${SRC_DB_PW}@db.${SRC_REF}.supabase.co:5432/postgres"
TGT_CONN="postgres://postgres:${TGT_DB_PW}@db.${TGT_REF}.supabase.co:5432/postgres"

VALIDATION_DIR="$SCRIPT_DIR/validation"
mkdir -p "$VALIDATION_DIR"

echo "📊 Running validation checks..."

# 1. Compare table structures
echo "🏗️ Validating table structures..."
psql "$SRC_CONN" -Atc "
SELECT schemaname, tablename, 
       array_agg(column_name::text ORDER BY ordinal_position) as columns,
       array_agg(data_type::text ORDER BY ordinal_position) as types
FROM information_schema.columns 
WHERE table_schema = 'public' 
GROUP BY schemaname, tablename 
ORDER BY tablename;" > "$VALIDATION_DIR/source_tables.txt"

psql "$TGT_CONN" -Atc "
SELECT schemaname, tablename, 
       array_agg(column_name::text ORDER BY ordinal_position) as columns,
       array_agg(data_type::text ORDER BY ordinal_position) as types
FROM information_schema.columns 
WHERE table_schema = 'public' 
GROUP BY schemaname, tablename 
ORDER BY tablename;" > "$VALIDATION_DIR/target_tables.txt"

if diff "$VALIDATION_DIR/source_tables.txt" "$VALIDATION_DIR/target_tables.txt" > "$VALIDATION_DIR/table_diff.txt"; then
    echo "✅ Table structures match"
else
    echo "⚠️ Table structure differences found - see validation/table_diff.txt"
fi

# 2. Compare RLS policies
echo "🔒 Validating RLS policies..."
psql "$SRC_CONN" -Atc "
SELECT schemaname, tablename, policyname, cmd, 
       COALESCE(qual, 'NULL') as qual, 
       COALESCE(with_check, 'NULL') as with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;" > "$VALIDATION_DIR/source_policies.txt"

psql "$TGT_CONN" -Atc "
SELECT schemaname, tablename, policyname, cmd, 
       COALESCE(qual, 'NULL') as qual, 
       COALESCE(with_check, 'NULL') as with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;" > "$VALIDATION_DIR/target_policies.txt"

if diff "$VALIDATION_DIR/source_policies.txt" "$VALIDATION_DIR/target_policies.txt" > "$VALIDATION_DIR/policy_diff.txt"; then
    echo "✅ RLS policies match"
else
    echo "⚠️ RLS policy differences found - see validation/policy_diff.txt"
fi

# 3. Compare row counts for key tables
echo "📊 Validating data counts..."
TABLES=(site_settings programs events)
for table in "${TABLES[@]}"; do
    SRC_COUNT=$(psql "$SRC_CONN" -Atc "SELECT COUNT(*) FROM public.${table};" 2>/dev/null || echo "0")
    TGT_COUNT=$(psql "$TGT_CONN" -Atc "SELECT COUNT(*) FROM public.${table};" 2>/dev/null || echo "0")
    
    if [ "$SRC_COUNT" = "$TGT_COUNT" ]; then
        echo "✅ Table $table: $SRC_COUNT rows (match)"
    else
        echo "⚠️ Table $table: source=$SRC_COUNT, target=$TGT_COUNT (mismatch)"
    fi
done

# 4. Validate functions
echo "⚙️ Validating functions..."
psql "$SRC_CONN" -Atc "
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;" > "$VALIDATION_DIR/source_functions.txt"

psql "$TGT_CONN" -Atc "
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;" > "$VALIDATION_DIR/target_functions.txt"

if diff "$VALIDATION_DIR/source_functions.txt" "$VALIDATION_DIR/target_functions.txt" > "$VALIDATION_DIR/function_diff.txt"; then
    echo "✅ Functions match"
else
    echo "⚠️ Function differences found - see validation/function_diff.txt"
fi

# 5. Test basic connectivity
echo "🔗 Testing connectivity..."
if psql "$TGT_CONN" -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Target database connection successful"
else
    echo "❌ Target database connection failed"
fi

# 6. Generate validation report
echo "📋 Generating validation report..."
cat > "$VALIDATION_DIR/validation_report.md" << EOF
# Migration Validation Report

**Migration Date:** $(date)
**Source Project:** $SRC_REF
**Target Project:** $TGT_REF

## Summary

$([ -s "$VALIDATION_DIR/table_diff.txt" ] && echo "⚠️ Table structure differences detected" || echo "✅ Table structures validated")
$([ -s "$VALIDATION_DIR/policy_diff.txt" ] && echo "⚠️ RLS policy differences detected" || echo "✅ RLS policies validated")
$([ -s "$VALIDATION_DIR/function_diff.txt" ] && echo "⚠️ Function differences detected" || echo "✅ Functions validated")

## Data Validation
$(for table in "${TABLES[@]}"; do
    SRC_COUNT=$(psql "$SRC_CONN" -Atc "SELECT COUNT(*) FROM public.${table};" 2>/dev/null || echo "0")
    TGT_COUNT=$(psql "$TGT_CONN" -Atc "SELECT COUNT(*) FROM public.${table};" 2>/dev/null || echo "0")
    echo "- **$table**: Source=$SRC_COUNT, Target=$TGT_COUNT $([ "$SRC_COUNT" = "$TGT_COUNT" ] && echo "(✅ Match)" || echo "(⚠️ Mismatch)")"
done)

## Next Steps

$([ -s "$VALIDATION_DIR/table_diff.txt" ] && echo "1. Review table structure differences in validation/table_diff.txt")
$([ -s "$VALIDATION_DIR/policy_diff.txt" ] && echo "2. Review RLS policy differences in validation/policy_diff.txt")
$([ -s "$VALIDATION_DIR/function_diff.txt" ] && echo "3. Review function differences in validation/function_diff.txt")

If all validations pass, your migration is complete!
EOF

echo ""
echo "✅ Validation complete!"
echo "📁 Reports saved to: $VALIDATION_DIR"
echo "📋 View detailed report: cat $VALIDATION_DIR/validation_report.md"

# Display summary
echo ""
echo "🎯 Migration Validation Summary:"
[ -s "$VALIDATION_DIR/table_diff.txt" ] && echo "  ⚠️ Table differences detected" || echo "  ✅ Tables validated"
[ -s "$VALIDATION_DIR/policy_diff.txt" ] && echo "  ⚠️ Policy differences detected" || echo "  ✅ Policies validated"  
[ -s "$VALIDATION_DIR/function_diff.txt" ] && echo "  ⚠️ Function differences detected" || echo "  ✅ Functions validated"
echo "  📊 Data counts compared"
echo ""