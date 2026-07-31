import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap, Sparkles, Star } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ronaldoImg from '../assets/image/RONALDO.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      login(res.data.token, {
        email: res.data.email,
        role: res.data.role,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      });
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-dark-900">
      {/* ============ LEFT PANEL ============ */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/40 via-purple-700/25 to-fuchsia-600/20" />
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-16 right-10 w-64 h-64 border-2 border-white/10 rounded-full animate-float-slow" />
        <div className="absolute top-24 right-[15%] w-16 h-16 border-2 border-accent-400/25 rounded-full animate-float" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-10"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur border border-white/15 px-4 py-2 rounded-full">
              <Sparkles size={14} className="text-accent-400" />
              Welcome Back Champion
            </span>
            <h1 className="font-display text-5xl font-extrabold text-white leading-tight mt-6">
              YOUR COMEBACK
              <span className="block text-gradient">STARTS HERE</span>
            </h1>
            <p className="text-slate-300 text-lg mt-5 leading-relaxed">
              Log in to access your orders, wishlist and exclusive member deals.
            </p>

            <div className="mt-10 relative">
              <div className="rounded-[28px] overflow-hidden border border-white/15 shadow-2xl">
                <img src={ronaldoImg} alt="Football legend" className="w-full h-[320px] object-cover" />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-5 left-8 glass rounded-2xl px-5 py-3 shadow-xl"
              >
                <p className="flex items-center gap-1 text-accent-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="fill-current" />
                  ))}
                </p>
                <p className="font-display font-bold text-dark-900 text-sm">Trusted by 50K+ athletes</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ RIGHT PANEL ============ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              Sport<span className="text-gradient">X</span>
            </span>
          </div>

          <h2 className="font-display text-3xl font-extrabold text-slate-900">Log In</h2>
          <p className="text-slate-500 mt-2">Enter your details to get back in the game</p>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium input-with-icon"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium input-with-icon input-with-icon-right"
                  placeholder="Enter your password"
                  required
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

            <button type="submit" disabled={loading} className="btn-gradient w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-base">
              {loading ? 'Logging in...' : 'Log In'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
