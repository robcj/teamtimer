import React from 'react';
import './UserGuide.scss';

function UserGuide() {
  return (
    <div className="user-guide-page">
      <article className="user-guide-panel">
        <header className="user-guide-header">
          <h2>User Guide</h2>
          <p>Quick reference for setting up tournaments, running games, and exporting results.</p>
        </header>

        <section className="user-guide-section">
          <h3>1. Setup Tournament</h3>
          <ol>
            <li>Open Menu -&gt; Setup.</li>
            <li>Set Competition name and optional keep-screen-awake mode.</li>
            <li>
              Configure timer durations, including game, extra-time and sudden death duration.
            </li>
            <li>
              Add Locations (optional, for when games are played simultaneously on different
              courts/fields).
            </li>
            <li>Add Divisions/Grades and Teams.</li>
            <li>
              Add Game Schedule entries to create the tournament draw, including optional special
              games (Winner/Loser of prior games).
            </li>
            <li>Optionally set Auto-Start Time.</li>
            <li>Click Apply.</li>
          </ol>
        </section>

        <section className="user-guide-section">
          <h3>2. Control Timers</h3>
          <ul>
            <li>Start begins countdown and phase progression.</li>
            <li>Pause/Resume controls the active timer.</li>
            <li>Reset clears current game timer and score.</li>
            <li>Skip Phase moves immediately to the next phase.</li>
            <li>Extra Time and Sudden Death can be triggered from Between Games.</li>
          </ul>
        </section>

        <section className="user-guide-section">
          <h3>3. Multi-Location Events</h3>
          <ul>
            <li>Use Start All, Pause All, and Resume All from the header.</li>
            <li>Use Reset All from the menu to clear all location timers and scores.</li>
            <li>Use Single Scoreboard or Split Scoreboard layout options.</li>
            <li>Each location timer continues running even when hidden in single layout.</li>
          </ul>
        </section>

        <section className="user-guide-section">
          <h3>4. Export & Import Settings</h3>
          <ul>
            <li>
              Use Export Settings to save your current configuration to a file for you to download.
            </li>
            <li>Use Import Settings to load a previously exported configuration file.</li>
          </ul>
        </section>

        <section className="user-guide-section">
          <h3>5. Scoring and Results</h3>
          <ul>
            <li>Use + and - controls to adjust both teams' scores.</li>
            <li>Open Menu -&gt; Results to review game outcomes.</li>
            <li>Group results by Location and/or Division as needed.</li>
            <li>Use Export CSV or Print for sharing and records.</li>
          </ul>
        </section>

        <section className="user-guide-section">
          <h3>6. Additional Screen </h3>
          <ul>
            <li>
              Open Menu -&gt; Additional Screen in a separate browser tab for a display-only mirror
              window.
            </li>
            <li>Choose one location or all (split) when prompted.</li>
            <li>
              This tab can then be moved onto a second display, e.g. a large screen connected to
              your device running Team Timer.
            </li>
          </ul>
        </section>

        <section className="user-guide-section">
          <h3>7. Offline Use</h3>
          <ul>
            <li>Use Download Offline App in the menu for a portable single-file build.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

export default UserGuide;
