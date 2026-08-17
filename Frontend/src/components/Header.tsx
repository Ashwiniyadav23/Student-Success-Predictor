import { Sparkles, RefreshCw, Cpu, Activity } from 'lucide-react';

type HeaderProps = {
  isApiConnected: boolean;
  onReset: () => void;
};

export function Header({ isApiConnected, onReset }: HeaderProps) {
  return (
    <header className="app-navbar">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Sparkles size={22} className="brand-sparkle-icon" />
        </div>
        <div className="brand-title-group">
          <h1>
            <span className="gradient-brand-text">Student Success Predictor</span>
            <span className="version-badge">
              <Cpu size={11} /> ML Engine v2.0
            </span>
          </h1>
          <p className="brand-subtitle">
            AI-Driven Student Attendance Tracking & Risk Prediction Platform
          </p>
        </div>
      </div>

      <div className="navbar-actions">
        <div className={`api-status-tag ${isApiConnected ? 'connected' : 'fallback'}`}>
          <div className="api-status-dot" />
          <Activity size={13} />
          <span>{isApiConnected ? 'FastAPI Service Online' : 'Interactive Analytics Mode'}</span>
        </div>

        <button className="btn-secondary" onClick={onReset} title="Reset dashboard to default">
          <RefreshCw size={14} className="reset-icon" />
          <span>Reset View</span>
        </button>
      </div>
    </header>
  );
}
