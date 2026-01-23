import React from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 60, text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0f0f0f] z-50">
      
      <div className="relative flex items-center justify-center">
        <motion.div
          className="relative z-10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 
            size={size} 
            className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
            strokeWidth={2.5} 
          />
        </motion.div>

        <motion.div
          className="absolute border-4 border-red-600/20 rounded-full"
          style={{ width: size + 30, height: size + 30 }}
          animate={{
            scale: [1, 1.1, 1], 
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
        
         <div className="absolute inset-0 bg-red-600/5 blur-xl rounded-full" />
      </div>

      {text && (
        <div className="mt-8 flex flex-col items-center">
          <motion.p
            className="text-white font-medium text-lg tracking-wider font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {text}
          </motion.p>
          
          <div className="flex gap-2 mt-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-red-600 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
=======

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
>>>>>>> 4d1eafa (impoved frontend UI)

export default LoadingSpinner;