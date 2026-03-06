# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies (First Time Only)

```bash
npm install
```

### 2. Run the App

Development (hot reload):

```bash
npm start
```

Opens at `http://localhost:3000`.

Production build (also generates offline single-file app):

```bash
npm run build
```

Single-file build alias:

```bash
npm run build:single
```

Both build commands create `dist/dist-single/team-timer-offline.html`.

### 3. Use the App

#### Setup

1. Open **Menu -> Setup**.
2. In **Competition**, set an optional competition name and keep-screen-awake behavior.
3. In **Timer Durations**, set:
   - Countdown to Start
   - First/Second Half duration
   - Half Time duration
   - Extra Time half duration
   - Between Games duration
4. In **Opposing Team Labels**, set left/right labels (defaults: White/Black).
5. Add **Locations** (optional, but required for multi-location tournaments).
6. Add **Divisions** and **Teams**.
7. In **Auto-Start Time**, optionally set tournament auto-start date/time.
8. In **Game Schedule**, add games:
   - Standard games by selecting Team 1 vs Team 2
   - Special games (Winner/Loser of prior games)
   - Optional empty-slot games
9. Use **Import / Export** for JSON config files.
10. Click **Apply**.

#### Timer Controls

- **Start / Pause / Resume**: control the active timer.
- **Reset**: reset current game timer and score.
- **Skip Phase**: jump to next phase.
- **Extra Time**: available during Between Games.
- **Sudden Death** and **End Sudden Death**: available from controls when applicable.

#### Multi-Location Controls

- **Start All / Pause All / Resume All** controls all locations together.
- **Reset All** resets all locations.
- Use **Single Scoreboard** or **Split Scoreboard** when multiple locations exist.
- Each location timer continues running even when not currently visible.

#### Results View

- Open **Menu -> Results**.
- View game scores and actual/expected start times.
- Optional grouping by **Location** and/or **Division**.
- Use **Export CSV** or **Print**.

#### Second Screen

- Open **Menu -> Second Screen**.
- Choose a location or **all** (split view) when prompted.
- Second screen is display-only and mirrors timer state.

## Timer Phases

Main flow:

1. Countdown to Start
2. First Half
3. Half Time
4. Second Half
5. Between Games
6. Ready to Start

Optional overtime phases:

1. Extra Time Countdown
2. Extra Time First Half
3. Extra Time Half Time
4. Extra Time Second Half
5. Sudden Death Countdown
6. Sudden Death

Audio beeps play for the final 5 seconds of active countdown phases.

## Offline Use

After `npm run build` or `npm run build:single`:

1. Open `dist/dist-single/team-timer-offline.html`.
2. Run it directly in a browser (no server required).
3. Local storage, timer, scoring, and config import/export continue to work offline.
