import React, { useRef, useState, useEffect } from 'react';
import './EnrollStudent.css'; // Create this CSS file

function EnrollStudent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState('');

  useEffect(() => {
    async function getVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }

    getVideo();
  }, [videoRef]);

  const captureAndEnroll = async () => {
    if (videoRef.current && canvasRef.current && name) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL('image/jpeg');

      try {
        const response = await fetch('http://localhost:5000/enroll_student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, image: imageDataURL }),
        });

        if (response.ok) {
          alert(`Student ${name} enrolled successfully!`);
          setName('');
        } else {
          const errorData = await response.json();
          console.error('Failed to enroll student:', errorData);
          alert(`Enrollment failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error sending enrollment request:', error);
        alert('Error during enrollment.');
      }
    } else {
      alert('Please enter a name and allow webcam access.');
    }
  };

  return (
    <div className="enroll-container">
      <h1>Enroll New Student</h1>
      <div className="input-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="name-input"
        />
      </div>
      <video ref={videoRef} autoPlay className="video-feed" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={captureAndEnroll} className="enroll-button">Enroll Student</button>
    </div>
  );
}

export default EnrollStudent;