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
    <div className="presets-container">
      <div className="presets-label">
        <Sliders size={16} />
        <span>Quick Demo Presets:</span>
      </div>

      <div className="presets-buttons">
        {Object.entries(PRESETS).map(([key, preset]) => {
          const Icon = preset.icon;
          return (
            <button
              key={key}
              className={`preset-btn ${preset.type}`}
              onClick={() => onSelectPreset(preset.data)}
            >
              <Icon size={15} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
