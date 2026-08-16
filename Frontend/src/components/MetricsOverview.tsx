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

  const healthColorClass = healthScore >= 75 ? 'emerald' : healthScore >= 55 ? 'amber' : 'risk';

  return (
    <div className="metrics-kpi-grid">
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Overall Health Score</span>
          <div className={`kpi-icon ${healthScore >= 75 ? 'emerald' : healthScore >= 55 ? 'amber' : 'indigo'}`}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <div className="kpi-value">{healthScore}/100</div>
        <div className="kpi-footer">
          <span>{healthScore >= 75 ? 'Low Risk Status' : healthScore >= 55 ? 'Moderate Watch' : 'High Priority Alert'}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Academic Score</span>
          <div className="kpi-icon indigo">
            <GraduationCap size={18} />
          </div>
        </div>
        <div className="kpi-value">{academicAvg}%</div>
        <div className="kpi-footer">
          <span>Avg of attendance & tests</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Coding Commitment</span>
          <div className="kpi-icon cyan">
            <Code2 size={18} />
          </div>
        </div>
        <div className="kpi-value">{input.coding_hours} <span style={{ fontSize: '1rem', fontWeight: 500 }}>hrs/wk</span></div>
        <div className="kpi-footer">
          <span>Target: 10+ hrs/week</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Completed Projects</span>
          <div className="kpi-icon amber">
            <FolderCheck size={18} />
          </div>
        </div>
        <div className="kpi-value">{input.projects_completed}</div>
        <div className="kpi-footer">
          <span>{input.goals_completed} micro-goals done</span>
        </div>
      </div>
    </div>
  );
}
