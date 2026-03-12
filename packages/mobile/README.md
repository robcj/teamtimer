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
