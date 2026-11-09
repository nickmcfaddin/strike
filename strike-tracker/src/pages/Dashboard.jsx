import { getSessionsForPeriod } from "../utils/dateFilters";

import {
  getTotalMinutes,
  getCategoryTotals,
  getPlayerTotals,
  formatTime,
} from "../utils/calculations";

const categoryColors = {
  "Weight Training": "#64748b",
  Cardio: "#0d9488",
  Frisbee: "#16a34a",
  Throwing: "#d97706",
  Film: "#7c3aed",
  "Rehab / Mobility": "#db2777",
};

function Dashboard({
  players,
  sessions,
  timePeriod,
  setTimePeriod,
}) {

  const filteredSessions = getSessionsForPeriod(sessions, timePeriod);

  const totalMinutes = getTotalMinutes(filteredSessions);

  const categoryTotals = getCategoryTotals(filteredSessions);

  const leaderboard = getPlayerTotals(filteredSessions, players);

  const activePlayers = new Set(filteredSessions.map((session) => session.playerId)).size;

  const totalHours = (totalMinutes / 60).toFixed(1);

  const categories = Object.entries(categoryTotals);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Team Dashboard</h2>
          <p>Track the work. Compete together.</p>
        </div>

        <select
          value={timePeriod}
          onChange={(event) =>
            setTimePeriod(event.target.value)
          }
          className="period-select"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="season">This Season</option>
        </select>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Training Hours</span>
          <h3>{totalHours}</h3>
          <p>{formatTime(totalMinutes)} accumulated</p>
        </div>

        <div className="stat-card">
          <span>Sessions Logged</span>
          <h3>{sessions.length}</h3>
          <p>Total recorded sessions</p>
        </div>

        <div className="stat-card">
          <span>Active Players</span>
          <h3>{activePlayers}</h3>
          <p>Players with training logged</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <h3>Training Breakdown</h3>
            <span>By category</span>
          </div>

          <div className="category-list">
            {categories.map(([category, minutes]) => {
              const percentage =
                totalMinutes > 0
                  ? (minutes / totalMinutes) * 100
                  : 0;

              return (
                <div
                  className="category-item"
                  key={category}
                >
                  <div className="category-label">
                    <span>{category}</span>

                    <span>
                      {formatTime(minutes)}
                    </span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          categoryColors[category],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h3>Overall Leaderboard</h3>
            <span>Top 3</span>
          </div>

          <div className="leaderboard">
            {leaderboard.slice(0, 3).map((player, index) => (
              <div
                className="leaderboard-row"
                key={player.id}
              >
                <div className={`rank rank-${index + 1}`}>
                  {index + 1}
                </div>

                <div className="leaderboard-player">
                  <strong>{player.name}</strong>
                  <span>
                    {player.totalHours.toFixed(1)} hours
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h3>Category Leaderboards</h3>
          <span>Top 3 in each category</span>
        </div>

        <div className="category-leaderboard-grid">
          {Object.keys(categoryColors).map((category) => {
            const categoryLeaderboard = players
              .map((player) => {
                const minutes = filteredSessions
                  .filter(
                    (session) =>
                      session.playerId === player.id &&
                      session.category === category
                  )
                  .reduce(
                    (total, session) =>
                      total + session.duration,
                    0
                  );

                return {
                  ...player,
                  minutes,
                };
              })
              .sort((a, b) => b.minutes - a.minutes)
              .slice(0, 3);

            return (
              <div
                className="category-leaderboard"
                key={category}
              >
                <h4
                  style={{
                    color: categoryColors[category],
                  }}
                >
                  {category}
                </h4>

                {categoryLeaderboard.map(
                  (player, index) => (
                    <div
                      className="mini-leaderboard-row"
                      key={player.id}
                    >
                      <span>
                        {index + 1}. {player.name}
                      </span>

                      <strong>
                        {formatTime(player.minutes)}
                      </strong>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
