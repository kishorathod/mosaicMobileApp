# Miss Nova Mobile - Setup Guide

## ✅ Complete Setup Checklist

### Step 1: Install Dependencies (5 minutes)

```bash
cd MissNovaMobile
npm install
```

**Expected output:** All packages installed successfully

---

### Step 2: Install babel-plugin-module-resolver (IMPORTANT!)

```bash
npm install --save-dev babel-plugin-module-resolver
```

This is needed for the `@/` path aliases to work.

---

### Step 3: Firebase Setup (10 minutes)

#### 3.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it "MissNova" or similar
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 3.2 Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Enable it and save

#### 3.3 Add Android App
1. Click "Add app" → Android icon
2. Android package name: `com.missnovamobile`
3. Download `google-services.json`
4. Place it in: `MissNovaMobile/android/app/google-services.json`

#### 3.4 Add iOS App (Mac only)
1. Click "Add app" → iOS icon
2. iOS bundle ID: `org.reactjs.native.example.MissNovaMobile`
3. Download `GoogleService-Info.plist`
4. Place it in: `MissNovaMobile/ios/MissNovaMobile/GoogleService-Info.plist`

---

### Step 4: Configure Backend URL (2 minutes)

Open `src/api/client.ts` and update:

```typescript
// For Android Emulator:
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// For iOS Simulator:
const API_BASE_URL = 'http://localhost:3000/api';

// For Physical Device (replace with your computer's IP):
const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
```

**To find your IP:**
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` (look for inet)

---

### Step 5: Start Backend Server (2 minutes)

In a separate terminal:

```bash
cd mosaic-hackathon-main
npm run dev
```

**Verify:** Open http://localhost:3000 in browser

---

### Step 6: Run the Mobile App (5 minutes)

#### For Android:

```bash
cd MissNovaMobile
npm run android
```

**First time will take 5-10 minutes to build!**

#### For iOS (Mac only):

```bash
cd MissNovaMobile
cd ios
pod install
cd ..
npm run ios
```

---

## 🎯 Quick Test

Once the app is running:

1. **Register:** Create a new account
2. **Login:** Sign in with your credentials
3. **Generate Course:** Type "Introduction to React Native"
4. **View Course:** See the slides
5. **Complete Quiz:** Answer the questions

---

## 🐛 Common Issues & Fixes

### Issue: "Unable to resolve module @/..."

**Fix:**
```bash
npm install --save-dev babel-plugin-module-resolver
npm start -- --reset-cache
```

### Issue: Firebase not working

**Fix:**
1. Verify `google-services.json` is in `android/app/`
2. Rebuild the app:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: "Network request failed"

**Fix:**
1. Make sure backend is running on port 3000
2. Check API_BASE_URL in `src/api/client.ts`
3. For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue: Metro bundler won't start

**Fix:**
```bash
# Kill all node processes
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
killall node

# Restart
npm start
```

### Issue: Android build fails

**Fix:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## 📱 Testing on Physical Device

### Android:
1. Enable Developer Options on your phone
2. Enable USB Debugging
3. Connect phone via USB
4. Run: `npm run android`

### iOS (Mac only):
1. Open `ios/MissNovaMobile.xcworkspace` in Xcode
2. Select your device
3. Click Run

---

## ✨ You're Ready!

Your app should now be running! 🎉

**Next steps:**
1. Test all features
2. Customize the UI
3. Add more functionality
4. Deploy to app stores

---

## 🆘 Still Having Issues?

1. Clear everything and start fresh:
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

2. Check that all files are in the right place:
```
MissNovaMobile/
├── android/app/google-services.json ✅
├── src/api/client.ts (with correct URL) ✅
└── package.json ✅
```

3. Verify backend is running:
```bash
curl http://localhost:3000/api/health
```

---

Good luck! 🚀
