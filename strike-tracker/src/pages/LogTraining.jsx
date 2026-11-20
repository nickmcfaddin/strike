
import { useEffect, useRef, useState } from "react";
import { categories } from "../data/sampleData";

const MANITOBA_TIME_ZONE = "America/Winnipeg";

function getManitobaDate() {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MANITOBA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = dateParts.find((part) => part.type === "year").value;
  const month = dateParts.find((part) => part.type === "month").value;
  const day = dateParts.find((part) => part.type === "day").value;

  return `${year}-${month}-${day}`;
}

function formatManitobaDate(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(
    undefined,
    {
      timeZone: MANITOBA_TIME_ZONE,
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function LogTraining({ players, onAddSession }) {
  const confirmationDialog = useRef(null);
  const [playerId, setPlayerId] = useState(players[0].id);
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState("60");
  const [date, setDate] = useState(getManitobaDate);
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (confirmation && confirmationDialog.current) {
      confirmationDialog.current.showModal();
    }
  }, [confirmation]);

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
      setMessage("");
      setIsSubmitting(true);

      await onAddSession({
        playerId: Number(playerId),
        category,
        duration: durationNumber,
        date,
        notes,
      });

      setConfirmation({
        playerName: players.find(
          (player) => player.id === Number(playerId)
        )?.name || "Selected player",
        category,
        duration: durationNumber,
        date,
        notes,
      });

      setDuration("60");
      setNotes("");
    } catch (error) {
      console.error(error);

      setMessage(
        error.message || "Unable to submit training."
      );
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Training"}
          </button>

          {message && (
            <p className="form-message" role="alert">{message}</p>
          )}
        </form>
      </div>

      {confirmation && (
        <dialog
          ref={confirmationDialog}
          className="training-confirmation"
          aria-labelledby="training-confirmation-title"
          aria-describedby="training-confirmation-description"
          onClose={() => setConfirmation(null)}
        >
          <div className="confirmation-content">
            <h2 id="training-confirmation-title">
              Training recorded
            </h2>
            <p id="training-confirmation-description">
              Your training entry has been saved.
            </p>

            <dl className="confirmation-details">
              <div>
                <dt>Player</dt>
                <dd>{confirmation.playerName}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{confirmation.category}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{confirmation.duration} minutes</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{formatManitobaDate(confirmation.date)}</dd>
              </div>
              <div>
                <dt>Notes</dt>
                <dd>
                  {confirmation.notes.trim() || "No notes"}
                </dd>
              </div>
            </dl>

            <button
              className="submit-button confirmation-button"
              type="button"
              autoFocus
              onClick={() => confirmationDialog.current.close()}
            >
              Okay, continue
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default LogTraining;
