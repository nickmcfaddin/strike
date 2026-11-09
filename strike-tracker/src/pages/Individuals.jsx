import { getSessionsForPeriod } from "../utils/dateFilters";

import {
  getTotalMinutes,
  getCategoryTotals,
  getPlayerTotals,
  formatTime,
} from "../utils/calculations";

import { categories } from "../data/sampleData";

function Individuals({
  players,
  sessions,
  selectedPlayer,
  setSelectedPlayer,
  timePeriod,
  setTimePeriod,
}) {
  const filteredSessions = getSessionsForPeriod(sessions, timePeriod);

  const player = players.find(
    (item) => item.id === Number(selectedPlayer)
  );

  const playerSessions = filteredSessions.filter((session) => session.playerId === Number(selectedPlayer));

  const totalMinutes = getTotalMinutes(playerSessions);

  const categoryTotals = getCategoryTotals(playerSessions);

  const leaderboard = getPlayerTotals(filteredSessions, players);

  const playerRank =
    leaderboard.findIndex(
      (item) => item.id === Number(selectedPlayer)
    ) + 1;

  const sortedSessions = [...playerSessions].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>By Individual</h2>
          <p>Explore each player's training history.</p>
        </div>

        <select
          className="period-select"
          value={timePeriod}
          onChange={(event) =>
            setTimePeriod(event.target.value)
          }
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="season">This Season</option>
        </select>
      </div>

      <div className="individual-header">
        <div>
          <span className="eyebrow">PLAYER PROFILE</span>

          <h2>{player?.name}</h2>

          <p>Overall Rank #{playerRank}</p>
        </div>

        <select
          className="player-select"
          value={selectedPlayer}
          onChange={(event) =>
            setSelectedPlayer(Number(event.target.value))
          }
        >
          {players.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Training Hours</span>

          <h3>{(totalMinutes / 60).toFixed(1)}</h3>

          <p>{formatTime(totalMinutes)} accumulated</p>
        </div>

        <div className="stat-card">
          <span>Sessions Completed</span>

          <h3>{playerSessions.length}</h3>

          <p>Total logged sessions</p>
        </div>

        <div className="stat-card">
          <span>Overall Ranking</span>

          <h3>#{playerRank}</h3>

          <p>Among all players</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h3>Training Breakdown</h3>
          <span>By category</span>
        </div>

        <div className="individual-category-grid">
          {categories.map((category) => {
            const minutes = categoryTotals[category] || 0;

            return (
              <div
                className="individual-category-card"
                key={category}
              >
                <span>{category}</span>

                <h3>{formatTime(minutes)}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>Recent Training</h3>
          <span>Session history</span>
        </div>

        {sortedSessions.length === 0 ? (
          <p className="empty-state">
            No training sessions logged yet.
          </p>
        ) : (
          <div className="session-list">
            {sortedSessions.map((session) => (
              <div
                className="session-row"
                key={session.id}
              >
                <div>
                  <strong>{session.category}</strong>

                  <span>
                    {session.date}
                    {session.notes && ` • ${session.notes}`}
                  </span>
                </div>

                <strong>
                  {formatTime(session.duration)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Individuals;
