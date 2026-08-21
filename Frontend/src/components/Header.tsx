import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Cpu, Activity, Wand2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAppDispatch } from '../store';
import { resetInputState } from '../store/predictionSlice';

type HeaderProps = {
  isApiConnected?: boolean;
  onReset?: () => void;
};

export function Header({ isApiConnected = true, onReset }: HeaderProps) {
  const [isRotating, setIsRotating] = useState(false);
  const { enableAmbientParticles, toggleAmbientParticles, showToast } = useUI();
  const dispatch = useAppDispatch();

  const handleResetClick = () => {
    setIsRotating(true);
    dispatch(resetInputState());
    if (onReset) onReset();
    showToast('Dashboard reset to default parameters', 'info');
    setTimeout(() => setIsRotating(false), 600);
  };

  const handleToggleParticles = () => {
    toggleAmbientParticles();
    showToast(
      enableAmbientParticles ? 'Ambient particle effects disabled' : 'Ambient particle effects enabled',
      'info'
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="app-navbar flex items-center justify-between p-4 md:px-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mb-6"
    >
      <div className="brand-section flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="brand-icon-wrapper w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
        >
          <Sparkles size={20} className="text-white" />
        </motion.div>
        <div className="brand-title-group">
          <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <span className="gradient-brand-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Student Success Predictor
            </span>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
              className="version-badge px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center gap-1"
            >
              <Cpu size={10} /> Redux + RAG v2.5
            </motion.span>
          </h1>
          <p className="brand-subtitle text-xs text-slate-400 mt-0.5">
            AI-Driven Student Attendance Tracking & Performance Analytics Platform
          </p>
        </div>
      </div>

      <div className="navbar-actions flex items-center gap-3">
        {/* Context API Particle Animation Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleParticles}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-md transition-all cursor-pointer ${
            enableAmbientParticles
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle ambient background particle FX"
        >
          <Wand2 size={13} className={enableAmbientParticles ? 'text-indigo-400 animate-pulse' : ''} />
          <span>FX {enableAmbientParticles ? 'ON' : 'OFF'}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`api-status-tag flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            isApiConnected
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <Activity size={13} />
          <span>{isApiConnected ? 'FastAPI Online' : 'Analytics Mode'}</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold cursor-pointer"
          onClick={handleResetClick}
          title="Reset dashboard to default"
        >
          <RefreshCw size={13} className={isRotating ? 'animate-spin text-indigo-400' : ''} />
          <span>Reset</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
