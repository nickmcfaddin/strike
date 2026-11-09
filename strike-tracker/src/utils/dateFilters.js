
export function getSessionsForPeriod(sessions, period) {
  const now = new Date();

  // Use local calendar dates rather than UTC timestamps.
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (period === "all") {
    return sessions;
  }

  if (period === "week") {
    // Monday is the start of the week.
    const dayOfWeek = today.getDay();

    const daysSinceMonday =
      dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(today);

    monday.setDate(today.getDate() - daysSinceMonday);

    const nextMonday = new Date(monday);

    nextMonday.setDate(monday.getDate() + 7);

    return sessions.filter((session) => {
      const sessionDate = new Date(
        `${session.date}T00:00:00`
      );

      return (
        sessionDate >= monday &&
        sessionDate < nextMonday
      );
    });
  }

  if (period === "month") {
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const firstDayNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    return sessions.filter((session) => {
      const sessionDate = new Date(
        `${session.date}T00:00:00`
      );

      return (
        sessionDate >= firstDay &&
        sessionDate < firstDayNextMonth
      );
    });
  }

  if (period === "season") {
    const seasonStart = new Date("2026-11-01T00:00:00");

    const seasonEnd = new Date("2027-04-01T00:00:00");

    return sessions.filter((session) => {
      const sessionDate = new Date(
        `${session.date}T00:00:00`
      );

      return (
        sessionDate >= seasonStart &&
        sessionDate < seasonEnd
      );
    });
  }

  return sessions;
}
