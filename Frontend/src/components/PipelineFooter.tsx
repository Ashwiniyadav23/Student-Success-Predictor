import { Cpu } from 'lucide-react';

export function PipelineFooter() {
  const steps = [
    { num: '01', title: 'Student Metrics Input' },
    { num: '02', title: 'FastAPI Validation' },
    { num: '03', title: 'ML Risk Classification' },
    { num: '04', title: 'Probability Mapping' },
    { num: '05', title: 'Risk Factor Analysis' },
    { num: '06', title: '7-Day Action Plan' },
    { num: '07', title: 'RAG Learning Recommendations' },
  ];

  return (
    <section className="architecture-footer-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Cpu size={20} className="gradient-accent-text" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>End-to-End Prediction & Intervention Pipeline</h3>
      </div>
      <div className="pipeline-steps">
        {steps.map((step) => (
          <div key={step.num} className="pipeline-step-card">
            <span className="step-num">STEP {step.num}</span>
            <span>{step.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
