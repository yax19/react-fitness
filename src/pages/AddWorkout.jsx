import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWorkout() {
  const [form, setForm] = useState({
    name: '',
    type: '',
    sets: '',
    reps: '',
    duration: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/confirmation');
      } else {
        alert(data.msg || 'Failed to add workout');
      }
    } catch (err) {
      console.error('Error adding workout:', err);
    }
  };

  return (
    <div className="page-container">
      <h2>Add New Workout</h2>
      <form onSubmit={handleSubmit} className="section-card">
        <input name="name" placeholder="Workout Name" value={form.name} onChange={handleChange} required />
        <input name="type" placeholder="Type (e.g. Cardio, Strength)" value={form.type} onChange={handleChange} required />
        <input name="sets" type="number" placeholder="Sets" value={form.sets} onChange={handleChange} />
        <input name="reps" type="number" placeholder="Reps" value={form.reps} onChange={handleChange} />
        <input name="duration" type="number" placeholder="Duration (mins)" value={form.duration} onChange={handleChange} />
        <button className="glow" type="submit">Add Workout</button>
      </form>
    </div>
  );
}

export default AddWorkout;