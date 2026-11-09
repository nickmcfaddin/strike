import { getSessionsForPeriod } from "../utils/dateFilters";

import {
  getPlayerTotals,
  getCategoryTotals,
} from "../utils/calculations";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function PlayerHoursTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const { name, hours } = payload[0].payload;
  const formattedHours = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(hours);

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-name">{name}</p>
      <p className="chart-tooltip-value">
        {formattedHours} {hours === 1 ? "hour" : "hours"}
      </p>
    </div>
  );
}

function Statistics({
  players,
  sessions,
  timePeriod,
  setTimePeriod,
}) {
  const filteredSessions = getSessionsForPeriod(sessions, timePeriod);

  const playerTotals = getPlayerTotals(filteredSessions, players);

  const categoryTotals = getCategoryTotals(filteredSessions);

  const playerChartData = playerTotals.map((player) => ({
    name: player.name,
    hours: Number(player.totalHours.toFixed(1)),
  }));

  const categoryChartData = Object.entries(categoryTotals).map(
    ([category, minutes]) => ({
      name: category,
      hours: Number((minutes / 60).toFixed(1)),
    })
  );

  const chartColors = [
    "#16a34a",
    "#0d9488",
    "#d97706",
    "#7c3aed",
    "#db2777",
    "#64748b",
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Statistics</h2>
          <p>Compare training volume and performance.</p>
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

      <section className="panel">
        <div className="panel-heading">
          <h3>Player Training Hours</h3>
          <span>Hours logged per player</span>
        </div>

        <div className="chart-container">
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={playerChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip content={<PlayerHoursTooltip />} />

              <Bar
                dataKey="hours"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>Training Distribution</h3>
          <span>Hours by category</span>
        </div>

        <div className="chart-container">
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="hours"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default Statistics;
