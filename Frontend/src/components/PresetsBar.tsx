import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Award, Sliders, Zap } from 'lucide-react';
import type { StudentInput } from '../types/prediction';
import { useAppDispatch } from '../store';
import { setStudentInput } from '../store/predictionSlice';
import { useUI } from '../context/UIContext';

type PresetsBarProps = {
  onSelectPreset?: (preset: StudentInput) => void;
};

export const PRESETS: Record<string, { label: string; icon: typeof AlertTriangle; bgStyle: string; data: StudentInput }> = {
  star: {
    label: 'Star Performer',
    icon: Award,
    bgStyle: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10',
    data: {
      attendance: 95,
      assignment_completion: 92,
      test_average: 91,
      coding_hours: 14,
      goals_completed: 8,
      projects_completed: 4,
      interview_practice_hours: 6,
    },
  },
  attention: {
    label: 'Needs Attention',
    icon: Clock,
    bgStyle: 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-amber-500/10',
    data: {
      attendance: 72,
      assignment_completion: 68,
      test_average: 65,
      coding_hours: 5,
      goals_completed: 3,
      projects_completed: 1,
      interview_practice_hours: 2,
    },
  },
  risk: {
    label: 'High Risk Student',
    icon: AlertTriangle,
    bgStyle: 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 shadow-rose-500/10',
    data: {
      attendance: 42,
      assignment_completion: 45,
      test_average: 50,
      coding_hours: 2,
      goals_completed: 1,
      projects_completed: 0,
      interview_practice_hours: 0,
    },
  },
  coding: {
    label: 'High Coding Focus',
    icon: Zap,
    bgStyle: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25 shadow-indigo-500/10',
    data: {
      attendance: 88,
      assignment_completion: 85,
      test_average: 82,
      coding_hours: 16,
      goals_completed: 6,
      projects_completed: 3,
      interview_practice_hours: 4,
    },
  },
};

export function PresetsBar({ onSelectPreset }: PresetsBarProps) {
  const dispatch = useAppDispatch();
  const { showToast } = useUI();

  const handleSelect = (label: string, data: StudentInput) => {
    dispatch(setStudentInput(data));
    if (onSelectPreset) onSelectPreset(data);
    showToast(`Loaded "${label}" scenario preset`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="presets-container flex items-center justify-between gap-4 p-4 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mb-6 flex-wrap"
    >
      <div className="presets-label flex items-center gap-2 text-xs font-bold text-slate-300">
        <Sliders size={16} className="text-indigo-400" />
        <span>Quick Scenario Presets:</span>
      </div>

      <div className="presets-buttons flex items-center gap-3.5 flex-wrap">
        {Object.entries(PRESETS).map(([key, preset], idx) => {
          const Icon = preset.icon;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`preset-btn flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md transition-all cursor-pointer ${preset.bgStyle}`}
              onClick={() => handleSelect(preset.label, preset.data)}
            >
              <Icon size={14} />
              <span>{preset.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
