import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Cpu, Activity, Zap } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
  isApiConnected: boolean;
  onReset: () => void;
};

export function Header({ isApiConnected, onReset }: HeaderProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleResetClick = () => {
    setIsRotating(true);
    onReset();
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="app-navbar flex flex-wrap items-center justify-between gap-4 p-4 md:px-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mb-6"
    >
      <div className="brand-section flex items-center gap-3.5">
        <motion.div 
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="brand-icon-wrapper w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"
        >
          <Sparkles size={24} className="animate-pulse" />
        </motion.div>
        <div className="brand-title-group">
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2.5 flex-wrap">
            <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Student Success Predictor
            </span>
            <span className="version-badge text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Cpu size={12} className="text-indigo-400" /> ML Engine v2.0
            </span>
          </h1>
          <p className="brand-subtitle text-xs md:text-sm text-slate-400 mt-0.5">
            AI-Driven Student Attendance Tracking & Performance Analytics Platform
          </p>
        </div>
      </div>

      <div className="navbar-actions flex items-center gap-3">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`api-status-tag flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
            isApiConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/20'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isApiConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isApiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <Activity size={14} />
          <span>{isApiConnected ? 'FastAPI Service Live' : 'Interactive Demo Mode'}</span>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-secondary flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/90 hover:border-indigo-500/50 text-xs font-semibold shadow-md transition-all"
          onClick={handleResetClick}
          title="Reset dashboard to default view"
        >
          <motion.div animate={{ rotate: isRotating ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <RefreshCw size={14} className="text-indigo-400" />
          </motion.div>
          <span>Reset View</span>
        </motion.button>
      </div>
    </motion.header>
  );
}

