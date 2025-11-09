import face_recognition
import numpy as np
import base64
from database import get_all_students_with_faces, add_attendance, get_student_by_name
import cv2

def load_known_faces():
    known_face_encodings = []
    known_face_names = []
    students_data = get_all_students_with_faces()
    for id, name, face_blob in students_data:
        face_encoding = np.frombuffer(face_blob, dtype=np.float64)
        known_face_encodings.append(face_encoding)
        known_face_names.append(name)
    return known_face_encodings, known_face_names

def recognize_faces(frame):
    known_face_encodings, known_face_names = load_known_faces()
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    recognized_names = []
    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
        name = "Unknown"

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
            student_id = get_student_by_name(name)
            if student_id:
                add_attendance(student_id)
            recognized_names.append(name)
    return recognized_names

def enroll_face(frame):
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)
    if face_encodings:
        return face_encodings[0].tobytes()
    return None