import React, { useState } from 'react';
import './Challenge.css';

const challenges = [
  '50 Push-ups',
  '20 Burpees',
  '1 min Plank',
  '30 Squats',
  '15 Pull-ups',
  '10 Min Jog',
  '100 Jumping Jacks'
];

function Challenge() {
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    const random = Math.floor(Math.random() * challenges.length);
    setTimeout(() => {
      setSelected(random);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="page-container">
      <h1>🎯 Daily Challenge</h1>

      <div className="wheel-container">
        <div className={`wheel ${spinning ? 'spinning' : ''}`}>
          {challenges.map((c, i) => (
            <div key={i} className="wheel-slice">{c}</div>
          ))}
        </div>
        <button onClick={spinWheel} disabled={spinning}>
          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
      </div>

      {selected !== null && (
        <div className="challenge-result">
          <h3>Today's Challenge:</h3>
          <p>{challenges[selected]}</p>
        </div>
      )}

      <button onClick={() => window.location.href = '/dashboard'} className="back-button">
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default Challenge;