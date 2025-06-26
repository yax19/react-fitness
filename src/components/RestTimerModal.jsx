import { useEffect, useState } from 'react';

function RestTimerModal({ onClose }) {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      clearInterval(interval);
      setIsRunning(false);
      alert('Rest time over!'); // optional: replace with sound
    }

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const startTimer = () => {
    setRemaining(duration);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(duration);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Rest Timer</h2>
        <label>
          Duration:
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value="30">30 sec</option>
            <option value="60">60 sec</option>
            <option value="90">90 sec</option>
            <option value="120">120 sec</option>
          </select>
        </label>

        <div className="timer">{remaining} seconds</div>

        <div className="stopwatch-buttons">
          <button onClick={startTimer}>Start</button>
          <button onClick={resetTimer}>Reset</button>
        </div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default RestTimerModal;