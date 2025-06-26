import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/signin';
import Signup from './pages/signup'
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import Confirmation from './pages/Confirmation';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;