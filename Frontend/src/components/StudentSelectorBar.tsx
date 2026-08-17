import React, { useState } from 'react';
import { User, Mail, Calendar, CheckCircle2, AlertTriangle, Clock, Search, Filter } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'ALL' || student.prediction === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getBadgeIcon = (pred: string) => {
    switch (pred) {
      case 'ON_TRACK':
        return <CheckCircle2 size={13} className="status-icon-on-track" />;
      case 'AT_RISK':
        return <AlertTriangle size={13} className="status-icon-risk" />;
      default:
        return <Clock size={13} className="status-icon-attention" />;
    }
  };

  return (
    <div className="student-selector-container">
      <div className="student-selector-header">
        <div className="student-selector-title">
          <div className="title-icon-box">
            <User size={20} />
          </div>
          <div>
            <h3>Student Directory & Logs</h3>
            <p>Select a student profile to inspect granular attendance logs and ML predictions</p>
          </div>
        </div>

        <div className="student-selector-controls">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search student by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="student-search-input"
            />
          </div>

          <div className="filter-pills-group">
            <button
              className={`filter-pill ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All ({students.length})
            </button>
            <button
              className={`filter-pill on-track ${filterStatus === 'ON_TRACK' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ON_TRACK')}
            >
              On Track
            </button>
            <button
              className={`filter-pill attention ${filterStatus === 'NEEDS_ATTENTION' ? 'active' : ''}`}
              onClick={() => setFilterStatus('NEEDS_ATTENTION')}
            >
              Needs Attention
            </button>
            <button
              className={`filter-pill risk ${filterStatus === 'AT_RISK' ? 'active' : ''}`}
              onClick={() => setFilterStatus('AT_RISK')}
            >
              At Risk
            </button>
          </div>
        </div>
      </div>

      <div className="student-chips-scroll">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                className={`student-chip-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectStudent(student)}
              >
                <div className="chip-avatar-wrapper">
                  <div className="chip-avatar">{student.name.charAt(0)}</div>
                  <span className={`chip-status-dot ${student.prediction}`} />
                </div>

                <div className="chip-details">
                  <div className="chip-top">
                    <span className="chip-name">{student.name}</span>
                    {getBadgeIcon(student.prediction)}
                  </div>
                  <div className="chip-bottom">
                    <span className="chip-email">
                      <Mail size={11} /> {student.email}
                    </span>
                    <span className="chip-att">
                      <Calendar size={11} /> {student.attendance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="no-students-found">
            <Filter size={18} />
            <span>No student profiles match your search filter.</span>
          </div>
        )}
      </div>
    </div>
  );
};
