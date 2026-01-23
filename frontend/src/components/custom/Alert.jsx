<<<<<<< HEAD
export default function Alert({ type = 'error', message }) {
  const baseStyle = 'w-full text-center text-sm rounded p-2 border';

  const styles = {
    error: 'text-red-600 bg-red-50 border-red-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
  };

  return <div className={`${baseStyle} ${styles[type]}`}>{message}</div>;
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
}
