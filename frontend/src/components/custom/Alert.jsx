
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Alert({ type = 'error', message }) {
  const config = {
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
    },
  };

  const { icon: Icon, bg, border, text, iconBg } = config[type] || config.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-3 w-full rounded-xl p-3 border
        ${bg} ${border}
      `}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${text}`} />
      </div>
      <p className={`text-sm font-medium ${text}`}>{message}</p>
    </motion.div>
  );
}
