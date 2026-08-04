import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ShoppingCart, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason') || 'Transaction was cancelled or declined by the payment gateway.';

  return (
    <div className="min-h-[80vh] flex items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-premium p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-500/30 mb-6"
          >
            <XCircle size={42} className="text-white" />
          </motion.div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-1.5 rounded-full mb-4">
            <AlertCircle size={14} />
            Payment Failed
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment Unsuccessful
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mt-2 max-w-md mx-auto">
            We couldn't process your payment. Don't worry, no charges were made to your account.
          </p>

          <div className="mt-8 bg-red-50/70 dark:bg-red-950/30 rounded-2xl border border-red-100 dark:border-red-900/50 p-5 max-w-lg mx-auto text-left flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-300">Failure Reason</p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">{reason}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/checkout')}
              className="btn-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-sm shadow-lg shadow-brand-500/25"
            >
              <RefreshCw size={17} />
              Retry Payment
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/cart')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-colors"
            >
              <ShoppingCart size={17} />
              Return to Cart
              <ArrowLeft size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
