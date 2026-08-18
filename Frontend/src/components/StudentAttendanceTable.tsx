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
      className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mb-6"
    >
      {/* Student Profile Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25">
            <div className="w-16 h-16 rounded-full bg-slate-950 text-white font-extrabold text-xl flex items-center justify-center">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </div>

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

        {/* Rate Gauge Badge */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 min-w-[210px]"
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={157}
                initial={{ strokeDashoffset: 157 }}
                animate={{ strokeDashoffset: 157 - (157 * student.attendance) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                className="text-emerald-400"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black text-white font-mono">
              {Math.round(student.attendance)}%
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono leading-none">
              {student.attendance.toFixed(1)}%
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">
              Overall Attendance Rate
            </span>
          </div>
        </motion.div>
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        {[
          { icon: <UserCheck size={18} />, num: presentCount, label: 'Present Days', color: 'emerald', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
          { icon: <AlertCircle size={18} />, num: absentCount, label: 'Absences', color: 'rose', bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
          { icon: <Clock size={18} />, num: lateCount, label: 'Late Logs', color: 'amber', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
          { icon: <CalendarCheck size={18} />, num: totalRecords, label: 'Tracked Sessions', color: 'indigo', bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -2 }}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 bg-slate-900/60 ${stat.bg}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block font-mono leading-none">{stat.num}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mt-1">{stat.label}</span>
            </div>
          </motion.div>
        ))}
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

        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Session / Workshop</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Mentor Notes & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {records.length > 0 ? (
                records.map((rec, idx) => (
                  <motion.tr 
                    key={`${rec.date}-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-300">{rec.date}</td>
                    <td className="p-3.5 font-semibold text-slate-200">{rec.session_name}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getStatusBadgeStyle(rec.status)}`}>
                        {getStatusIcon(rec.status)}
                        <span>{rec.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{rec.notes || '—'}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    No individual attendance records logged for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

