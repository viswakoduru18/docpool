# D1 Database Setup Guide for DocPool

## Current Status
✅ **PWA Deployed**: https://4b33a14c.docpool.pages.dev  
⚠️ **Database**: Not yet configured (app is running without persistent storage)

## Why You Need D1
Currently, the app is deployed but **data is not being saved** because the D1 database is not connected. Follow these steps to enable data persistence.

---

## Step-by-Step D1 Setup

### 1. Create D1 Database via Cloudflare Dashboard

**Option A: Via Dashboard (Recommended)**
1. Go to https://dash.cloudflare.com
2. Login with: `viswa.koduru18@gmail.com`
3. Click on **"Workers & Pages"** in the left sidebar
4. Click on **"D1 SQL Database"**
5. Click **"Create database"**
6. Enter database name: `docpool-production`
7. Click **"Create"**
8. **Copy the Database ID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Option B: Via API Token (if you update permissions)**
```bash
# Update your API token at: https://dash.cloudflare.com/profile/api-tokens
# Add permission: "D1:Edit"
# Then run:
cd /home/user/webapp
npx wrangler d1 create docpool-production
```

### 2. Update wrangler.jsonc

Edit `/home/user/webapp/wrangler.jsonc` and add the D1 configuration:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "docpool",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "docpool-production",
      "database_id": "PASTE_YOUR_DATABASE_ID_HERE"
    }
  ]
}
```

Replace `PASTE_YOUR_DATABASE_ID_HERE` with the Database ID you copied.

### 3. Apply Database Migrations

Run these commands to create all tables:

```bash
cd /home/user/webapp

# Apply all 4 migrations to production database
npx wrangler d1 migrations apply docpool-production --remote

# Verify tables were created
npx wrangler d1 execute docpool-production --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 4. Bind D1 to Your Pages Project

**Via Dashboard:**
1. Go to https://dash.cloudflare.com
2. Click **"Workers & Pages"**
3. Click on **"docpool"** project
4. Click **"Settings"** tab
5. Click **"Functions"**
6. Scroll to **"D1 database bindings"**
7. Click **"Add binding"**
   - Variable name: `DB`
   - D1 database: Select `docpool-production`
8. Click **"Save"**

**Via Command Line (alternative):**
```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name docpool --d1=docpool-production
```

### 5. Redeploy Your Application

After configuring D1:

```bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name docpool --commit-dirty=true
```

### 6. Verify Database Connection

Test that data is being saved:

```bash
# Add a test doctor via API
curl -X POST https://4b33a14c.docpool.pages.dev/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "Doctor",
    "mobile_number": "+91 9876543210",
    "email": "test@example.com",
    "specialization": "General Medicine"
  }'

# Check if doctor was saved
curl https://4b33a14c.docpool.pages.dev/api/doctors

# Check stats
curl https://4b33a14c.docpool.pages.dev/api/stats
```

---

## Migrations Already Prepared

Your project has 4 migrations ready in `/home/user/webapp/migrations/`:

1. **0001_initial_schema.sql** - Core doctor information tables
2. **0002_add_name_fields.sql** - First/Middle/Last name fields
3. **0003_add_enhanced_fields.sql** - Photos, working places, OP strength
4. **0004_add_experience_history.sql** - Work experience tracking

All migrations will be applied automatically when you run:
```bash
npx wrangler d1 migrations apply docpool-production --remote
```

---

## Troubleshooting

### Problem: "Authentication error [code: 10000]"
**Solution**: Your API token doesn't have D1 permissions. Use Dashboard method (Option A) instead.

### Problem: "Invalid database UUID"
**Solution**: Make sure you updated `wrangler.jsonc` with the correct `database_id` from step 1.

### Problem: "Binding not found"
**Solution**: Make sure you added the D1 binding in Pages project settings (step 4).

### Problem: API returns empty data
**Solution**: 
1. Check that migrations were applied: `npx wrangler d1 execute docpool-production --remote --command="SELECT * FROM doctors LIMIT 1;"`
2. Check that binding is configured in Pages settings
3. Redeploy after configuring binding

---

## Quick Setup Checklist

- [ ] Create D1 database `docpool-production` via Dashboard
- [ ] Copy Database ID
- [ ] Update `wrangler.jsonc` with Database ID
- [ ] Run migrations: `npx wrangler d1 migrations apply docpool-production --remote`
- [ ] Add D1 binding in Pages project settings (Variable: `DB`)
- [ ] Rebuild and redeploy: `npm run build && npx wrangler pages deploy dist --project-name docpool`
- [ ] Test API endpoints to verify data persistence

---

## Next Steps After D1 Setup

Once D1 is configured and working:

1. ✅ PWA is fully functional with data persistence
2. 🔄 Move to **Android APK creation** (Capacitor setup)
3. 📱 Test on real Android devices
4. 🚀 Distribute APK or publish to Play Store

---

## Support

If you encounter issues:
1. Check the Cloudflare Dashboard logs
2. Use `npx wrangler pages deployment tail` to see live logs
3. Verify all steps in the checklist above
