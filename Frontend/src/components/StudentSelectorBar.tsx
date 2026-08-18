import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, CheckCircle2, AlertTriangle, Clock, Search, Filter, Sparkles } from 'lucide-react';
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="student-selector-container p-5 md:p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
            <User size={22} />
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

          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 gap-1 text-xs">
            {[
              { key: 'ALL', label: 'All', count: counts.ALL, activeClass: 'bg-indigo-600 text-white' },
              { key: 'ON_TRACK', label: 'On Track', count: counts.ON_TRACK, activeClass: 'bg-emerald-600 text-white' },
              { key: 'NEEDS_ATTENTION', label: 'Attention', count: counts.NEEDS_ATTENTION, activeClass: 'bg-amber-600 text-white' },
              { key: 'AT_RISK', label: 'At Risk', count: counts.AT_RISK, activeClass: 'bg-rose-600 text-white' },
            ].map((tab) => {
              const isActive = filterStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`relative px-3 py-1.5 rounded-lg font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive ? tab.activeClass + ' shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <AnimatePresence mode="popLayout">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <motion.button
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectStudent(student)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl min-w-[250px] border transition-all text-left relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border-indigo-500/80 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                      {student.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                        student.prediction === 'ON_TRACK'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                          : student.prediction === 'AT_RISK'
                          ? 'bg-rose-400 shadow-sm shadow-rose-400'
                          : 'bg-amber-400 shadow-sm shadow-amber-400'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-white truncate">{student.name}</span>
                      {getBadgeIcon(student.prediction)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span className="truncate max-w-[120px] text-slate-400 flex items-center gap-1">
                        <Mail size={11} className="text-slate-500" />
                        {student.email.split('@')[0]}
                      </span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Calendar size={11} className="text-emerald-500" />
                        {student.attendance.toFixed(1)}%
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
              className="flex items-center justify-center gap-2 py-8 w-full text-slate-400 text-xs"
            >
              <Filter size={18} className="text-slate-500" />
              <span>No student profiles match your search criteria.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

