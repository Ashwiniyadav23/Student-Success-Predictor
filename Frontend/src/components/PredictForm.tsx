import { type FormEvent } from 'react';
import { GraduationCap, Code2, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { StudentInput } from '../types/prediction';

type PredictFormProps = {
  formState: StudentInput;
  onChangeField: <K extends keyof StudentInput>(field: K, value: number) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
};

type FieldConfig = {
  key: keyof StudentInput;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  getBadge: (val: number) => { text: string; type: 'good' | 'avg' | 'low' };
};

const ACADEMIC_FIELDS: FieldConfig[] = [
  {
    key: 'attendance',
    label: 'Attendance',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    getBadge: (val) =>
      val >= 80
        ? { text: 'Good', type: 'good' }
        : val >= 65
        ? { text: 'Average', type: 'avg' }
        : { text: 'Low Attendance', type: 'low' },
  },
  {
    key: 'assignment_completion',
    label: 'Assignment Completion',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    getBadge: (val) =>
      val >= 80
        ? { text: 'On Schedule', type: 'good' }
        : val >= 60
        ? { text: 'Pending Work', type: 'avg' }
        : { text: 'Behind Schedule', type: 'low' },
  },
  {
    key: 'test_average',
    label: 'Test Average Score',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    getBadge: (val) =>
      val >= 75
        ? { text: 'Strong', type: 'good' }
        : val >= 60
        ? { text: 'Moderate', type: 'avg' }
        : { text: 'Low Test Scores', type: 'low' },
  },
];

const ENGAGEMENT_FIELDS: FieldConfig[] = [
  {
    key: 'coding_hours',
    label: 'Weekly Coding Hours',
    min: 0,
    max: 40,
    step: 0.5,
    unit: 'hrs',
    getBadge: (val) =>
      val >= 10
        ? { text: 'High Practice', type: 'good' }
        : val >= 5
        ? { text: 'Moderate', type: 'avg' }
        : { text: 'Needs Practice', type: 'low' },
  },
  {
    key: 'goals_completed',
    label: 'Goals Completed',
    min: 0,
    max: 20,
    step: 1,
    unit: 'goals',
    getBadge: (val) =>
      val >= 5
        ? { text: 'Active Finisher', type: 'good' }
        : val >= 2
        ? { text: 'In Progress', type: 'avg' }
        : { text: 'Low Goals', type: 'low' },
  },
  {
    key: 'projects_completed',
    label: 'Projects Completed',
    min: 0,
    max: 10,
    step: 1,
    unit: 'projects',
    getBadge: (val) =>
      val >= 3
        ? { text: 'Portfolio Ready', type: 'good' }
        : val >= 1
        ? { text: 'Building', type: 'avg' }
        : { text: 'No Projects', type: 'low' },
  },
  {
    key: 'interview_practice_hours',
    label: 'Interview Practice',
    min: 0,
    max: 20,
    step: 0.5,
    unit: 'hrs/wk',
    getBadge: (val) =>
      val >= 4
        ? { text: 'Interview Ready', type: 'good' }
        : val >= 1
        ? { text: 'Basic Practice', type: 'avg' }
        : { text: 'No Practice', type: 'low' },
  },
];

export function PredictForm({
  formState,
  onChangeField,
  isSubmitting,
  onSubmit,
}: PredictFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const renderFieldCard = (config: FieldConfig) => {
    const val = Number(formState[config.key]);
    const badge = config.getBadge(val);

    return (
      <div key={config.key} className="input-card">
        <div className="input-card-header">
          <div className="field-name-group">
            <span className="field-label-text">{config.label}</span>
            <span className={`field-badge ${badge.type}`}>{badge.text}</span>
          </div>
          <input
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={val}
            className="number-input-box"
            onChange={(e) => onChangeField(config.key, Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div className="slider-container">
          <span className="min-max-label">{config.min}</span>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={val}
            className="range-slider"
            onChange={(e) => onChangeField(config.key, Number(e.target.value))}
          />
          <span className="min-max-label">
            {config.max}
            {config.unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">
            <SlidersHorizontal size={20} className="gradient-accent-text" />
            Student Input Parameters
          </h2>
          <p className="panel-subtitle">Adjust student metrics or use top presets above</p>
        </div>
      </div>

      <div className="form-section-title">
        <GraduationCap size={16} />
        <span>Academic Performance</span>
      </div>
      <div className="input-fields-stack">{ACADEMIC_FIELDS.map(renderFieldCard)}</div>

      <div className="form-section-title">
        <Code2 size={16} />
        <span>Practical Engagement</span>
      </div>
      <div className="input-fields-stack">{ENGAGEMENT_FIELDS.map(renderFieldCard)}</div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <div className="spinner" />
            <span>Analyzing Risk Model...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Run Student Risk Prediction</span>
          </>
        )}
      </button>
    </form>
  );
}
