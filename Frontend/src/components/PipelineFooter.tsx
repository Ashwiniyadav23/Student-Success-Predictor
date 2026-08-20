import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export function PipelineFooter() {
  const steps = [
    { num: '01', title: 'Student Metrics Input' },
    { num: '02', title: 'FastAPI Validation' },
    { num: '03', title: 'ML Risk Classification' },
    { num: '04', title: 'Probability Mapping' },
    { num: '05', title: 'Risk Factor Analysis' },
    { num: '06', title: '7-Day Action Plan' },
    { num: '07', title: 'AI Recommendations' },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="architecture-footer-panel"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Cpu size={20} className="gradient-accent-text" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>End-to-End Prediction & Intervention Pipeline</h3>
      </div>
      <div className="pipeline-steps">
        {steps.map((step, idx) => (
          <motion.div 
            key={step.num}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="pipeline-step-card"
          >
            <span className="step-num">STEP {step.num}</span>
            <span>{step.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

