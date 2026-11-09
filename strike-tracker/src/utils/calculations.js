export function getTotalMinutes(sessions) {
  return sessions.reduce(
    (total, session) => total + session.duration,
    0
  );
}

export function getCategoryTotals(sessions) {
  const totals = {};

  sessions.forEach((session) => {
    if (!totals[session.category]) {
      totals[session.category] = 0;
    }

    totals[session.category] += session.duration;
  });

  return totals;
}

export function getPlayerTotals(sessions, players) {
  return players
    .map((player) => {
      const playerSessions = sessions.filter(
        (session) => session.playerId === player.id
      );

      const totalMinutes = getTotalMinutes(playerSessions);

      return {
        ...player,
        totalMinutes,
        totalHours: totalMinutes / 60,
      };
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}

export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hrs`;
  }

  return `${hours} hrs ${remainingMinutes} min`;
}