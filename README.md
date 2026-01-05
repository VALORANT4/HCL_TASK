# 🏋️ Adaptive Workout Intelligence

A frontend-only intelligent workout tracker built with **React + Vite**.
The app doesn’t just store workouts — it **analyzes performance**, detects fatigue, and provides smart training recommendations.

---

## 🚀 Features

- Add & delete workouts and exercises
- Automatic performance comparison (session-to-session)
- Volume-based progress tracking
- Smart recommendations (increase / maintain / deload)
- Fatigue detection using trend analysis
- Interactive progress charts (Recharts)
- Persistent data using localStorage
- Clean, modern UI with hover animations

---

## 🧠 Intelligence Logic

- **Volume = sets × reps × weight**
- Performance is derived, not stored
- Fatigue detected when volume drops across 3 sessions
- All insights are calculated dynamically

---

## 🛠 Tech Stack

- React
- Vite
- JavaScript (ES6)
- Recharts
- CSS (custom, no UI library)
- localStorage

---

## 📦 Installation

```bash
git clone https://github.com/your-username/adaptive-workout-intelligence.git
cd adaptive-workout-intelligence
npm install
npm run dev
