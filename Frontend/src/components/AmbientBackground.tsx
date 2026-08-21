import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';

export function AmbientBackground() {
  const { enableAmbientParticles } = useUI();

  if (!enableAmbientParticles) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Cyan/Indigo Blob */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-3xl"
      />

      {/* Secondary Emerald/Teal Blob */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tl from-emerald-600/15 via-teal-500/10 to-indigo-600/15 blur-3xl"
      />

      {/* Floating Micro Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 800 - 400,
            y: Math.random() * 600 - 300,
            opacity: 0.2 + Math.random() * 0.4,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, (i % 2 === 0 ? 50 : -50), 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
          className="absolute w-2 h-2 rounded-full bg-indigo-400/30 blur-[1px] shadow-lg shadow-indigo-500/20"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 14}%`,
          }}
        />
      ))}
    </div>
  );
}
