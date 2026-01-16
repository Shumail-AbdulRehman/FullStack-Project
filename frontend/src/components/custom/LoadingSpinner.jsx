import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 80, text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50">
      {/* Animated Spinner */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 size={size} className="text-blue-500" strokeWidth={2.5} />
      </motion.div>

      {/* Pulsing Ring Effect */}
      <motion.div
        className="absolute border-4 border-blue-500/30 rounded-full"
        style={{ width: size + 20, height: size + 20 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        }}
      />

      {/* Loading Text */}
      {text && (
        <motion.p
          className="mt-8 text-zinc-300 font-semibold text-lg tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: 'reverse',
          }}
        >
          {text}
        </motion.p>
      )}

      {/* Dots Animation */}
      <div className="flex gap-2 mt-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
