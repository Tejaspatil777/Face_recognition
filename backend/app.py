from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, fetch_all_attendance, add_student
from face_utils import recognize_faces, enroll_face
import cv2
import numpy as np
import base64
import os

app = Flask(__name__)
CORS(app)
init_db()

# Directory where faces are saved
FACE_DIR = "faces_data"
os.makedirs(FACE_DIR, exist_ok=True)


@app.route('/attendance', methods=['GET'])
def get_attendance():
    attendance_records = fetch_all_attendance()
    return jsonify(attendance_records)


@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400
    try:
        img_data = base64.b64decode(data['image'].split(',')[1])
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        recognized_names = recognize_faces(frame)
        return jsonify({'names': recognized_names})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/enroll_student', methods=['POST'])
def enroll_new_student():
    data = request.get_json()
    if not data or 'name' not in data or 'image' not in data:
        return jsonify({'error': 'Missing name or image'}), 400

    name = data['name'].strip()
    try:
        img_data = base64.b64decode(data['image'].split(',')[1])
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        face_data = enroll_face(frame)

        if face_data is not None:
            file_path = os.path.join(FACE_DIR, f"{name}.jpg")
            cv2.imwrite(file_path, face_data)
            add_student(name, "Face enrolled")  # Optional DB entry
            return jsonify({'message': f'{name} enrolled successfully'}), 201
        else:
            return jsonify({'error': 'No face detected in the image'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
