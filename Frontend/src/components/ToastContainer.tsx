import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

export function ToastContainer() {
  const { toast, hideToast } = useUI();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 text-white text-xs font-semibold"
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
          {toast.type === 'error' && <AlertTriangle size={16} className="text-rose-400" />}
          {toast.type === 'info' && <Sparkles size={16} className="text-indigo-400 animate-pulse" />}

          <span>{toast.message}</span>

          <button
            onClick={hideToast}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
