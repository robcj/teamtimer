# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies (First Time Only)

```bash
npm install
```

### 2. Run the App

**For Development (with hot-reload):**

```bash
npm start
```

Opens at http://localhost:3000

**For Production Build (includes offline single-file output):**

```bash
npm run build
```

Outputs standard assets in `dist/` and the offline file in `dist/dist-single/`.

**For Offline Single-File Version:**

```bash
npm run build:single
```

Also creates `dist/dist-single/team-timer-offline.html` - a single HTML file that works offline!

### 3. Using the App

#### Timer Controls

- **Start**: Begin the countdown and start timing
- **Pause**: Pause the current timer
- **Reset**: Reset the current game
- **Skip Phase**: Jump to the next phase immediately

#### Score Tracking

- Scores are displayed below the timer with team colour labels
- Use **+** and **-** buttons to adjust scores for both teams
- Left team shows the configured label (default: "White")
- Right team shows the configured label (default: "Black")
- Scores are tracked per game and reset when switching games

#### Configuration

1. Click **Configuration** button
2. Set timer durations (in seconds and minutes)
3. Configure team colour labels:
   - Set Left Team Label (e.g., "White", "Home", etc.)
   - Set Right Team Label (e.g., "Black", "Away", etc.)
4. Optional: enable **Keep screen awake while using the timer**
5. In **Draw**, add one or more **Locations** (for example, North Court, South Court)
6. Optional: set **Tournament Start** date/time
7. Add games to the tournament:
   - Enter Team 1 name
   - Enter Team 2 name
   - If 2+ locations exist, select a location for each game
   - Click **Add Game**
8. Reorder games with **↑** and **↓** buttons
9. **Save** or **Export** your configuration
10. Click **Save** to return to timer view

#### Tournament Management

- Navigate between games using:
  - **Previous Game**
  - **Next Game**
  - **First Game** (reset to first game)
- If multiple locations are configured:
  - Use the location selector to choose one location
  - Use **Single** or **Split** to switch between focused and all-location views
  - Use **Start All** to begin all location countdowns at once
  - Use **Reset All** to reset all location timers and scores together
  - Timers continue running for all locations even when another location is being viewed
  - Expected start times are shown in Draw and Scores
    - If Tournament Start is set, it drives the schedule
    - Otherwise, timing starts from when Start/Start All is clicked

#### Second Screen

- Click **Second Screen** from the header
- If multiple locations exist, choose a specific location or type **all** for split view
- The second screen mirrors timer and scores in display-only mode (no control buttons)

## Timer Phases

The timer automatically progresses through these phases:

1. **Countdown to Start** (20 seconds default)
2. **First Half** (10 minutes default)
3. **Half Time** (2 minutes default)
4. **Second Half** (10 minutes default)
5. **Between Games** (3 minutes default)
6. **Idle** (ready for next game)

Audio beeps sound for the last 5 seconds of each phase!

## Save & Load Configurations

### Export Configuration

- Go to Configuration
- Click **Export Configuration**
- Downloads a JSON file

### Import Configuration

- Go to Configuration
- Click **Import Configuration**
- Select a JSON file you previously exported

## Offline Use

After running `npm run build` or `npm run build:single`, you can:

1. Find `team-timer-offline.html` in the `dist/dist-single/` folder
2. Copy it to a USB drive or email it
3. Open it in any web browser - **no internet required!**
4. All features work offline including:
   - Timer functionality
   - Score tracking
   - Configuration saves (in browser storage)
   - Import/export of configurations

Perfect for tournaments in locations with poor internet!
