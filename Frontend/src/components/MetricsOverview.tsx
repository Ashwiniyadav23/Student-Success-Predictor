import { motion } from 'framer-motion';
import { GraduationCap, Code2, FolderCheck, ShieldAlert } from 'lucide-react';
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

  const kpis = [
    {
      title: 'Overall Health Score',
      val: `${healthScore}/100`,
      footer: healthScore >= 75 ? 'Low Risk Status' : healthScore >= 55 ? 'Moderate Watch' : 'High Priority Alert',
      icon: ShieldAlert,
      color: healthScore >= 75 ? 'emerald' : healthScore >= 55 ? 'amber' : 'indigo',
      percent: healthScore,
    },
    {
      title: 'Academic Score',
      val: `${academicAvg}%`,
      footer: 'Avg of attendance & tests',
      icon: GraduationCap,
      color: 'indigo',
      percent: academicAvg,
    },
    {
      title: 'Coding Commitment',
      val: `${input.coding_hours} hrs/wk`,
      footer: 'Target: 10+ hrs/week',
      icon: Code2,
      color: 'cyan',
      percent: Math.min(100, (input.coding_hours / 15) * 100),
    },
    {
      title: 'Completed Projects',
      val: `${input.projects_completed}`,
      footer: `${input.goals_completed} micro-goals done`,
      icon: FolderCheck,
      color: 'amber',
      percent: Math.min(100, (input.projects_completed / 5) * 100),
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
            <div className="kpi-value">{kpi.val}</div>
            
            {/* Animated mini fill bar */}
            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden my-2 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${kpi.percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 + idx * 0.08 }}
                className={`h-full rounded-full ${
                  kpi.color === 'emerald'
                    ? 'bg-emerald-400'
                    : kpi.color === 'amber'
                    ? 'bg-amber-400'
                    : kpi.color === 'cyan'
                    ? 'bg-cyan-400'
                    : 'bg-indigo-500'
                }`}
              />
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

