import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Award, Sliders } from 'lucide-react';
import type { StudentInput } from '../types/prediction';

type PresetsBarProps = {
  onSelectPreset: (preset: StudentInput) => void;
};

export const PRESETS: Record<string, { label: string; icon: typeof AlertTriangle; type: string; data: StudentInput }> = {
  risk: {
    label: 'High Risk Student',
    icon: AlertTriangle,
    type: 'risk-btn',
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
  attention: {
    label: 'Needs Attention',
    icon: Clock,
    type: 'attention-btn',
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
  star: {
    label: 'Star Performer',
    icon: Award,
    type: 'track-btn',
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
};

export function PresetsBar({ onSelectPreset }: PresetsBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="presets-container"
    >
      <div className="presets-label">
        <Sliders size={16} />
        <span>Quick Demo Presets:</span>
      </div>

      <div className="presets-buttons">
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
              className={`preset-btn ${preset.type}`}
              onClick={() => onSelectPreset(preset.data)}
            >
              <Icon size={15} />
              <span>{preset.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
