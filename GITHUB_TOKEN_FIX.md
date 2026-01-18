# GitHub Token Fix for DocPool Push

## Problem
Your current GitHub token doesn't have the required permissions to push code to the repository.

Error: `Permission to viswakoduru18/docpool.git denied`

## Solution: Create New Token with Correct Permissions

### Step 1: Create New Personal Access Token

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Click: **"Generate new token"** → **"Generate new token (classic)"**

2. **Configure Token:**
   - **Note:** `DocPool Push Token`
   - **Expiration:** `90 days` (or longer)
   - **Select scopes:** ✅ Check these boxes:
     - ✅ **repo** (Full control of private repositories)
       - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
     - ✅ **workflow** (Update GitHub Action workflows)

3. **Generate and Copy:**
   - Click **"Generate token"** at the bottom
   - **COPY THE TOKEN IMMEDIATELY** (looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ You won't be able to see it again!

### Step 2: Push Code with New Token

Once you have the new token, I'll help you push the code.

Just reply with: **"I have the new token"**

Then I'll guide you through the final push command.

## Alternative: Use PWA Now (No GitHub Needed)

If you want to start using DocPool immediately without waiting for GitHub setup:

### Install PWA on Android (30 seconds):
1. Open **Chrome** on your phone
2. Visit: **https://82b573f6.docpool.pages.dev/mobile**
3. Tap menu (⋮) → **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"**
5. ✅ DocPool icon appears on home screen

The PWA works exactly like an APK:
- ✅ Full-screen app
- ✅ Offline support
- ✅ All 70+ fields
- ✅ Camera access
- ✅ Auto-updates

## Why This Error Happened

Your current token has limited scopes (possibly only `read:user` or similar).
The `repo` scope is required to:
- Push code to repositories
- Create/modify files
- Trigger GitHub Actions

## What Happens After Push

Once the code is pushed with the correct token:
1. GitHub Actions automatically builds the APK (10-15 minutes)
2. Download APK from: https://github.com/viswakoduru18/docpool/actions
3. Or from Releases: https://github.com/viswakoduru18/docpool/releases
4. Install on your phone

## Quick Decision

Choose one path:

**Path A: Fix GitHub Now (5 minutes)**
1. Create new token with `repo` scope
2. Push code
3. Wait for APK build (10-15 min)
4. Install APK

**Path B: Use PWA Now (30 seconds)**
1. Install PWA from Chrome
2. Start using immediately
3. Fix GitHub later for APK

---

**Your Choice:**
- Reply **"I have the new token"** → I'll help you push
- Reply **"Install PWA"** → I'll guide you through PWA install
- Reply **"Both"** → Install PWA now, fix GitHub next

**Need help?** Just ask!
