import { useEffect, useState } from "react"
import "./App.css"

function App() {
  // ───────────── WORKOUT STATE ─────────────
  const [workoutType, setWorkoutType] = useState("")
  const [workoutDate, setWorkoutDate] = useState("")
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)

  // ───────────── EXERCISE STATE ─────────────
  const [exerciseName, setExerciseName] = useState("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")

  // ───────────── STAGE 5: LOAD / SAVE ─────────────
  useEffect(() => {
    const saved = localStorage.getItem("awi-workouts")
    if (saved) setWorkouts(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("awi-workouts", JSON.stringify(workouts))
  }, [workouts])

  // ───────────── ADD WORKOUT ─────────────
  const addWorkout = () => {
    if (!workoutType || !workoutDate) return

    const newWorkout = {
      id: Date.now(),
      type: workoutType,
      date: workoutDate,
      exercises: []
    }

    setWorkouts(prev => [...prev, newWorkout])
    setSelectedWorkoutId(newWorkout.id)
    setWorkoutType("")
    setWorkoutDate("")
  }

  // ───────────── DELETE WORKOUT ─────────────
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
    if (selectedWorkoutId === id) setSelectedWorkoutId(null)
  }

  // ───────────── ADD EXERCISE ─────────────
  const addExercise = () => {
    if (!selectedWorkoutId || !exerciseName || !sets || !reps || !weight) return

    const newExercise = {
      name: exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    }

    setWorkouts(prev =>
      prev.map(w =>
        w.id === selectedWorkoutId
          ? { ...w, exercises: [...w.exercises, newExercise] }
          : w
      )
    )

    setExerciseName("")
    setSets("")
    setReps("")
    setWeight("")
  }

  // ───────────── DELETE EXERCISE ─────────────
  const deleteExercise = (workoutId, index) => {
    setWorkouts(prev =>
      prev.map(w =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.filter((_, i) => i !== index)
            }
          : w
      )
    )
  }

  // ───────────── HELPERS ─────────────
  const getVolume = (ex) => ex.sets * ex.reps * ex.weight

  const getPreviousExercise = (currentId, name) => {
    const sorted = [...workouts]
      .filter(w => w.id !== currentId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    for (let w of sorted) {
      const found = w.exercises.find(
        e => e.name.toLowerCase() === name.toLowerCase()
      )
      if (found) return found
    }
    return null
  }

  const getStatus = (id, ex) => {
    const prev = getPreviousExercise(id, ex.name)
    if (!prev) return "new"
    const cur = getVolume(ex)
    const old = getVolume(prev)
    if (cur > old) return "up"
    if (cur < old) return "down"
    return "same"
  }

  const getRecommendation = (id, ex) => {
    const prev = getPreviousExercise(id, ex.name)
    if (!prev) return "baseline"
    const cur = getVolume(ex)
    const old = getVolume(prev)
    if (cur > old) return "increase"
    if (cur < old) return "deload"
    return "maintain"
  }

  // ───────────── ANALYTICS ─────────────
  const totalVolume = workouts
    .flatMap(w => w.exercises)
    .reduce((sum, ex) => sum + getVolume(ex), 0)

  // ───────────── UI ─────────────
  return (
    <div className="app-wrapper">
      <div className="todo-card">
        <h1>🏋️ Adaptive Workout Intelligence</h1>

        <section>
          <h3>📊 Training Insights</h3>
          <p><strong>Total Volume:</strong> {totalVolume} kg</p>
        </section>

        <section>
          <h3>➕ Add Workout</h3>
          <input
            placeholder="Workout type"
            value={workoutType}
            onChange={e => setWorkoutType(e.target.value)}
          />
          <input
            type="date"
            value={workoutDate}
            onChange={e => setWorkoutDate(e.target.value)}
          />
          <button onClick={addWorkout}>Add Workout</button>
        </section>

        <section>
          <h3>📅 Workouts</h3>
          <ul>
            {workouts.map(w => (
              <li
                key={w.id}
                onClick={() => setSelectedWorkoutId(w.id)}
                style={{
                  border:
                    w.id === selectedWorkoutId
                      ? "2px solid #4b4bff"
                      : "1px solid #444",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                }}
              >
                <strong>{w.type}</strong> — {w.date}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteWorkout(w.id)
                  }}
                  style={{
                    float: "right",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  🗑
                </button>

                {w.exercises.map((ex, i) => {
                  const status = getStatus(w.id, ex)
                  const rec = getRecommendation(w.id, ex)

                  return (
                    <div key={i} style={{ marginTop: "6px" }}>
                      {ex.name}: {ex.sets}×{ex.reps}@{ex.weight}kg{" "}
                      {status === "up" && "📈"}
                      {status === "same" && "➖"}
                      {status === "down" && "📉"}
                      {status === "new" && "✨"}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteExercise(w.id, i)
                        }}
                        style={{
                          marginLeft: "8px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        ❌
                      </button>

                      <br />
                      <small>
                        {rec === "increase" && "⬆ Increase"}
                        {rec === "maintain" && "➖ Maintain"}
                        {rec === "deload" && "⬇ Deload"}
                        {rec === "baseline" && "🆕 Baseline"}
                      </small>
                    </div>
                  )
                })}
              </li>
            ))}
          </ul>
        </section>

        {selectedWorkoutId && (
          <section>
            <h3>🏋️ Add Exercise</h3>
            <input
              placeholder="Exercise"
              value={exerciseName}
              onChange={e => setExerciseName(e.target.value)}
            />
            <input
              placeholder="Sets"
              value={sets}
              onChange={e => setSets(e.target.value)}
            />
            <input
              placeholder="Reps"
              value={reps}
              onChange={e => setReps(e.target.value)}
            />
            <input
              placeholder="Weight"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
            <button onClick={addExercise}>Add Exercise</button>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
