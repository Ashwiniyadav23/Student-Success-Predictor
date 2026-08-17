import React from 'react';
import type { StudentProfile, AttendanceRecord } from '../types/prediction';

interface StudentAttendanceTableProps {
  student: StudentProfile;
}

export const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({ student }) => {
  const records = student.attendance_records || [];
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const lateCount = records.filter(r => r.status === 'LATE').length;

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

  return (
    <div className="student-attendance-card">
      <div className="student-card-header">
        <div className="student-info-main">
          <div className="student-avatar">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="student-name">{student.name}</h3>
            <p className="student-email">{student.email}</p>
            <span className="student-id-tag">ID: {student.id}</span>
          </div>
        </div>

        <div className="student-attendance-summary">
          <div className="attendance-percentage-box">
            <span className="attendance-val">{student.attendance.toFixed(1)}%</span>
            <span className="attendance-lbl">Attendance Percentage</span>
          </div>
        </div>
      </div>

      <div className="attendance-stats-pills">
        <div className="stat-pill present">
          <span className="stat-num">{presentCount}</span>
          <span className="stat-txt">Present</span>
        </div>
        <div className="stat-pill absent">
          <span className="stat-num">{absentCount}</span>
          <span className="stat-txt">Absent</span>
        </div>
        <div className="stat-pill late">
          <span className="stat-num">{lateCount}</span>
          <span className="stat-txt">Late</span>
        </div>
        <div className="stat-pill total">
          <span className="stat-num">{records.length}</span>
          <span className="stat-txt">Total Records</span>
        </div>
      </div>

      <div className="table-responsive">
        <h4 className="records-table-title">Individual Attendance Records & Session Logs</h4>
        <table className="attendance-records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Session Name</th>
              <th>Status</th>
              <th>Notes / Remarks</th>
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
                      {rec.status}
                    </span>
                  </td>
                  <td className="cell-notes">{rec.notes || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-records">
                  No individual attendance records found for this student.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
