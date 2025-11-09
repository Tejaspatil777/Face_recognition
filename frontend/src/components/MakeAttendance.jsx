import React, { useRef, useEffect, useState } from 'react';
import './MakeAttendance.css'; 

function MakeAttendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognizedNames, setRecognizedNames] = useState([]);

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

  const captureFrame = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL('image/jpeg');

      try {
        const response = await fetch('http://localhost:5000/mark_attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageDataURL }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecognizedNames(data.names);
        } else {
          console.error('Failed to mark attendance:', response.status);
        }
      } catch (error) {
        console.error('Error sending attendance request:', error);
      }
    }
  };

  return (
    <div className="make-attendance-container">
      <h1>Make Attendance</h1>
      <video ref={videoRef} autoPlay className="video-feed" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={captureFrame} className="capture-button">Capture and Mark Attendance</button>
      {recognizedNames.length > 0 && (
        <div className="recognition-results">
          <h2>Recognized:</h2>
          <ul>
            {recognizedNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MakeAttendance;