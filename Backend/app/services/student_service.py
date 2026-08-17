"""Student service for retrieving student-wise details and attendance history."""

import os
import json
from typing import List, Optional
from app.schemas.student import StudentDetail

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'students.json')

def load_students_data() -> List[dict]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def get_all_students() -> List[StudentDetail]:
    raw_data = load_students_data()
    return [StudentDetail(**item) for item in raw_data]

def get_student_by_id(student_id: str) -> Optional[StudentDetail]:
    raw_data = load_students_data()
    for item in raw_data:
        if item.get("id") == student_id:
            return StudentDetail(**item)
    return None
