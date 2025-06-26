import { Link } from 'react-router-dom';

function Confirmation() {
  return (
    <div className="page-container">
      <div className="section-card" style={{ textAlign: 'center' }}>
        <h2>🎉 Workout Added Successfully!</h2>
        <p>Your workout has been saved.</p>
        <div className="confirmation-buttons">
          <Link to="/dashboard">
            <button className="glow">Back to Dashboard</button>
          </Link>
          <Link to="/add-workout">
            <button className="glow">Add Another Workout</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;