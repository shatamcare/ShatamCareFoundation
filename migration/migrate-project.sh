#!/bin/bash

# Supabase Project Migration Script
# This script helps you migrate your Supabase project to a new account

echo "🚀 Supabase Project Migration Helper"
echo "======================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo ""
echo "📋 Migration Steps:"
echo "1. Export database from current project"
echo "2. Export storage files"
echo "3. Set up new project"
echo "4. Import schema and data"
echo "5. Import storage files"
echo "6. Update environment variables"

echo ""
echo "🔧 Prerequisites:"
echo "- Access to current Supabase project"
echo "- New Supabase project created in target account"
echo "- Both project credentials available"

echo ""
echo "📝 Current Project Details:"
echo "Project ID: uumavtvxuncetfqwlgvp"
echo "URL: https://uumavtvxuncetfqwlgvp.supabase.co"

echo ""
read -p "Press Enter to continue with migration setup..."

# Create migration directory structure
echo "📁 Creating migration directory structure..."
mkdir -p migration/{database,storage,config}

echo "✅ Migration directory structure created!"
echo ""
echo "📋 Next Steps:"
echo "1. Run the database export commands"
echo "2. Download storage files"
echo "3. Configure new project"
echo "4. Run import scripts"

echo ""
echo "💡 Tip: Keep both projects running during migration to ensure zero downtime!"
