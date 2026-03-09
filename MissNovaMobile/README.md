# Miss Nova Mobile App

AI-powered learning platform for mobile devices built with React Native.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)
- Firebase account

### Installation

1. **Install dependencies**
```bash
cd MissNovaMobile
npm install
```

2. **Install iOS dependencies (Mac only)**
```bash
cd ios
pod install
cd ..
```

3. **Set up Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Email/Password authentication
   - Download `google-services.json` (Android) and place in `android/app/`
   - Download `GoogleService-Info.plist` (iOS) and place in `ios/MissNovaMobile/`

4. **Configure Backend URL**
   - Open `src/api/client.ts`
   - Update `API_BASE_URL` to point to your Next.js backend
   - For Android emulator: `http://10.0.2.2:3000/api`
   - For iOS simulator: `http://localhost:3000/api`
   - For physical device: Use your computer's IP address

5. **Run the app**

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

## 📁 Project Structure

```
MissNovaMobile/
├── src/
│   ├── api/              # API client and services
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── auth/         # Login, Register
│   │   ├── home/         # Home screen
│   │   └── course/       # Course viewer
│   ├── store/            # Redux store
│   │   └── slices/       # Redux slices
│   └── types/            # TypeScript types
├── android/              # Android native code
├── ios/                  # iOS native code
└── App.tsx               # Root component
```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Email/Password
4. Download configuration files:
   - **Android:** `google-services.json` → `android/app/`
   - **iOS:** `GoogleService-Info.plist` → `ios/MissNovaMobile/`

## 🌐 Backend Configuration

Make sure your Next.js backend is running:

```bash
cd ../mosaic-hackathon-main
npm run dev
```

The backend should be accessible at `http://localhost:3000`

## 📱 Features

- ✅ User Authentication (Firebase)
- ✅ Course Generation with AI
- ✅ Interactive Slide Viewer
- ✅ Quiz System
- ✅ Progress Tracking
- ✅ Markdown Support

## 🛠️ Development

### Clear Cache
```bash
npm start -- --reset-cache
```

### Clean Build (Android)
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Clean Build (iOS)
```bash
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

## 🐛 Troubleshooting

### "Unable to resolve module"
```bash
npm start -- --reset-cache
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
```

### iOS build fails
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Metro bundler issues
```bash
# Kill all node processes
killall node
# Or on Windows:
taskkill /F /IM node.exe

# Restart
npm start
```

## 📝 Next Steps

1. Test authentication flow
2. Generate a test course
3. Complete a quiz
4. Customize the UI theme
5. Add more features!

## 🎯 5-Day Development Plan

Follow the [5-Day Accelerated Plan](../brain/5-day-accelerated-plan.md) for rapid development.

## 📚 Documentation

- [Architecture Guide](../brain/mobile-app-architecture-react-native.md)
- [Implementation Plan](../brain/implementation-plan-react-native.md)
- [Code Review Guide](../brain/code-review-guide-react-native.md)

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section
2. Clear cache and rebuild
3. Check Firebase configuration
4. Verify backend is running

## 📄 License

MIT
