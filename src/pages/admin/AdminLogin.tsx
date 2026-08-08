import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(trimmedEmail, password);
      if (res.data.role !== 'ROLE_ADMIN') {
        setError('This account does not have admin access.');
        return;
      }
      login(res.data.token, {
        email: res.data.email,
        role: res.data.role,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-dark-900 px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-dark-900 to-brand-900/30" />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] bg-accent-600/20 rounded-full blur-3xl" />
      <div className="absolute top-24 right-[12%] w-20 h-20 border-2 border-accent-400/25 rounded-full animate-float-slow" />
      <div className="absolute bottom-28 left-[10%] w-14 h-14 border-2 border-brand-400/25 rounded-full animate-float" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/40">
            <Zap size={22} className="text-white" fill="currentColor" />
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-extrabold text-white leading-none">
              Sport<span className="text-gradient">X</span>
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">Admin Console</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-[28px] border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-brand-500 via-accent-500 to-accent-600" />

          <div className="p-7 md:p-9">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-extrabold text-slate-900">Admin Login</h1>
                <p className="text-sm text-slate-500">Restricted area — administrators only</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium input-with-icon"
                    placeholder="admin@sportx.com"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative group">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium input-with-icon input-with-icon-right"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide mt-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    Sign in to Dashboard
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <Link
                to="/"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1.5"
              >
                <TrendingUp size={14} />
                Back to Store
              </Link>
              <span className="text-xs text-slate-400">Secure · JWT Protected</span>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Access is restricted to authorized SportX administrators.
        </p>
      </div>
    </div>
  );
}
