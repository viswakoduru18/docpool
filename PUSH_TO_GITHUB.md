# 🚀 Push DocPool to GitHub - Quick Guide

You've already run the commands to set up the remote. Now you need to authenticate.

---

## Current Status

✅ Git repository initialized  
✅ GitHub remote added: `https://github.com/viswakoduru18/docpool.git`  
✅ Branch renamed to `main`  
⏳ Ready to push (authentication needed)

---

## Quick Authentication Methods

### Method 1: Use GitHub Authorization in Sandbox Interface ⭐ EASIEST

**Look for a GitHub tab/panel in your interface:**

1. Find "GitHub", "Integrations", or "Connections" panel
2. Click "Connect GitHub" or "Authorize"
3. Follow OAuth flow to GitHub
4. Return to sandbox
5. Run: `git push -u origin main`

**If you see a GitHub panel, this is the fastest way!**

---

### Method 2: Use Personal Access Token (5 Minutes)

**If no GitHub panel exists, follow these steps:**

#### Step 1: Create Personal Access Token

1. **Go to:** https://github.com/settings/tokens

2. **Click:** "Generate new token" → "Generate new token (classic)"

3. **Fill in:**
   ```
   Note: DocPool Sandbox
   Expiration: 90 days
   
   Scopes (select these):
   ✅ repo (Full control of private repositories)
   ✅ workflow (Update GitHub Action workflows)
   ```

4. **Click:** "Generate token" (scroll down, green button)

5. **COPY THE TOKEN** - It looks like:
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **IMPORTANT:** Save this! You won't see it again!

#### Step 2: Configure Git Credential Helper

Run this command in the sandbox:

```bash
cd /home/user/webapp
git config --global credential.helper store
```

This tells git to remember your credentials.

#### Step 3: Push with Token

Run the push command:

```bash
cd /home/user/webapp
git push -u origin main
```

You'll be prompted:
```
Username for 'https://github.com': viswakoduru18
Password for 'https://viswakoduru18@github.com': 
```

**Enter:**
- **Username:** `viswakoduru18`
- **Password:** **Paste your token** (NOT your GitHub password!)

The push will then complete!

---

## After Successful Push

Once the push succeeds, **GitHub Actions will automatically:**

1. ✅ Detect the push
2. ✅ Start building Android APK (takes 10-15 minutes)
3. ✅ Create a release with the APK
4. ✅ Make it available for download

### Where to Find Your APK:

**Option 1: GitHub Actions Artifacts**
1. Go to: https://github.com/viswakoduru18/docpool
2. Click "Actions" tab
3. Click on the workflow run (should be in progress)
4. Wait for it to complete (green checkmark)
5. Scroll to "Artifacts" section
6. Download `docpool-debug.apk`
7. Extract the .zip file
8. You'll get `app-debug.apk`

**Option 2: GitHub Releases**
1. Go to: https://github.com/viswakoduru18/docpool
2. Click "Releases" (right sidebar)
3. Download the APK from the latest release

---

## Installation on Phone

Once you have the APK:

1. **Transfer to phone:**
   - Email it to yourself
   - Use USB cable
   - Upload to Google Drive

2. **Enable installation:**
   - Settings → Security → Install unknown apps
   - Enable for your file manager

3. **Install:**
   - Open file manager
   - Tap `app-debug.apk`
   - Tap "Install"
   - Open the app!

---

## Alternative: Install PWA Now (No Wait!)

**While GitHub Actions builds the APK, use the PWA:**

On your Android phone:
1. Open Chrome
2. Go to: `https://82b573f6.docpool.pages.dev/mobile`
3. Menu (⋮) → "Install app"
4. Done!

**The PWA works immediately** while you wait for the APK build.

---

## Troubleshooting

### "Authentication failed"
- Make sure you're using the **Personal Access Token** as password
- NOT your GitHub account password

### "Repository not found"
- Verify the repo exists: https://github.com/viswakoduru18/docpool
- Check if it's public or if you have access

### "Permission denied"
- Token needs `repo` scope
- Recreate token with correct permissions

### Push takes too long
- Network might be slow
- Try again in a few minutes

---

## Quick Commands Reference

```bash
# Check remote is set
git remote -v

# Check current branch
git branch

# Push to GitHub
git push -u origin main

# Check push status
git status

# View commit history
git log --oneline -5
```

---

## Summary

**To complete the push:**

1. Create Personal Access Token at https://github.com/settings/tokens
2. Run: `git config --global credential.helper store`
3. Run: `git push -u origin main`
4. Enter username: `viswakoduru18`
5. Enter password: Paste your token
6. Wait for GitHub Actions to build APK (10-15 min)
7. Download APK from Actions or Releases
8. Install on phone!

**Or just use the PWA immediately:**
- Chrome → https://82b573f6.docpool.pages.dev/mobile → Install

---

**Need the token? Go to:** https://github.com/settings/tokens

**Questions?** Check `GITHUB_SETUP.md` for detailed instructions.
