import { motion } from 'framer-motion';
import { Cpu, ArrowRight } from 'lucide-react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl mt-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <Cpu size={22} className="animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">End-to-End Prediction & Intervention Architecture</h3>
          <p className="text-xs text-slate-400">Automated machine learning inference and recommendations workflow</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between gap-2 text-left relative group hover:border-indigo-500/50 hover:bg-slate-900 transition-all"
          >
            <span className="text-[10px] font-extrabold font-mono text-indigo-400 tracking-wider">
              STEP {step.num}
            </span>
            <span className="text-xs font-bold text-slate-200 leading-tight">
              {step.title}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

