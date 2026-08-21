import { motion } from 'framer-motion';
import { GraduationCap, Code2, FolderCheck, ShieldAlert, Sparkles } from 'lucide-react';
import type { StudentInput } from '../types/prediction';
import { useAppSelector } from '../store';

type MetricsOverviewProps = {
  input?: StudentInput;
};

export function MetricsOverview({ input: propInput }: MetricsOverviewProps) {
  const storeInput = useAppSelector((state) => state.prediction.input);
  const input = propInput || storeInput;

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
      isSpecialGauge: true,
    },
    {
      title: 'Academic Score',
      val: `${academicAvg}%`,
      footer: 'Avg of attendance & tests',
      icon: GraduationCap,
      color: 'indigo',
      percent: academicAvg,
      isSpecialGauge: false,
    },
    {
      title: 'Coding Commitment',
      val: `${input.coding_hours} hrs/wk`,
      footer: 'Target: 10+ hrs/week',
      icon: Code2,
      color: 'cyan',
      percent: Math.min(100, (input.coding_hours / 15) * 100),
      isSpecialGauge: false,
    },
    {
      title: 'Completed Projects',
      val: `${input.projects_completed}`,
      footer: `${input.goals_completed} micro-goals done`,
      icon: FolderCheck,
      color: 'amber',
      percent: Math.min(100, (input.projects_completed / 5) * 100),
      isSpecialGauge: false,
    },
  ];

  return (
    <div className="metrics-kpi-grid">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`kpi-card relative overflow-hidden transition-all duration-300 ${
              kpi.isSpecialGauge ? 'border-indigo-500/40 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950' : ''
            }`}
          >
            <div className="kpi-header">
              <span className="kpi-title flex items-center gap-1.5">
                {kpi.title}
                {kpi.isSpecialGauge && <Sparkles size={12} className="text-amber-400 animate-pulse" />}
              </span>
              <div className={`kpi-icon ${kpi.color}`}>
                <Icon size={18} />
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
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                    : kpi.color === 'amber'
                    ? 'bg-amber-400 shadow-sm shadow-amber-400'
                    : kpi.color === 'cyan'
                    ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                    : 'bg-indigo-500 shadow-sm shadow-indigo-500'
                }`}
              />
            </div>

            <div className="kpi-footer">
              <span>{kpi.footer}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
