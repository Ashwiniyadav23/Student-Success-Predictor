import { type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { StudentInput } from '../types/prediction';
import { useAppDispatch, useAppSelector } from '../store';
import { setInputField, fetchPrediction } from '../store/predictionSlice';

type PredictFormProps = {
  formState?: StudentInput;
  onChangeField?: <K extends keyof StudentInput>(field: K, value: number) => void;
  isSubmitting?: boolean;
  onSubmit?: () => void;
};

type FieldConfig = {
  key: keyof StudentInput;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  getBadge: (val: number) => { text: string; bgStyle: string };
};

const ACADEMIC_FIELDS: FieldConfig[] = [
  {
    key: 'attendance',
    label: 'Attendance Rate',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    getBadge: (val) =>
      val >= 80
        ? { text: 'Good', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 65
        ? { text: 'Average', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'Low Attendance', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'On Schedule', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 60
        ? { text: 'Pending Work', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'Behind Schedule', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'Strong', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 60
        ? { text: 'Moderate', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'Low Test Scores', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'High Practice', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 5
        ? { text: 'Moderate', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'Needs Practice', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'Active Finisher', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 2
        ? { text: 'In Progress', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'Low Goals', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'Portfolio Ready', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 1
        ? { text: 'Building', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'No Projects', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
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
        ? { text: 'Interview Ready', bgStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : val >= 1
        ? { text: 'Basic Practice', bgStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
        : { text: 'No Practice', bgStyle: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  },
];

export function PredictForm({
  formState: propState,
  onChangeField: propOnChange,
  isSubmitting: propSubmitting,
  onSubmit: propOnSubmit,
}: PredictFormProps) {
  const dispatch = useAppDispatch();
  const reduxState = useAppSelector((state) => state.prediction.input);
  const reduxStatus = useAppSelector((state) => state.prediction.status);

  const currentInput = propState || reduxState;
  const loading = propSubmitting ?? (reduxStatus === 'loading');

  function handleChange<K extends keyof StudentInput>(field: K, value: number) {
    if (propOnChange) {
      propOnChange(field, value);
    } else {
      dispatch(setInputField({ field, value }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (propOnSubmit) {
      propOnSubmit();
    } else {
      dispatch(fetchPrediction(currentInput));
    }
  }

  const renderFieldCard = (config: FieldConfig, index: number) => {
    const val = Number(currentInput[config.key]);
    const badge = config.getBadge(val);
    const pct = ((val - config.min) / (config.max - config.min)) * 100;

    return (
      <motion.div
        key={config.key}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="input-card"
      >
        <div className="input-card-header flex items-center justify-between mb-2">
          <div className="field-name-group flex items-center justify-between w-full">
            <span className="field-label-text text-xs font-bold text-slate-300">{config.label}</span>
            <span className={`field-badge text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badge.bgStyle}`}>
              {badge.text}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 font-bold">{config.min}</span>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={val}
            className="range-slider flex-1 accent-indigo-500"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${pct}%, rgba(51, 65, 85, 0.85) ${pct}%, rgba(51, 65, 85, 0.85) 100%)`,
            }}
            onChange={(e) => handleChange(config.key, Number(e.target.value))}
          />
          <span className="text-[10px] font-mono text-slate-400 font-bold">
            {val} {config.unit}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="panel p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="panel-header border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-indigo-400" />
            Student Input Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Adjust metrics or click scenario presets to test ML predictions</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider">
          <GraduationCap size={16} />
          <span>Academic Performance</span>
        </div>
        <div className="flex flex-col gap-3">{ACADEMIC_FIELDS.map((cfg, i) => renderFieldCard(cfg, i))}</div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-3 uppercase tracking-wider">
          <Code2 size={16} />
          <span>Practical Engagement</span>
        </div>
        <div className="flex flex-col gap-3">{ENGAGEMENT_FIELDS.map((cfg, i) => renderFieldCard(cfg, i + 3))}</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="submit-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-400/30"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Analyzing Risk Model...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} className="animate-pulse" />
            <span>Run Student Risk Prediction</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
