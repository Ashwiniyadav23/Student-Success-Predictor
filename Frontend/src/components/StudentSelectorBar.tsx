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

  const counts = {
    ALL: students.length,
    ON_TRACK: students.filter((s) => s.prediction === 'ON_TRACK').length,
    NEEDS_ATTENTION: students.filter((s) => s.prediction === 'NEEDS_ATTENTION').length,
    AT_RISK: students.filter((s) => s.prediction === 'AT_RISK').length,
  };

  const getBadgeIcon = (pred: string) => {
    switch (pred) {
      case 'ON_TRACK':
        return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'AT_RISK':
        return <AlertTriangle size={14} className="text-rose-400" />;
      default:
        return <Clock size={14} className="text-amber-400" />;
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
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              Student Directory & Performance Logs
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                {students.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select a student profile to inspect granular attendance logs and live predictions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center w-full sm:w-64">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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

