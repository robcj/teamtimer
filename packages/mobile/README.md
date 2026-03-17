# @team-timer/mobile

Capacitor wrapper for building Team Timer as a mobile app (Android/iOS).

## Prerequisites

- Node.js and npm
- Android Studio (for Android)
- Xcode on macOS (for iOS)

## Commands

- `npm run build:web`: Build the web app from `packages/web`
- `npm run sync:web`: Copy web build to `packages/mobile/www`
- `npm run build`: Build and sync web assets into this mobile package
- `npm run cap:sync`: Build/sync and run `capacitor sync`
- `npm run cap:add:android`: Add Android native project
- `npm run cap:add:ios`: Add iOS native project
- `npm run cap:open:android`: Open Android project in Android Studio
- `npm run cap:open:ios`: Open iOS project in Xcode

## First-time setup

1. Install monorepo dependencies from repository root:

```bash
npm install
```

2. Build and sync mobile assets:

```bash
npm run cap:sync -w @team-timer/mobile
```

3. Add native platform(s):

```bash
npm run cap:add:android -w @team-timer/mobile
# and/or
npm run cap:add:ios -w @team-timer/mobile
```

4. Open platform project:

```bash
npm run cap:open:android -w @team-timer/mobile
# and/or
npm run cap:open:ios -w @team-timer/mobile
```

## Hybrid development setup with Android Studio on windows and the code in WSL

In PowerShell ensure all adb processes are stopped:

```powershell
taskkill /F /IM adb.exe
netstat -ano | findstr 5037
```

Start adb on Windows:

```powershell
adb -a -P 5037 nodaemon server
```

In WSL, add this line to ~/.bashrc, with your Windows host's IP address (use ipconfig in PowerShell to find it):

```bash
export ADB_SERVER_SOCKET=tcp:<windows host IP address>:5037
```

run:

```bash
adb kill-server
adb devices
```

## Single-emulator troubleshooting (WSL + Windows host)

If the app icon appears but does not open, verify that WSL and Android Studio are both talking to the same ADB server/device.

1. Stop all emulators in Android Studio Device Manager.
2. In PowerShell, restart Windows adb on port `5037`:

```powershell
taskkill /F /IM adb.exe
adb -a -P 5037 nodaemon server
adb devices -l
```

3. Start exactly one emulator (Cold Boot if needed).
4. In WSL, confirm the same port/device and avoid offline duplicates:

```bash
export ADB_SERVER_SOCKET=tcp:<windows host IP address>:5037
adb devices -l
```

5. Reinstall and launch explicitly against the emulator serial:

```bash
npm run cap:sync -w @team-timer/mobile
cd packages/mobile/android
./gradlew clean assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell monkey -p com.teamtimer.app -c android.intent.category.LAUNCHER 1
adb -s emulator-5554 shell monkey -p com.teamtimer.app -c android.intent.category.LAUNCHER 1
```

## Compiling the APK

In Windows start Android Studio, click the Device Manager button on the right hand side to start an emulator.

In WSL run `adb devices` and it should list the emulator device.

build in VSCode/WSL, use Android Studio mainly to run/manage the emulator.

For your setup (code in WSL, emulator on Windows), the clean workflow is:

From repo root, sync web assets into mobile:
`npm run cap:sync -w @team-timer/mobile`

Build debug APK in WSL:

```bash
cd packages/mobile/android
./gradlew assembleDebug
```

APK output:
packages/mobile/android/app/build/outputs/apk/debug/app-debug.apk

Install to running emulator from WSL:

```bash
adb devices
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Which environment should compile?

Preferred: VSCode/WSL (repeatable, scriptable, same environment as your code).
Android Studio compile is also fine, but mostly useful for emulator UI, Logcat, and release/signing workflows.
Important for your Windows-host emulator bridge:

Keep ADB port consistent (usually 5037) between Windows ADB and WSL ADB_SERVER_SOCKET.
If devices do not appear in WSL, restart ADB on both sides and re-run adb devices.

## Production Android build (signed)

From repo root, sync web assets first:

```bash
cd /home/robincj/git_repos/TeamTimer
npm run cap:sync -w @team-timer/mobile
```

Create a release keystore (one time):

```bash
keytool -genkeypair -v \
	-keystore ~/teamtimer-release.keystore \
	-alias teamtimer \
	-keyalg RSA \
	-keysize 2048 \
	-validity 10000
```

Store signing values in your user Gradle properties (`~/.gradle/gradle.properties`) so secrets are not committed:

```properties
TEAMTIMER_UPLOAD_STORE_FILE=/home/<your-user>/teamtimer-release.keystore
TEAMTIMER_UPLOAD_STORE_PASSWORD=<keystore-password>
TEAMTIMER_UPLOAD_KEY_ALIAS=teamtimer
TEAMTIMER_UPLOAD_KEY_PASSWORD=<key-password>
```

e.g.
TEAMTIMER_UPLOAD_STORE_FILE=/home/robincj/git_repos/TeamTimer/packages/mobile/android/teamtimer-release.keystore

Build signed release artifacts:

```bash
cd /home/robincj/git_repos/TeamTimer/packages/mobile/android
./gradlew clean assembleRelease bundleRelease
```

Outputs:

- APK: `packages/mobile/android/app/build/outputs/apk/release/app-release.apk`
- AAB: `packages/mobile/android/app/build/outputs/bundle/release/app-release.aab`

If signing vars are missing, Gradle will still build release artifacts but they will be unsigned.

## Publishing the Android APK from the web app

The web build can copy a signed Android APK into the web output automatically.

Default source APK path:

- `packages/mobile/android/app/build/outputs/apk/release/app-release.apk`

Default web output path:

- `packages/web/dist/downloads/team-timer.apk`

Workflow:

```bash
cd /home/robincj/git_repos/TeamTimer/packages/mobile/android
./gradlew clean assembleRelease

cd /home/robincj/git_repos/TeamTimer
npm run build -w @team-timer/web
```

If your release APK is in a different location, override the source path when building the web app:

```bash
cd /home/robincj/git_repos/TeamTimer
TEAMTIMER_ANDROID_APK_PATH=/absolute/path/to/your/app-release.apk npm run build -w @team-timer/web
```

That keeps the menu link stable at `downloads/team-timer.apk` while letting you choose a different release artifact when needed.
