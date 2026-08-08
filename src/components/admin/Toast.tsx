import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={`fixed top-5 right-5 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-2xl border border-white/10 ${
            type === 'error' ? 'bg-red-600 shadow-red-600/30' : 'bg-dark-900 shadow-black/30 dark:bg-slate-800'
          }`}
          role="status"
        >
          {type === 'error' ? (
            <AlertCircle size={17} className="text-white shrink-0" />
          ) : (
            <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
          )}
          <span className="max-w-[320px] truncate">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
