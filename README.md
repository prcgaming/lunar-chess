# 🌙 Lunar Chess: Play & Learn

A production-ready, mobile-first responsive chess application with offline AI, local 2-player mode with dynamic turn clocks, 23 interactive lessons, 2D and 3D piece styles, and Android APK export support.

---

## 📱 How to Build the Android APK

The native Android project is already configured and synced in `LunarChess/android/`.

### Option 1: Using Android Studio (Recommended & Easiest)
1. Download and install [Android Studio](https://developer.android.com/studio) (if not already installed).
2. Open terminal in `LunarChess` and run:
   ```bash
   npx cap open android
   ```
   *(Or launch Android Studio and select **Open** > navigate to `C:\Users\Admin\Desktop\LunarChess\android`)*.
3. Wait for Android Studio to sync Gradle (takes ~1 minute on first open).
4. In the top menu, click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
5. When complete, click the **locate** popup link. Your APK will be located at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
6. Transfer `app-debug.apk` to any Android phone via WhatsApp, Drive, USB, or Bluetooth and tap **Install**!

---

### Option 2: Command Line (Gradle)
If you have the Android SDK installed:
```bash
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
```
The APK will be generated at:
`android\app\build\outputs\apk\debug\app-debug.apk`

---

### Option 3: Free Automatic Cloud Build (Zero Install on PC)
We have configured GitHub Actions in `.github/workflows/build-apk.yml`.
1. Push your `LunarChess` project to a GitHub repository.
2. Go to the **Actions** tab on your GitHub repository.
3. Click **Build Android APK** > **Run workflow**.
4. In ~2 minutes, the workflow finishes and gives you a direct download link for `LunarChess-Android-APK` containing the ready-to-install `.apk` file!