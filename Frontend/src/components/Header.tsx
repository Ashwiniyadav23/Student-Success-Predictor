import { Sparkles, Activity, RefreshCw } from 'lucide-react';

type HeaderProps = {
  isApiConnected: boolean;
  onReset: () => void;
};

export function Header({ isApiConnected, onReset }: HeaderProps) {
  return (
    <header className="app-navbar">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="brand-title-group">
          <h1>
            Student Success Predictor
            <span className="version-badge">ML Core v2.0</span>
          </h1>
          <p className="brand-subtitle">AI-Driven Risk Analytics & Student Performance Engine</p>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="api-status-tag">
          <div className="api-status-dot" />
          <span>{isApiConnected ? 'FastAPI Backend Ready' : 'Interactive Mode'}</span>
        </div>

        <button className="btn-secondary" onClick={onReset} title="Reset to initial values">
          <RefreshCw size={14} />
          <span>Reset Form</span>
        </button>
      </div>
    </header>
  );
}
