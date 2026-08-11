import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-dark-900 to-brand-900/30" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-500/15 border border-brand-400/20 flex items-center justify-center mb-6">
          <Compass size={36} className="text-brand-400" />
        </div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-accent-400 mb-3">404 Not Found</p>
        <h1 className="font-display text-4xl font-extrabold text-white mb-4">Page Not Found</h1>
        <p className="text-slate-300 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-display font-semibold text-sm shadow-lg shadow-brand-600/30 hover:-translate-y-0.5 transition-transform"
          >
            <Search size={16} />
            Browse Products
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white font-display font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            <Home size={16} />
            Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
