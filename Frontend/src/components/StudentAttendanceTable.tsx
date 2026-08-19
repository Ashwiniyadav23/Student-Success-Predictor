import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, CalendarCheck, AlertCircle, Clock, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import type { StudentProfile, AttendanceRecord } from '../types/prediction';

interface StudentAttendanceTableProps {
  student: StudentProfile;
}

export const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({ student }) => {
  const records = student.attendance_records || [];
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const totalRecords = records.length;

  const getStatusBadgeClass = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT':
        return 'badge-status-present';
      case 'ABSENT':
        return 'badge-status-absent';
      case 'LATE':
        return 'badge-status-late';
      default:
        return 'badge-status-excused';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle2 size={13} />;
      case 'ABSENT':
        return <AlertCircle size={13} />;
      case 'LATE':
        return <Clock size={13} />;
      default:
        return <UserCheck size={13} />;
    }
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case 'ON_TRACK':
        return (
          <span className="student-risk-badge on-track">
            <CheckCircle2 size={13} /> On Track
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="student-risk-badge risk">
            <ShieldAlert size={13} /> At Risk
          </span>
        );
      default:
        return (
          <span className="student-risk-badge attention">
            <Clock size={13} /> Needs Attention
          </span>
        );
    }
  };

  return (
    <motion.div 
      key={student.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="student-attendance-card"
    >
      <div className="student-card-header">
        <div className="student-info-main">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="student-avatar-ring"
          >
            <div className="student-avatar">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </motion.div>

          <div className="student-meta-details">
            <div className="student-name-row">
              <h3 className="student-name">{student.name}</h3>
              {getPredictionBadge(student.prediction)}
            </div>
            <p className="student-email">{student.email}</p>
            <div className="student-id-row">
              <span className="student-id-tag">Student ID: {student.id}</span>
              <span className="student-stat-tag">
                <Award size={12} /> {student.projects_completed} Projects Built
              </span>
            </div>
          </div>
        </div>

        <div className="student-attendance-summary">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="attendance-percentage-box"
          >
            <span className="attendance-val">{student.attendance.toFixed(1)}%</span>
            <span className="attendance-lbl">Overall Attendance Rate</span>
          </motion.div>
        </div>
      </div>

      <div className="attendance-stats-pills">
        {[
          { key: 'present', class: 'present', icon: UserCheck, count: presentCount, label: 'Present Days' },
          { key: 'absent', class: 'absent', icon: AlertCircle, count: absentCount, label: 'Absences' },
          { key: 'late', class: 'late', icon: Clock, count: lateCount, label: 'Late Logs' },
          { key: 'total', class: 'total', icon: CalendarCheck, count: totalRecords, label: 'Tracked Sessions' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`stat-pill ${item.class}`}
            >
              <div className="stat-pill-icon">
                <Icon size={16} />
              </div>
              <div>
                <span className="stat-num">{item.count}</span>
                <span className="stat-txt">{item.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="table-responsive">
        <div className="table-header-flex">
          <h4 className="records-table-title">Individual Attendance History & Session Log</h4>
          <span className="records-count-badge">{records.length} Logs Recorded</span>
        </div>

        <table className="attendance-records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Session / Workshop</th>
              <th>Status</th>
              <th>Mentor Notes & Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((rec, idx) => (
                <motion.tr 
                  key={`${rec.date}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  <td className="cell-date">{rec.date}</td>
                  <td className="cell-session">{rec.session_name}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(rec.status)}`}>
                      {getStatusIcon(rec.status)}
                      <span>{rec.status}</span>
                    </span>
                  </td>
                  <td className="cell-notes">{rec.notes || '—'}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-records">
                  No individual attendance records logged for this student.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
