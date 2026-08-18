import { type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Sparkles, SlidersHorizontal, Plus, Minus } from 'lucide-react';
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
  formState,
  onChangeField,
  isSubmitting,
  onSubmit,
}: PredictFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const handleStep = (config: FieldConfig, delta: number) => {
    const currentVal = Number(formState[config.key]);
    const newVal = Math.min(config.max, Math.max(config.min, currentVal + delta));
    onChangeField(config.key, Number(newVal.toFixed(1)));
  };

  const renderFieldCard = (config: FieldConfig) => {
    const val = Number(formState[config.key]);
    const badge = config.getBadge(val);

    return (
      <motion.div 
        key={config.key}
        whileHover={{ scale: 1.01 }}
        className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md flex flex-col gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-200">{config.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bgStyle}`}>
              {badge.text}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleStep(config, -config.step)}
              className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              min={config.min}
              max={config.max}
              step={config.step}
              value={val}
              className="w-14 bg-transparent text-center text-xs font-mono font-bold text-indigo-300 focus:outline-none"
              onChange={(e) => onChangeField(config.key, Math.max(0, Number(e.target.value)))}
            />
            <button
              type="button"
              onClick={() => handleStep(config, config.step)}
              className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold"
            >
              <Plus size={11} />
            </button>
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
            className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            onChange={(e) => onChangeField(config.key, Number(e.target.value))}
          />
          <span className="text-[10px] font-mono text-slate-400 font-bold">
            {config.max}
            {config.unit}
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
      className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-indigo-400" />
            Student Input Parameters
          </h2>
          <p className="text-xs text-slate-400">Adjust metrics or click scenario presets to test ML predictions</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider">
          <GraduationCap size={16} />
          <span>Academic Performance</span>
        </div>
        <div className="flex flex-col gap-3">{ACADEMIC_FIELDS.map(renderFieldCard)}</div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-3 uppercase tracking-wider">
          <Code2 size={16} />
          <span>Practical Engagement</span>
        </div>
        <div className="flex flex-col gap-3">{ENGAGEMENT_FIELDS.map(renderFieldCard)}</div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 transition-all cursor-pointer mt-2" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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

