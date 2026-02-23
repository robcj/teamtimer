# Team Timer

A web-based timer application for managing team sports tournaments (like underwater hockey). Intended for referees and tournament administrators to keep track of game timing and scores throughout a tournament day.

Built with React and TypeScript for type safety and better developer experience.

## Features

- **Multi-phase Timer**: Automatically progresses through game phases
  - Countdown to start (default: 20 seconds)
  - First half (default: 10 minutes)
  - Half-time break (default: 2 minutes)
  - Second half (default: 10 minutes)
  - Between games (default: 3 minutes)

- **Audio Alerts**: Beeps every second for the last 5 seconds before each phase ends

- **Score Tracking**:
  - Displays team names with configurable colour labels (White/Black by default)
  - Large, easy-to-read score display below the timer
  - Quick +/- buttons to adjust scores for both teams
  - Scores tracked per game

- **Tournament Management**:
  - Enter a draw (list of teams playing against each other)
  - Navigate between games
  - Track multiple games in a single tournament

- **Configurable Settings**:
  - Customize all timer durations
  - Configure team colour labels (e.g., "White" and "Black" for stick/cap colours)
  - Optional keep-screen-awake mode to reduce screen dim/lock while timing (where supported, enabled by default)
  - Save/load configurations to/from JSON files
  - Settings persist in browser local storage

- **Offline Capable**: Can be built as a single HTML file for offline use

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

Build for production (outputs to `dist/` folder):

```bash
npm run build
```

### Single-File Build

Build as a single HTML file for offline use (outputs to `dist-single/` folder):

```bash
npm run build:single
```

The single file `team-timer.html` can be downloaded and opened directly in any web browser without a server.

## How to Use

1. **Configuration**:
   - Click the "Configuration" button in the header
   - Set timer durations for each phase

- Enable/disable "Keep screen awake while using the timer" as needed (enabled by default)
- Add games to the tournament draw by entering team names
- Reorder or remove games as needed
- Save or load configuration files for reuse
- Click "Save" to apply changes

2. **Running the Timer**:
   - Click "Start" to begin the countdown
   - The timer automatically progresses through each phase
   - Use "Pause" to pause the current timer
   - Use "Reset" to reset the current game
   - Use "Skip Phase" to move to the next phase immediately

3. **Score Tracking**:
   - Use the + and - buttons next to each team's score
   - Scores are tracked per game

4. **Navigating Games**:
   - Use "Previous Game", "Next Game", and "First Game" buttons to navigate
   - Scores and timer reset when switching games

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
