import React from 'react';
import './WelcomeSplash.scss';

interface WelcomeSplashProps {
  onContinue: () => void;
  onLoadDemo: () => void;
  onOpenSetup: () => void;
  onOpenGuide: () => void;
}

function WelcomeSplash({ onContinue, onLoadDemo, onOpenSetup, onOpenGuide }: WelcomeSplashProps) {
  return (
    <div className="welcome-splash">
      <article className="welcome-splash-panel">
        <header className="welcome-splash-header">
          <p className="welcome-splash-kicker">Welcome to</p>
          <h2>Team Timer</h2>
          <p>
            Team Timer is a lightweight, flexible app designed to help you manage tournament times
            and scores for your team-based competitions. It works on any modern web browser, so you
            can run it on a laptop, tablet, or even a phone.
          </p>
          <p>
            There is also a downloadable single HTML file version and an Android app available for
            offline use and mobile scorekeeping.
          </p>
        </header>

        <div className="welcome-splash-options">
          <section className="welcome-splash-option">
            <h3>Default, unconfigured setup</h3>
            <p>
              This is the app with no saved tournament configuration. You can start timing straight
              away in the timer view and configure teams, divisions, and competition details later.
            </p>
            <ul>
              <li>Opens with the current quick-start timer.</li>
              <li>Uses a simple single-location fallback with Team A vs Team B.</li>
              <li>
                Best for when you want to start immediately to track casual games rather than a
                tournament.
              </li>
            </ul>

            <div className="welcome-splash-actions">
              <button type="button" className="welcome-splash-primary" onClick={onContinue}>
                Continue as-is
              </button>
            </div>
          </section>

          <section className="welcome-splash-option accent">
            <h3>Demo setup</h3>
            <p>
              Loads a demo tournament with sample teams, scheduled games, and multiple locations
              (courts/pools/fields) so you can explore how the full app behaves.
            </p>
            <p>
              The games are set to 10-second durations so you can quickly see how the timer phases
              and controls work. This is obviously not a real tournament setup, but it&apos;s a good
              way to explore the app&apos;s features without having to configure your own tournament
              first.
            </p>
            <div className="welcome-splash-actions">
              <button type="button" className="welcome-splash-secondary" onClick={onLoadDemo}>
                Load demo
              </button>
            </div>
          </section>
        </div>
        <div className="welcome-splash-actions">
          <button type="button" className="welcome-splash-tertiary" onClick={onOpenSetup}>
            Go to Setup
          </button>
          <button type="button" className="welcome-splash-tertiary" onClick={onOpenGuide}>
            User Guide
          </button>
        </div>
      </article>
    </div>
  );
}

export default WelcomeSplash;
