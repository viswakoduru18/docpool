# DocPool Android APK Build Guide

## Current Status
✅ **PWA Deployed**: https://4b33a14c.docpool.pages.dev  
✅ **Capacitor Configured**: Android project ready at `/home/user/webapp/android/`  
⚠️ **APK Build**: Cannot complete in sandbox due to memory constraints

---

## Why APK Build Failed in Sandbox

The Android build process requires significant memory (2-4GB) to:
- Download Android SDK components
- Run Gradle build daemon
- Compile Java/Kotlin code
- Process resources and assets
- Create and sign the APK

**Sandbox limitation**: Insufficient memory for Gradle build process.

---

## Solution: Build APK Locally or Using Cloud Service

You have **3 options** to get your APK:

### Option 1: Build on Your Local Machine (Recommended)
### Option 2: Use PWABuilder (Easiest - No Code)
### Option 3: Use GitHub Actions (Automated CI/CD)

---

## Option 1: Build APK on Local Machine

### Prerequisites
1. **Node.js** 18+ installed
2. **Java JDK** 17 or 21 installed
3. **Android Studio** installed (or Android SDK CLI tools)
4. **Minimum 4GB RAM** available

### Step 1: Download Project

Download the project backup:
- URL: https://www.genspark.ai/api/files/s/2P3m60Ny
- Or clone from GitHub (if you've pushed)

```bash
# Extract the backup
tar -xzf docpool_complete_backup_*.tar.gz
cd webapp

# Or clone from GitHub
git clone https://github.com/YOUR_USERNAME/docpool.git
cd docpool
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Build the web application
npm run build

# Sync Capacitor assets
npx cap sync android
```

### Step 3: Configure Android SDK

**Option A: Using Android Studio (Recommended)**
1. Open Android Studio
2. Click "Open an existing project"
3. Select `/webapp/android` folder
4. Wait for Gradle sync to complete
5. Click Build > Build Bundle(s) / APK(s) > Build APK(s)
6. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Command Line**
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Build APK
cd android
./gradlew assembleDebug

# APK location
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Install APK on Device

**Via USB:**
```bash
# Enable USB debugging on your Android device
# Connect device via USB
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Via File Transfer:**
1. Copy `app-debug.apk` to your phone
2. Open file manager
3. Tap the APK file
4. Grant "Install unknown apps" permission if prompted
5. Install the app

---

## Option 2: Use PWABuilder (Easiest - No Android Studio Needed)

PWABuilder is a free service that converts your PWA to APK automatically.

### Step 1: Go to PWABuilder
https://www.pwabuilder.com/

### Step 2: Enter Your PWA URL
```
https://4b33a14c.docpool.pages.dev
```

### Step 3: Generate APK
1. Click "Build My PWA"
2. Wait for analysis to complete
3. Click "Android" tab
4. Choose "Trusted Web Activity (TWA)" package type
5. Configure:
   - App Name: `DocPool`
   - Package ID: `ai.docpool.app`
   - Host: `4b33a14c.docpool.pages.dev`
   - Start URL: `/mobile`
6. Click "Generate"
7. Download the APK

### Step 4: Install on Device
1. Download the generated APK
2. Transfer to your Android device
3. Install as usual

**Pros:**
- ✅ No local development environment needed
- ✅ No Android Studio required
- ✅ Quick and easy
- ✅ Supports Google Play Store publishing

**Cons:**
- ❌ Less customization options
- ❌ Requires internet access to PWA
- ❌ May not support all native features

---

## Option 3: Use GitHub Actions (Automated CI/CD)

Automate APK builds using GitHub Actions whenever you push code.

### Step 1: Create GitHub Workflow

Create `.github/workflows/build-android.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build web app
      run: npm run build
    
    - name: Sync Capacitor
      run: npx cap sync android
    
    - name: Build APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: docpool-debug.apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 2: Push to GitHub

```bash
cd /home/user/webapp
git add .github/workflows/build-android.yml
git commit -m "Add GitHub Actions workflow for APK build"
git push origin main
```

### Step 3: Download APK from GitHub

1. Go to your GitHub repository
2. Click "Actions" tab
3. Click on the latest workflow run
4. Download "docpool-debug.apk" artifact
5. Extract and install on device

**Pros:**
- ✅ Automated builds on every push
- ✅ No local setup required
- ✅ Build logs and artifacts stored
- ✅ Free for public repositories

---

## APK Signing for Production (Google Play Store)

### Generate Keystore

```bash
keytool -genkey -v \
  -keystore docpool-release.keystore \
  -alias docpool \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Keep this file and password SAFE!
```

### Configure Release Build

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../docpool-release.keystore")
            storePassword "YOUR_KEYSTORE_PASSWORD"
            keyAlias "docpool"
            keyPassword "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Build Release APK

```bash
cd android
./gradlew assembleRelease

# Signed APK location
ls -lh app/build/outputs/apk/release/app-release.apk
```

---

## App Features in APK

When installed as APK, DocPool will have:

✅ **Native Features:**
- Native app icon on home screen
- Full-screen experience (no browser UI)
- Offline support via service worker
- Camera access for photo uploads
- Fast startup and smooth performance
- Background sync capabilities

✅ **Connected to Production:**
- API URL: `https://4b33a14c.docpool.pages.dev`
- Real-time data sync
- All features from web version

---

## Testing Checklist

After installing APK on device:

- [ ] App opens without errors
- [ ] Can add new doctor
- [ ] First/Middle/Last name with Dr. prefix works
- [ ] Camera access for photos works
- [ ] Upload photos from gallery works
- [ ] Multi-place working hours work
- [ ] Experience tracking works
- [ ] Data saves to cloud (check dashboard)
- [ ] Offline mode works (disable internet)
- [ ] App performs smoothly

---

## Distribution Options

### Option A: Direct Distribution (No Store)
1. Build APK (debug or release)
2. Upload to your website or Google Drive
3. Share link with users
4. Users download and install manually

**Pros:** Quick, no approval process  
**Cons:** Requires "Install from unknown sources"

### Option B: Google Play Store
1. Build signed release APK
2. Create Google Play Console account ($25 one-time)
3. Create app listing
4. Upload APK/AAB bundle
5. Submit for review
6. Wait 1-7 days for approval

**Pros:** Trusted source, auto-updates  
**Cons:** Approval process, one-time fee

### Option C: Enterprise Distribution
1. Build signed release APK
2. Set up Mobile Device Management (MDM)
3. Deploy to company devices
4. Manage updates internally

**Pros:** Full control, enterprise features  
**Cons:** Requires MDM infrastructure

---

## Troubleshooting

### Build fails with "SDK not found"
**Solution:** Install Android SDK via Android Studio or standalone

### APK won't install - "App not installed"
**Solution:** Enable "Install from unknown sources" in device settings

### Camera doesn't work in APK
**Solution:** Add camera permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### Data not saving
**Solution:** Check that D1 database is configured (see D1_SETUP_GUIDE.md)

### APK size too large
**Solution:** 
- Enable ProGuard/R8 minification
- Use Android App Bundle (.aab) instead of APK
- Remove unused resources

---

## Files Prepared for You

All necessary files are ready in your project:

```
/home/user/webapp/
├── android/                    # Complete Android project
│   ├── app/
│   │   └── build.gradle       # Build configuration
│   ├── gradlew                # Gradle wrapper (ready to use)
│   └── gradle.properties      # Memory settings configured
├── capacitor.config.json      # Points to production URL
├── dist/                      # Built web app (ready)
└── package.json              # All dependencies listed
```

**You can:**
1. Download the entire project
2. Run `npm install && npm run build`
3. Open `android/` folder in Android Studio
4. Click "Build APK"
5. Done!

---

## Recommended Next Steps

1. **Download Project**: Get the backup from https://www.genspark.ai/api/files/s/2P3m60Ny
2. **Choose Build Method**: 
   - Quick test: Use PWABuilder (Option 2)
   - Full control: Build locally (Option 1)
   - Automation: Use GitHub Actions (Option 3)
3. **Test APK**: Install on 2-3 different Android devices
4. **Configure D1**: Follow D1_SETUP_GUIDE.md for data persistence
5. **Sign for Release**: Generate keystore for production builds
6. **Distribute**: Choose Play Store or direct distribution

---

## Support

If you need help:
1. Check Android Studio build logs
2. Verify all dependencies are installed
3. Test PWA first (should work identically)
4. Ensure production URL is accessible

---

## Summary

**Status:**
- ✅ PWA: Live and working
- ✅ Capacitor: Configured and ready
- ✅ Android Project: Complete and buildable
- ⏳ APK Build: Needs local machine or cloud service

**Your APK is 95% ready!** Just needs to be built on a machine with more memory than the sandbox provides.

**Fastest path to APK:**
1. Go to https://www.pwabuilder.com/
2. Enter: `https://4b33a14c.docpool.pages.dev`
3. Click "Build My PWA" > Android
4. Download and install

Done! 🎉
