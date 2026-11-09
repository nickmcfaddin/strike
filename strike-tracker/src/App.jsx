
import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Dashboard from "./pages/Dashboard";
import Individuals from "./pages/Individuals";
import LogTraining from "./pages/LogTraining";
import Statistics from "./pages/Statistics";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [players, setPlayers] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [activeSeason, setActiveSeason] = useState(null);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [timePeriod, setTimePeriod] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATABASE INFORMATION
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          playersResult,
          seasonResult,
          sessionsResult,
        ] = await Promise.all([
          supabase
            .from("players")
            .select("*")
            .eq("active", true)
            .order("name"),

          supabase
            .from("seasons")
            .select("*")
            .eq("active", true)
            .maybeSingle(),

          supabase
            .from("training_sessions")
            .select("*")
            .order("session_date", { ascending: false }),
        ]);

        if (playersResult.error) {
          throw playersResult.error;
        }

        if (seasonResult.error) {
          throw seasonResult.error;
        }

        if (sessionsResult.error) {
          throw sessionsResult.error;
        }

        if (!seasonResult.data) {
          throw new Error("No active season was found.");
        }

        const formattedSessions = sessionsResult.data.map(
          (session) => ({
            id: session.id,
            playerId: session.player_id,
            category: session.category,
            duration: session.duration_minutes,
            date: session.session_date,
            notes: session.notes || "",
            seasonId: session.season_id,
          })
        );

        setPlayers(playersResult.data);
        setActiveSeason(seasonResult.data);
        setSessions(formattedSessions);

        if (playersResult.data.length > 0) {
          setSelectedPlayer(playersResult.data[0].id);
        }

      } catch (error) {
        console.error("Database loading error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ADD A NEW TRAINING SESSION
  async function addSession(newSession) {
    if (!activeSeason) {
      throw new Error("No active season available.");
    }

    const { data, error } = await supabase
      .from("training_sessions")
      .insert({
        player_id: newSession.playerId,
        season_id: activeSeason.id,
        category: newSession.category,
        duration_minutes: newSession.duration,
        session_date: newSession.date,
        notes: newSession.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Submission error:", error);
      throw error;
    }

    const formattedSession = {
      id: data.id,
      playerId: data.player_id,
      category: data.category,
      duration: data.duration_minutes,
      date: data.session_date,
      notes: data.notes || "",
      seasonId: data.season_id,
    };

    setSessions((previousSessions) => [
      formattedSession,
      ...previousSessions,
    ]);

    return formattedSession;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading team training data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <h2>Unable to load training data</h2>
        <p>{error}</p>
        <p>Check your Supabase connection and database settings.</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="loading-screen">
        <h2>No players found</h2>
        <p>Add your team roster in Supabase first.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">1919</div>

            <div>
              <h1>WPG GENERAL STRIKE</h1>
              <p>Team Performance Tracker</p>
            </div>
          </div>

          <div className="season-label">
            {activeSeason.name}
          </div>
        </div>
      </header>

      <nav className="main-navigation">
        {[
          { id: "dashboard", label: "Team Dashboard" },
          { id: "individuals", label: "By Individual" },
          { id: "log", label: "Log Training" },
          { id: "statistics", label: "Statistics" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={
              activeTab === tab.id
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard
            players={players}
            sessions={sessions}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        )}

        {activeTab === "individuals" && (
          <Individuals
            players={players}
            sessions={sessions}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        )}

        {activeTab === "log" && (
          <LogTraining
            players={players}
            onAddSession={addSession}
          />
        )}

        {activeTab === "statistics" && (
          <Statistics
            players={players}
            sessions={sessions}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        )}
      </main>
    </div>
  );
}

export default App;
