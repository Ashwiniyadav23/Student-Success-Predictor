import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="student-selector-container"
    >
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
            {[
              { id: 'ALL', label: `All (${students.length})`, class: '' },
              { id: 'ON_TRACK', label: 'On Track', class: 'on-track' },
              { id: 'NEEDS_ATTENTION', label: 'Needs Attention', class: 'attention' },
              { id: 'AT_RISK', label: 'At Risk', class: 'risk' },
            ].map((f) => (
              <button
                key={f.id}
                className={`filter-pill ${f.class} ${filterStatus === f.id ? 'active' : ''}`}
                onClick={() => setFilterStatus(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="student-chips-scroll">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <motion.button
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
                </motion.button>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-students-found"
            >
              <Filter size={18} />
              <span>No student profiles match your search filter.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
