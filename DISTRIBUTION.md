# 📦 Miss Nova - App Distribution Guide

This guide explains how to get the Miss Nova mobile app onto testers' phones via a shareable download link using **Firebase App Distribution**.

---

## 🔑 Step 1: Get Your Firebase Token (One-time)

Run this command locally and copy the token:

```bash
npm install -g firebase-tools
firebase login:ci
```

Save the printed token — you will use it in GitHub Secrets.

---

## ⚙️ Step 2: Find Your Firebase Android App ID

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your project → **Project Settings** (gear icon)
3. Scroll to **Your apps** → Select the Android app
4. Copy the **App ID** (looks like `1:1234567890:android:abcdef123456`)

---

## 🔒 Step 3: Add GitHub Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions** → **New repository secret**:

| Secret Name | Value |
|---|---|
| `FIREBASE_TOKEN` | The token from Step 1 |
| `FIREBASE_ANDROID_APP_ID` | The App ID from Step 2 |

---

## 👥 Step 4: Add Testers in Firebase

1. In Firebase Console → **App Distribution**
2. Click **Get Started** (if first time)
3. Click the **Testers & Groups** tab
4. Create a group called `testers`
5. Add tester email addresses

---

## 🚀 Step 5: Trigger a Build

Simply push code to `main`:

```bash
git add .
git commit -m "feat: trigger distribution build"
git push origin main
```

GitHub Actions will automatically:
1. Build the Android APK
2. Upload it to Firebase App Distribution
3. Send email invitations to all testers 🎉

---

## 📱 What Testers See

Testers receive an **email from Firebase** with a single download link.

**Android:**
- Tap the link → Install the Firebase App Distribution app → Download Miss Nova

**iOS (future):**
- Requires Apple Developer Account → Use TestFlight for distribution

---

## 🐛 If the Build Fails

Check **Actions** tab on GitHub for error logs.

Common fixes:
- Check that `google-services.json` is present in `MissNovaMobile/android/app/`
- Ensure all secrets are correctly set in GitHub
