import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StopwatchModal from '../components/StopwatchModal';
import RestTimerModal from '../components/RestTimerModal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EditWorkoutModal from '../components/EditWorkoutModal';


function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, sets: 0, reps: 0, duration: 0 });
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
const [showPR, setShowPR] = useState(false);
const [showCalendar, setShowCalendar] = useState(false);
const [showWheel, setShowWheel] = useState(false);
const [editWorkout, setEditWorkout] = useState(null);

function toggleTheme() {
  const next = theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('theme', next);
  document.body.className = next;
}

useEffect(() => {
  document.body.className = theme;
}, [theme]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [showStopwatch, setShowStopwatch] = useState(false);
const [showRestTimer, setShowRestTimer] = useState(false);

    const [waterCups, setWaterCups] = useState(() => {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('waterTracker')) || {};
  return saved.date === today ? saved.cups : Array(8).fill(false);
});

  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('completedDays');
    return saved ? JSON.parse(saved) : {};

  });

  function toggleDay(day) {
    const updated = {
      ...completedDays,
      [day]: !completedDays[day]
    };
    setCompletedDays(updated);
    localStorage.setItem('completedDays', JSON.stringify(updated));
  }

  function toggleCup(index) {
  const updated = [...waterCups];
  updated[index] = !updated[index];
  setWaterCups(updated);

  const today = new Date().toDateString();
  localStorage.setItem('waterTracker', JSON.stringify({ date: today, cups: updated }));
}

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/workouts', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setWorkouts(data);

        const totals = data.reduce((acc, workout) => {
          acc.sets += workout.sets || 0;
          acc.reps += workout.reps || 0;
          acc.duration += workout.duration || 0;
          return acc;
        }, { sets: 0, reps: 0, duration: 0 });

        setSummary({ total: data.length, ...totals });

      } catch (err) {
        console.error('Error fetching workouts:', err);
      }
    }

    fetchWorkouts();
  }, []);

  async function handleDelete(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/workouts/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (res.ok) {
      setWorkouts(prev => prev.filter(w => w._id !== id));
    }
  }

  const progress = (Object.values(completedDays).filter(Boolean).length / 7) * 100;

  return (
    <div className="page-container">
      <h1>Welcome to your Dashboard</h1>

      <div className="section-card">
        <h2>Workout Summary</h2>
        <p>Total Workouts: {summary.total}</p>
        <p>Total Sets: {summary.sets}</p>
        <p>Total Reps: {summary.reps}</p>
        <p>Total Duration: {summary.duration} mins</p>
      </div>

      <div className="section-card">
        <h2>Weekly Planner</h2>
        <button onClick={() => {
  setCompletedDays({});
  localStorage.removeItem('completedDays');
  setStreak(0);
}}>
  Reset Weekly Planner
</button>
        <div className="weekly-grid">
          {daysOfWeek.map((day) => (
            <label key={day} className="day-check">
              <input
                type="checkbox"
                checked={!!completedDays[day]}
                onChange={() => toggleDay(day)}
              />
              
              <span>{day}</span>
            </label>
          ))}
        </div>

<div className="section-card">
  <h2>Water Tracker</h2>
  <button onClick={() => {
  const empty = Array(8).fill(false);
  setWaterCups(empty);
  const today = new Date().toDateString();
  localStorage.setItem('waterTracker', JSON.stringify({ date: today, cups: empty }));
}}>
  Reset Water Tracker
</button>
  <p>{waterCups.filter(Boolean).length} of 8 cups</p>
  <div className="water-grid">
    {waterCups.map((full, i) => (
      <div
        key={i}
        className={`cup ${full ? 'filled' : ''}`}
        onClick={() => toggleCup(i)}
      >
        💧
      </div>
    ))}
  </div>
</div>

        <p>{Object.values(completedDays).filter(Boolean).length} of 7 days completed</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: progress + '%' }}
          ></div>
        </div>
      </div>

<div className="section-card">
  <h2>Tools</h2>
  <button className="glow" onClick={() => setShowStopwatch(true)}>
    ⏱ Open Stopwatch
  </button>
  <button className="glow" onClick={() => setShowRestTimer(true)}>
  ⏱ Rest Timer
</button>

{showRestTimer && <RestTimerModal onClose={() => setShowRestTimer(false)} />}
</div>

{showStopwatch && <StopwatchModal onClose={() => setShowStopwatch(false)} />}

      <div className="section-card">
        <h2>Recent Workouts</h2>
        <button onClick={() => navigate('/add-workout')} className="nav-button">Add New Workout</button>
      {workouts.slice(0, 3).map((w) => (
  <div key={w._id} className="workout-card">
    <h3>{w.name}</h3>
    <p>{w.type} | {w.sets} sets | {w.reps} reps | {w.duration} mins</p>
    <button className="delete-button" onClick={() => handleDelete(w._id)}>Delete</button>
    <button className="edit-button" onClick={() => setEditWorkout(w)}>✏️ Edit</button>
  </div>
))}

<div className="bottom-nav">
  <button onClick={() => navigate('/')}>🏠</button>
  <button onClick={toggleTheme}>🎨</button>
  <button onClick={() => setShowPR(true)}>🏆</button>
  <button onClick={() => setShowCalendar(true)}>📅</button>
  <button onClick={() => navigate('/challenge')}>🎡</button>
</div>

{editWorkout && (
  <EditWorkoutModal
    workout={editWorkout}
    onClose={() => setEditWorkout(null)}
    onUpdate={(updated) => {
      setWorkouts(prev => prev.map(w => w._id === updated._id ? updated : w));
    }}
  />
)}

{showPR && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>🏆 Personal Bests</h2>
      <p>Bench Press: 100kg</p>
      <p>Squat: 140kg</p>
      <p>Deadlift: 180kg</p>
      <button onClick={() => setShowPR(false)}>Close</button>
    </div>
  </div>
)}
   {showCalendar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📅 Workout Calendar</h2>
            <Calendar />
            <button onClick={() => setShowCalendar(false)}>Close</button>
          </div>
        </div>
      )}

      {showWheel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🎡 Spin the Wheel</h2>
            <button onClick={spinChallenge}>🎯 Spin</button>
            <button onClick={() => setShowWheel(false)}>Close</button>
          </div>
        </div>
      )}
    </div>

  

      </div>
   

    
  );
}

export default Dashboard;