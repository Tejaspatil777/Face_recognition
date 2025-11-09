import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import MakeAttendance from './components/MakeAttendance';
import CheckAttendance from './components/CheckAttendance';
import EnrollStudent from './components/EnrollStudent';
import './App.css'; // Global styles (optional)

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/make-attendance" element={<MakeAttendance />} />
        <Route path="/check-attendance" element={<CheckAttendance />} />
        <Route path="/enroll-student" element={<EnrollStudent />} />
      </Routes>
    </Router>
  );
}

export default App;