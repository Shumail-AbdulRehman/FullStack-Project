import React from 'react';
import { motion } from 'framer-motion';


function LoadingSpinner({ className = '', size = 'default', fullScreen = true }) {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  const Spinner = () => (
    <div className={`relative ${spinnerSize} ${className}`}>
      {/* Outer ring with gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, oklch(0.65 0.25 285), transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Inner circle */}
      <div className="absolute inset-[3px] rounded-full bg-[#0a0a0f]" />

      {/* Center glow dot */}
      <motion.div
        className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-violet-500"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          boxShadow: '0 0 20px oklch(0.65 0.25 285 / 0.6)'
        }}
      />
    </div>
  );

  if (!fullScreen) {
    return <Spinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6">
        <Spinner />

        {/* Loading text with shimmer effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1"
        >
          <span className="text-sm font-medium text-zinc-400">Loading</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-violet-400"
          >
            ...
          </motion.span>
        </motion.div>

        {/* Subtle glow underneath */}
        <div
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.65 0.25 285) 0%, transparent 70%)'
          }}
        />
      </div>
    </motion.div>
  );
}

export default LoadingSpinner;