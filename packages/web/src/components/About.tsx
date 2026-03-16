import React from 'react';

interface AboutProps {
  gitTag?: string;
  gitCommit?: string;
}

function About({ gitTag, gitCommit }: AboutProps) {
  return (
    <div className="user-guide-page">
      <article className="user-guide-panel">
        <header className="user-guide-header">
          <h2>About Team Timer</h2>
          <p>
            A sports tournament timer for keeping the time and score of multiple games
            simultaneously.
          </p>
        </header>

        <section className="user-guide-section">
          <h3>Offline Downloads</h3>
          <a
            href="dist-single/team-timer-offline.html"
            download="team-timer.html"
            className="header-menu-item"
          >
            Download single HTML file version for offline use.
          </a>
        </section>

        <section className="user-guide-section">
          <h3>GitHub Repository</h3>
          <a
            href="https://github.com/robcj/teamtimer"
            target="_blank"
            rel="noopener noreferrer"
            className="header-menu-item"
          >
            https://github.com/robcj/teamtimer
          </a>
        </section>

        <section className="user-guide-section">
          <h3>Build Info</h3>
          <table className="about-build-info">
            <tbody>
              {gitTag && (
                <tr>
                  <th>Version: </th>
                  <td> {gitTag}</td>
                </tr>
              )}
              <tr>
                <th>Commit ID: </th>
                <td>
                  <code> {gitCommit || 'unknown'}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </article>
    </div>
  );
}

export default About;
