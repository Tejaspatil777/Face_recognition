import React, { useState, useEffect } from 'react';
import './CheckAttendance.css'; // Create this CSS file

function CheckAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await fetch('http://localhost:5000/attendance');
        if (response.ok) {
          const data = await response.json();
          setAttendanceRecords(data);
        } else {
          console.error('Failed to fetch attendance:', response.status);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    }

    fetchAttendance();
  }, []);

  return (
    <div className="check-attendance-container">
      <h1>Attendance Records</h1>
      {attendanceRecords.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.date}</td>
                <td>{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}

export default CheckAttendance;