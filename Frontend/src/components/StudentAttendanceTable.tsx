import React from 'react';
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
    <div className="student-attendance-card">
      <div className="student-card-header">
        <div className="student-info-main">
          <div className="student-avatar-ring">
            <div className="student-avatar">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>

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
          <div className="attendance-percentage-box">
            <span className="attendance-val">{student.attendance.toFixed(1)}%</span>
            <span className="attendance-lbl">Overall Attendance Rate</span>
          </div>
        </div>
      </div>

      <div className="attendance-stats-pills">
        <div className="stat-pill present">
          <div className="stat-pill-icon">
            <UserCheck size={16} />
          </div>
          <div>
            <span className="stat-num">{presentCount}</span>
            <span className="stat-txt">Present Days</span>
          </div>
        </div>

        <div className="stat-pill absent">
          <div className="stat-pill-icon">
            <AlertCircle size={16} />
          </div>
          <div>
            <span className="stat-num">{absentCount}</span>
            <span className="stat-txt">Absences</span>
          </div>
        </div>

        <div className="stat-pill late">
          <div className="stat-pill-icon">
            <Clock size={16} />
          </div>
          <div>
            <span className="stat-num">{lateCount}</span>
            <span className="stat-txt">Late Logs</span>
          </div>
        </div>

        <div className="stat-pill total">
          <div className="stat-pill-icon">
            <CalendarCheck size={16} />
          </div>
          <div>
            <span className="stat-num">{totalRecords}</span>
            <span className="stat-txt">Tracked Sessions</span>
          </div>
        </div>
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
                <tr key={`${rec.date}-${idx}`}>
                  <td className="cell-date">{rec.date}</td>
                  <td className="cell-session">{rec.session_name}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(rec.status)}`}>
                      {getStatusIcon(rec.status)}
                      <span>{rec.status}</span>
                    </span>
                  </td>
                  <td className="cell-notes">{rec.notes || '—'}</td>
                </tr>
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
    </div>
  );
};
