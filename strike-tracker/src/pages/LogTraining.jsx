
import { useState } from "react";
import { categories } from "../data/sampleData";

function LogTraining({ players, onAddSession }) {
  const [playerId, setPlayerId] = useState(players[0].id);
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState("60");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const durationNumber = Number(duration);

    if (
      !Number.isFinite(durationNumber) ||
      durationNumber <= 0
    ) {
      setMessage("Please enter a valid duration.");
      return;
    }

    if (durationNumber > 1440) {
      setMessage("Duration cannot exceed 24 hours.");
      return;
    }

    if (!date) {
      setMessage("Please select a date.");
      return;
    }

    try {
      setMessage("Submitting...");

      await onAddSession({
        playerId: Number(playerId),
        category,
        duration: durationNumber,
        date,
        notes,
      });

      setMessage("Training session successfully saved!");

      setDuration("60");
      setNotes("");

    } catch (error) {
      console.error(error);

      setMessage(
        error.message || "Unable to submit training."
      );
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Log Training</h2>
          <p>Add a new training session to the team tracker.</p>
        </div>
      </div>

      <div className="form-container">
        <form
          className="training-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="player">Player</label>

            <select
              id="player"
              value={playerId}
              onChange={(event) =>
                setPlayerId(event.target.value)
              }
            >
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                >
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Training Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              Duration (minutes)
            </label>

            <input
              id="duration"
              type="number"
              min="1"
              max="1440"
              step="1"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              required
            />

            <div className="duration-presets">
              {[30, 45, 60, 90, 120].map((minutes) => (
                <button
                  type="button"
                  key={minutes}
                  onClick={() =>
                    setDuration(String(minutes))
                  }
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notes (optional)
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="E.g. Team practice, lower body, throwing session..."
              rows="3"
            />
          </div>

          <button
            className="submit-button"
            type="submit"
          >
            Submit Training
          </button>

          {message && (
            <p className="form-message">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LogTraining;
