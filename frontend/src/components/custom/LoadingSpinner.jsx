import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 80, text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <motion.div
        className="border-8 border-gray-200 border-t-black rounded-full"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />

      {text && (
        <motion.p
          className="mt-6 text-gray-700 font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: 'reverse',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
