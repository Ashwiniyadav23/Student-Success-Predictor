import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, CalendarCheck, AlertCircle, Clock, CheckCircle2, ShieldAlert, Award, FileText } from 'lucide-react';
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

  const getStatusBadgeStyle = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10';
      case 'ABSENT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-500/10';
      case 'LATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
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
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 uppercase tracking-wide">
            <CheckCircle2 size={14} className="text-emerald-400" /> On Track
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 uppercase tracking-wide">
            <ShieldAlert size={14} className="text-rose-400" /> At Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 uppercase tracking-wide">
            <Clock size={14} className="text-amber-400" /> Needs Attention
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

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl md:text-2xl font-black text-white">{student.name}</h3>
              {getPredictionBadge(student.prediction)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{student.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono font-semibold">
                ID: {student.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1">
                <Award size={12} className="text-cyan-400" /> {student.projects_completed} Projects Built
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

      {/* Table Section */}
      <div className="overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <FileText size={16} className="text-indigo-400" />
            Attendance History & Session Remarks
          </h4>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {records.length} Logs
          </span>
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
                    <span className={`status-badge ${getStatusBadgeStyle(rec.status)}`}>

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

