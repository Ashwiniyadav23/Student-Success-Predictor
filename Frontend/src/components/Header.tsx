import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Cpu, Activity } from 'lucide-react';


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
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="app-navbar"
    >
      <div className="brand-section">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="brand-icon-wrapper"
        >
          <Sparkles size={22} className="brand-sparkle-icon" />
        </motion.div>
        <div className="brand-title-group">
          <h1>
            <span className="gradient-brand-text">Student Success Predictor</span>
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
              className="version-badge"
            >
              <Cpu size={11} /> ML Engine v2.0
            </motion.span>
          </h1>
          <p className="brand-subtitle text-xs md:text-sm text-slate-400 mt-0.5">
            AI-Driven Student Attendance Tracking & Performance Analytics Platform
          </p>
        </div>
      </div>

      <div className="navbar-actions">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`api-status-tag ${isApiConnected ? 'connected' : 'fallback'}`}
        >
          <div className="api-status-dot" />
          <Activity size={13} />
          <span>{isApiConnected ? 'FastAPI Service Online' : 'Interactive Analytics Mode'}</span>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary" 
          onClick={onReset} 
          title="Reset dashboard to default"
        >
          <RefreshCw size={14} className="reset-icon" />
          <span>Reset View</span>
        </motion.button>
      </div>
    </motion.header>
  );
}

