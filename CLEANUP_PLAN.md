# 🧹 Cleanup Script for Shatam Care Foundation Project

## Files to Remove (Unused/Duplicate/Temporary)

### SQL Files (Keep only the working one)
- cleanup_and_setup.sql ❌ (superseded)
- create_tables.sql ❌ (superseded) 
- disable_rls.sql ❌ (temporary fix)
- enhanced_security.sql ❌ (had errors)
- fix_data_constraints.sql ❌ (one-time use)
- fresh_start.sql ❌ (superseded)
- simple_tables.sql ❌ (superseded)
- ultimate_fresh_start.sql ❌ (superseded)
- ✅ KEEP: enhanced_security_safe.sql (final working version)

### Component Files (Remove duplicates/unused)
- AdminDashboard.enhanced.tsx ❌ (enhanced version, not used)
- ContactForm.enhanced.tsx ❌ (enhanced version, not used)
- ContactForm.new.tsx ❌ (duplicate)
- NewsletterSignup.new.tsx ❌ (duplicate)
- SupabaseDiagnostic.tsx ❌ (debug only)
- PerformanceMonitor.tsx ❌ (debug only)
- BlurImage.tsx ❌ (not used)
- ✅ KEEP: Current working versions

### Sample/Test Files
- sample_data.sql ❌ (not needed)
- insert_events.sql ❌ (not used)

### Documentation (Keep essential only)
- SETUP_GUIDE.md ❌ (superseded by README)
- ✅ KEEP: README.md, PROJECT_SUMMARY.md, SECURITY.md

### Backend Directory
- backend/ ❌ (not used, frontend-only project)

### Build Files (Auto-generated)
- tsconfig.app.tsbuildinfo ❌
- tsconfig.node.tsbuildinfo ❌

### Lock Files (Keep only one)
- bun.lockb ❌ (using npm)
- ✅ KEEP: package-lock.json

## Files to Keep (Essential)

### Core Application Files
✅ src/ (entire directory)
✅ public/ (entire directory)  
✅ package.json
✅ package-lock.json
✅ vite.config.ts
✅ tailwind.config.ts
✅ postcss.config.js
✅ tsconfig.json
✅ tsconfig.app.json
✅ tsconfig.node.json
✅ eslint.config.js
✅ components.json
✅ index.html

### Environment & Config
✅ .env
✅ .env.example
✅ .gitignore
✅ .github/ (deployment)
✅ .vscode/ (editor config)

### Documentation
✅ README.md
✅ PROJECT_SUMMARY.md  
✅ SECURITY.md
✅ enhanced_security_safe.sql

### Deployment
✅ deploy.sh
✅ dist/ (build output)
