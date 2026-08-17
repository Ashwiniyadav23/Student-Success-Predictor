import React from 'react';
import { User, Mail, Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { StudentProfile } from '../types/prediction';

interface StudentSelectorBarProps {
  students: StudentProfile[];
  selectedStudentId: string;
  onSelectStudent: (student: StudentProfile) => void;
}

export const StudentSelectorBar: React.FC<StudentSelectorBarProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
}) => {
  const getBadgeIcon = (pred: string) => {
    switch (pred) {
      case 'ON_TRACK':
        return <CheckCircle2 size={13} className="text-emerald" />;
      case 'AT_RISK':
        return <AlertTriangle size={13} className="text-rose" />;
      default:
        return <Clock size={13} className="text-amber" />;
    }
  };

  return (
    <div className="student-selector-container">
      <div className="student-selector-title">
        <User size={18} />
        <div>
          <h3>Student Directory</h3>
          <p>Select a student to view their individual attendance logs, email, and performance</p>
        </div>
      </div>

      <div className="student-chips-scroll">
        {students.map((student) => {
          const isSelected = student.id === selectedStudentId;
          return (
            <button
              key={student.id}
              className={`student-chip-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectStudent(student)}
            >
              <div className="chip-avatar">{student.name.charAt(0)}</div>
              <div className="chip-details">
                <div className="chip-top">
                  <span className="chip-name">{student.name}</span>
                  {getBadgeIcon(student.prediction)}
                </div>
                <div className="chip-bottom">
                  <span className="chip-email"><Mail size={11} /> {student.email}</span>
                  <span className="chip-att"><Calendar size={11} /> {student.attendance.toFixed(1)}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
