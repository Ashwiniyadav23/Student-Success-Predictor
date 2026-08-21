import { motion } from 'framer-motion';
import { GraduationCap, Code2, FolderCheck, ShieldAlert, Activity, Sparkles, TrendingUp } from 'lucide-react';
import type { StudentInput } from '../types/prediction';

type MetricsOverviewProps = {
  input: StudentInput;
};

export function MetricsOverview({ input }: MetricsOverviewProps) {
  const academicAvg = Math.round((input.attendance + input.assignment_completion + input.test_average) / 3);
  
  // Calculate composite health score (0-100)
  const healthScore = Math.min(
    100,
    Math.round(
      academicAvg * 0.5 +
      Math.min(input.coding_hours * 5, 25) +
      Math.min(input.projects_completed * 8, 15.0) +
      Math.min(input.goals_completed * 2, 10.0)
    )
  );

  const getHealthBadge = (score: number) => {
    if (score >= 75) {
      return { label: 'Low Risk Status', color: 'emerald', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', progress: 'bg-emerald-500' };
    }
    if (score >= 55) {
      return { label: 'Moderate Watch', color: 'amber', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', progress: 'bg-amber-500' };
    }
    return { label: 'High Priority Alert', color: 'rose', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400', progress: 'bg-rose-500' };
  };

  const healthBadge = getHealthBadge(healthScore);

  const kpis = [
    {
      title: 'Overall Health Index',
      value: `${healthScore}/100`,
      icon: <ShieldAlert size={20} />,
      footer: healthBadge.label,
      bg: healthBadge.bg,
      progress: healthScore,
      progressBarBg: healthBadge.progress,
    },
    {
      title: 'Academic Score',
      value: `${academicAvg}%`,
      icon: <GraduationCap size={20} />,
      footer: 'Avg of attendance & test scores',
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      progress: academicAvg,
      progressBarBg: 'bg-indigo-500',
    },
    {
      title: 'Coding Commitment',
      value: `${input.coding_hours} hrs`,
      icon: <Code2 size={20} />,
      footer: 'Target: 10+ hrs/week',
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      progress: Math.min(100, Math.round((input.coding_hours / 15) * 100)),
      progressBarBg: 'bg-cyan-500',
    },
    {
      title: 'Completed Projects',
      value: `${input.projects_completed} Built`,
      icon: <FolderCheck size={20} />,
      footer: `${input.goals_completed} micro-goals completed`,
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      progress: Math.min(100, Math.round((input.projects_completed / 5) * 100)),
      progressBarBg: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.08 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="p-5 min-h-[155px] rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{kpi.title}</span>
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-inner ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight my-1">
              {kpi.value}
            </div>

            {/* Visual progress bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden my-2.5 border border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${kpi.progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${kpi.progressBarBg}`}
              />
            </div>
          </div>

          <div className="w-full text-[11px] font-bold text-slate-400 flex items-center justify-between pt-2.5 border-t border-slate-800/50 mt-2">
            <span>{kpi.footer}</span>
            <TrendingUp size={12} className="text-slate-500" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

