# Team Timer

A web-based timer application for managing team sports tournaments (like underwater hockey). Intended for referees and tournament administrators to keep track of game timing and scores throughout a tournament day.

Built with React and TypeScript for type safety and better developer experience.

## Features

- **Multi-phase game timer**
  - Countdown to start, first half, half time, second half, between games
  - Optional extra time and sudden death flows
  - Automatic phase progression
- **Audio alerts**
  - Beeps every second for the final 5 seconds of active countdown phases
- **Score tracking**
  - Live score controls with configurable opposing team labels (White/Black by default)
  - Per-game score storage
- **Tournament setup workflow**
  - Competition name
  - Locations, divisions, teams, and game schedule
  - Special games (Winner/Loser of prior games)
  - Expected start times and optional tournament auto-start
- **Multi-location control**
  - Single or split scoreboard layout
  - Start/Pause/Resume all locations together
  - Reset all locations
- **Results tools**
  - Results table with expected/actual start times
  - Grouping by location and/or division
  - CSV export and print support
- **Additional screen mode**
  - Display-only mirrored view for projectors or external displays
- **Config persistence and portability**
  - Import/export JSON config
  - Browser local storage synchronization
- **Offline capable**
  - Downloadable single HTML build

## Installation

1. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build

Build for production (outputs to `dist/` and also generates an offline single-file app in `dist/dist-single/`):

```bash
npm run build
```

### Single-File Build

Generate the same production build plus the single-file offline app:

```bash
npm run build:single
```

The single file `team-timer-offline.html` can be downloaded and opened directly in any web browser without a server.

## How to Use

1. **Set up tournament configuration**

- Open **Menu -> Setup**
- In **Competition**, optionally set a competition name and keep-screen-awake mode
- In **Timer Durations**, configure countdown, halves, half-time, extra-time half, and between-games durations
- In **Opposing Team Labels**, set left/right team label text
- Add **Locations** (for multi-location events)
- Add **Divisions** and **Teams**
- Optionally set **Auto-Start Time**
- In **Game Schedule**, add standard games and optional special games (Winner/Loser of earlier games)
- Use **Import / Export** to save or load JSON config files
- Click **Apply**

2. **Run the timer**

- Click **Start** to begin the countdown
- Use **Pause** / **Resume** as needed
- Use **Reset** to reset current game state
- Use **Skip Phase** to jump ahead
- During **Between Games**, you can trigger **Extra Time** or **Sudden Death**

3. **Manage scores**

- Use `+` and `-` controls for each side
- Scores are tracked per game result

4. **Control multiple locations**

- Use **Start All**, **Pause All**, and **Resume All** from the header
- Use **Reset All** from the menu to clear all locations
- Switch between **Single Scoreboard** and **Split Scoreboard** when multiple locations exist
- Timers continue for all locations even when not currently visible

5. **Use Results view**

- Open **Menu -> Results**
- Review scores with expected/actual start times
- Optionally group by **Location** and/or **Division**
- Use **Export CSV** or **Print**

6. **Open a additional screen**

- Open **Menu -> Additional Screen**
- Choose a specific location or `all` (split mode) when prompted
- The second window is display-only (no control buttons)

7. **Expected start times behavior**

- If **Auto-Start Time** is set, schedule times are based on that datetime
- Otherwise, expected times begin when **Start** (or **Start All**) is first used

## Browser Compatibility

Works in all modern browsers that support:

- ES6+ JavaScript
- Web Audio API (for beep sounds)
- Local Storage

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Webpack 5** - Module bundler
- **SCSS (Sass)** - Styling

## Style Guide (SCSS Tokens)

Shared style primitives live in `src/styles/_tokens.scss` and `src/styles/_mixins.scss`.

Use shared tokens from `src/styles/_tokens.scss` instead of hard-coded values.

- **Semantic names first**: use purpose-based names (`$text-primary`, `$brand-primary`, `$border-subtle`) rather than raw-value names.
- **Category prefixes**: keep names grouped by intent (`$text-*`, `$brand-*`, `$border-*`, `$surface-*`, `$shadow-*`, `$radius-*`).
- **Interactive variants**: use explicit hover/state tokens (`$*-hover`, `$shadow-hover-*`) for consistent interaction styling.
- **Reuse before adding**: check existing tokens first; add a new token only when the value is reused or improves readability.
- **No new hex values in component SCSS**: prefer token references in component files and keep palette changes centralized in `_tokens.scss`.
- **No raw `rgba(...)` in component SCSS** unless it is a true one-off and documented in the PR.

Example:

```scss
/* ✅ Good */
.save-btn {
  background: $success;
  color: $white;
  border-radius: $radius-lg;
}

/* ❌ Avoid */
.save-btn {
  background: #28a745;
  color: #fff;
  border-radius: 10px;
}
```

```scss
/* ✅ Good (hover shadow token) */
.config-button:hover {
  box-shadow: $shadow-hover-primary;
}

/* ❌ Avoid */
.config-button:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

## License

MIT
