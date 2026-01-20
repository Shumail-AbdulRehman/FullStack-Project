import React from 'react';
import { motion } from 'framer-motion';
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

export default LoadingSpinner;