import React, { useState, useEffect } from 'react';

function EditWorkoutModal({ workout, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    sets: '',
    reps: '',
    duration: ''
  });

  useEffect(() => {
    if (workout) {
      setForm({
        name: workout.name || '',
        type: workout.type || '',
        sets: workout.sets || '',
        reps: workout.reps || '',
        duration: workout.duration || ''
      });
    }
  }, [workout]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/workouts/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Update failed');
      const updatedWorkout = await res.json();
      onUpdate(updatedWorkout);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Workout</h2>
        <form onSubmit={handleSubmit} className="form-card">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Workout Name" />
          <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g., Chest)" />
          <input name="sets" value={form.sets} onChange={handleChange} type="number" placeholder="Sets" />
          <input name="reps" value={form.reps} onChange={handleChange} type="number" placeholder="Reps" />
          <input name="duration" value={form.duration} onChange={handleChange} type="number" placeholder="Duration (mins)" />
          <button className="glow-button" type="submit">Update</button>
          <button className="glow-button" onClick={onClose} type="button" style={{ background: '#555' }}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditWorkoutModal;