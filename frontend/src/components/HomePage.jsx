import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create this CSS file

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Face Recognition Attendance System</h1>
      <div className="button-container">
        <Link to="/make-attendance" className="home-button make-attendance">Make Attendance</Link>
        <Link to="/check-attendance" className="home-button check-attendance">Check Attendance</Link>
        <Link to="/enroll-student" className="home-button enroll-student">Enroll New Student</Link>
      </div>
    </div>
  );
}

export default HomePage;