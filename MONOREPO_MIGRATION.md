# TeamTimer Monorepo Migration

## ✅ Completed Migration

This repository has been successfully converted to a **npm workspaces monorepo** structure. Changes were completed on **March 7, 2026**.

---

## 📁 New Directory Structure

```
team-timer/
├── packages/
│   ├── core/                          # Shared timer logic & types
│   │   ├── src/
│   │   │   ├── index.ts              # Main export barrel
│   │   │   ├── types.ts              # Type definitions
│   │   │   ├── useGameTimer.ts       # Timer state machine
│   │   │   ├── useGlobalTimerAggregateState.ts
│   │   │   ├── utils/                # Shared utilities
│   │   │   │   ├── phases.ts
│   │   │   │   ├── time.ts
│   │   │   │   ├── gameResults.ts
│   │   │   │   ├── gameSetupResolution.ts
│   │   │   │   ├── expectedStartTimes.ts
│   │   │   │   ├── teams.ts
│   │   │   │   ├── audio.ts
│   │   │   │   └── timerDisplay.ts
│   │   │   └── app/
│   │   │       └── defaultConfig.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                          # Web app (React + Webpack)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── components/           # React components
│   │   │   ├── hooks/                # Web-specific Hooks
│   │   │   ├── styles/               # Shared SCSS
│   │   │   └── index.tsx
│   │   ├── webpack.config.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .babelrc
│   │
│   └── mobile/                       # iOS/Android (Capacitor - future)
│       ├── package.json
│       └── README.md (placeholder)
│
├── package.json                      # Root with workspaces config
├── tsconfig.json                     # Base TypeScript config
└── .git/
```

---

## 🎯 What Was Changed

### 1. **Created `packages/core`**

- Extracted all timer logic, types, and utilities
- Built as standalone npm package (`@team-timer/core`)
- Exports: types, phases, time utils, game results, team management, audio, etc.
- **Note**: Uses `file:../core` dependency in web/mobile packages

### 2. **Moved `packages/web`**

- Contains original `src/` (React components, UI hooks, styles)
- Webpack + Babel configuration
- Depends on `@team-timer/core` for shared logic
- Added `tsconfig.json` extending root config

### 3. **Created `packages/mobile` (Placeholder)**

- Ready for Capacitor-based iOS/Android app
- Will depend on `@team-timer/core`
- Package.json prepared for `@capacitor/core` and plugins

### 4. **Updated Root `package.json`**

- Added `workspaces` array pointing to all packages
- Unified scripts: `npm start`, `npm build`, `npm run build:core`, etc.
- Uses single `node_modules` directory at root (hoisted)

### 5. **Updated TypeScript Configuration**

- Root `tsconfig.json` as base config (no includes)
- Each package extends root config
- `packages/core/` compiles to `dist/` with `.d.ts` declarations

---

## 🚀 How to Use

### **Install Dependencies** (all packages at once)

```bash
npm install
```

### **Start Web Dev Server**

```bash
npm start
```

### **Build Core Package**

```bash
npm run build:core
```

### **Build Web Package**

```bash
npm run build:web
```

### **Full build** (core + web)

```bash
npm run build
```

---

## 📦 Import Changes

### **Before (Relative Paths)**

```typescript
import { TimerConfig, Game } from '../types';
import { useGameTimer } from '../hooks/useGameTimer';
import { DEFAULT_CONFIG } from '../app/defaultConfig';
```

### **After (From @team-timer/core)**

```typescript
import { TimerConfig, Game, useGameTimer, DEFAULT_CONFIG } from '@team-timer/core';
```

All web package imports have been updated to reference `@team-timer/core`.

---

## ✨ Benefits

✅ **Single Source of Truth** for timer logic (core package)  
✅ **Code Reuse** across web and mobile without duplication  
✅ **Clear Separation of Concerns** (core logic vs UI)  
✅ **Easier Testing** - core can be tested in isolation  
✅ **Future-Ready for Mobile** - Capacitor app ready to be built  
✅ **Single CI/CD Pipeline** - test, build, deploy all packages together  
✅ **Unified Dependencies** - one `npm install`, shared node_modules

---

## 🔄 Next Steps (for Mobile)

When ready to build the mobile app:

1. **Install Capacitor**

   ```bash
   npm install --save @capacitor/core @capacitor/ios @capacitor/android
   ```

2. **Build Web to `packages/mobile/www`**

   ```bash
   npm run build:web
   cp -r packages/web/dist packages/mobile/www
   ```

3. **Add Native Platforms**

   ```bash
   npx cap add ios
   npx cap add android
   ```

4. **Add Mobile Plugins** (as needed)
   - Local Notifications
   - Device Keep Awake
   - App Lifecycle

---

## 📝 Git Notes

The migration is committed as a single atomic change. To review:

```bash
git log --oneline | head -5
git show <hash>  # See what was migrated
```

---

## ⚠️ Known Issues

### TypeScript Strict Mode Warnings

Some utility files (e.g., `gameSchedule/utils.ts`) have implicit `any` type parameter warnings. These are non-blocking and can be fixed incrementally:

```typescript
// Before
const myFunc = (location) => { ... }

// After
const myFunc = (location: Location) => { ... }
```

Run `npm run build:web` to see remaining strict-mode issues (optional to fix).

---

## 🤝 Contributing

When adding new features:

1. **Core logic?** → Add to `packages/core/src/`
2. **React component?** → Add to `packages/web/src/components/`
3. **Web-specific hook?** → Add to `packages/web/src/hooks/`
4. **Shared utility?** → Add to `packages/core/src/utils/`, export in `core/src/index.ts`

---

**Status**: ✅ Migration Complete | Ready for Web Development & Mobile Planning
