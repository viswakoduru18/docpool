# 🔐 GitHub Setup & Authorization Guide

## Overview

To push your DocPool code to GitHub and enable automated APK builds, you need to authorize GitHub access.

---

## Method 1: Use Sandbox GitHub Integration (Easiest) ⭐

### Steps:

1. **Look for the GitHub panel** in your sandbox interface
   - Check the left sidebar or settings
   - Look for "GitHub", "Integrations", or "Connections"

2. **Click "Connect GitHub" or "Authorize"**

3. **Follow the OAuth flow:**
   - You'll be redirected to GitHub
   - Click "Authorize" to grant access
   - Return to the sandbox

4. **Verify connection:**
   - Should show "Connected" or similar
   - Green checkmark or success message

5. **You're done!** You can now push to GitHub

---

## Method 2: Manual Setup with Personal Access Token

If you don't see a GitHub integration panel, set up manually:

### Step 1: Create GitHub Personal Access Token

1. **Go to:** https://github.com/settings/tokens

2. **Click:** "Generate new token" → "Generate new token (classic)"

3. **Configure token:**
   ```
   Note: DocPool Deployment
   Expiration: 90 days (or No expiration)
   
   Scopes (check these boxes):
   ✅ repo (Full control of repositories)
   ✅ workflow (Update workflows)
   ✅ write:packages (Upload packages)
   ```

4. **Click:** "Generate token" (green button at bottom)

5. **Copy the token:**
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **IMPORTANT:** Save this somewhere safe! You won't see it again.

### Step 2: Configure Git in Sandbox

Run these commands in the sandbox terminal:

```bash
# Set your GitHub username
git config --global user.name "YourGitHubUsername"

# Set your GitHub email
git config --global user.email "your.email@example.com"

# Enable credential storage
git config --global credential.helper store
```

### Step 3: Create GitHub Repository

1. **Go to:** https://github.com/new

2. **Fill in:**
   ```
   Repository name: docpool
   Description: DocPool - Doctor Information Management System
   Visibility: Private (or Public)
   ```

3. **Click:** "Create repository"

4. **Copy the repository URL:**
   ```
   https://github.com/YOUR_USERNAME/docpool.git
   ```

### Step 4: Connect Local Repo to GitHub

```bash
cd /home/user/webapp

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/docpool.git

# Push code (will ask for credentials)
git push -u origin main
```

When prompted:
- **Username:** Your GitHub username
- **Password:** Paste your Personal Access Token (NOT your GitHub password!)

---

## Method 3: Use SSH Keys (Advanced)

### Step 1: Generate SSH Key

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Press Enter to accept default location
# Press Enter twice to skip passphrase (or set one)

# Display public key
cat ~/.ssh/id_ed25519.pub
```

### Step 2: Add SSH Key to GitHub

1. **Copy the output** from the cat command (starts with `ssh-ed25519`)

2. **Go to:** https://github.com/settings/keys

3. **Click:** "New SSH key"

4. **Fill in:**
   ```
   Title: DocPool Sandbox
   Key: (paste the public key)
   ```

5. **Click:** "Add SSH key"

### Step 3: Test SSH Connection

```bash
ssh -T git@github.com
```

Should see: "Hi username! You've successfully authenticated..."

### Step 4: Use SSH URL

```bash
cd /home/user/webapp
git remote add origin git@github.com:YOUR_USERNAME/docpool.git
git push -u origin main
```

---

## After Authorization: Push Your Code

Once GitHub is authorized, push your code:

```bash
cd /home/user/webapp

# Check current remote (if any)
git remote -v

# If no remote, add one:
git remote add origin https://github.com/YOUR_USERNAME/docpool.git
# OR with SSH:
git remote add origin git@github.com:YOUR_USERNAME/docpool.git

# Push code
git push -u origin main
```

---

## Automated APK Builds

Once code is pushed, GitHub Actions will automatically:

1. ✅ Build the Android APK
2. ✅ Create a release
3. ✅ Upload the APK as artifact

### View Build Status:

1. Go to your GitHub repository
2. Click "Actions" tab
3. See workflow progress

### Download APK:

**Option A: From Artifacts**
1. Click on completed workflow run
2. Scroll to "Artifacts"
3. Download `docpool-debug.apk`

**Option B: From Releases**
1. Click "Releases" (right sidebar)
2. Download the APK from latest release

---

## Troubleshooting

### "Authentication failed"
**Solution:** Make sure you're using the Personal Access Token as password, not your GitHub password.

### "Repository not found"
**Solution:** 
1. Verify the repository exists on GitHub
2. Check the remote URL: `git remote -v`
3. Make sure you have access to the repository

### "Permission denied (publickey)"
**Solution:** 
1. Check SSH key is added to GitHub
2. Test: `ssh -T git@github.com`
3. Or use HTTPS instead of SSH

### "failed to push some refs"
**Solution:**
```bash
# Pull first
git pull origin main --rebase

# Then push
git push origin main
```

---

## Quick Reference

### Common Git Commands

```bash
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull from GitHub
git pull origin main

# View remote URLs
git remote -v

# Change remote URL
git remote set-url origin NEW_URL
```

---

## Summary

**Easiest method:** Use the sandbox GitHub integration panel (if available)

**Manual method:** Create Personal Access Token and use HTTPS

**Advanced method:** Set up SSH keys

**After setup:** Push code and get automated APK builds!

---

## Need Help?

**Check if GitHub is connected:**
```bash
git remote -v
git config --global user.name
git config --global user.email
```

**Test authentication:**
```bash
# For HTTPS:
git ls-remote https://github.com/YOUR_USERNAME/docpool.git

# For SSH:
ssh -T git@github.com
```

If you see your username, you're connected!

---

## Next Steps After Authorization

1. ✅ Push code to GitHub
2. ✅ Wait for GitHub Actions to build APK (10-15 minutes)
3. ✅ Download APK from Actions or Releases
4. ✅ Install on your Android phone
5. ✅ Start using DocPool!

---

**Note:** For the PWA, you don't need GitHub at all - just install directly from Chrome as explained earlier!
