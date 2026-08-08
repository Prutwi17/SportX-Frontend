import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ronaldoHeroPerfectImg from '../assets/image/ronaldo_hero_perfect.jpg';

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
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(trimmedEmail, password);
      if (res.data.role === 'ROLE_ADMIN') {
        setError('Please use the Admin Login portal.');
        return;
      }
      login(res.data.token, {
        email: res.data.email,
        role: res.data.role,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      });
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string> } } };
      const data = e.response?.data;
      if (data?.errors && Object.keys(data.errors).length > 0) {
        setError(Object.values(data.errors)[0]);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#09090b] overflow-hidden text-slate-900 dark:text-white py-12 px-4">
      {/* Full Screen Ronaldo Artwork Background Canvas */}
      <div className="absolute inset-0 z-0 bg-[#09090b]">
        <img
          src={ronaldoHeroPerfectImg}
          alt="Ronaldo Stadium Background"
          className="w-full h-full object-cover object-left lg:object-center opacity-85 filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 via-[#09090b]/60 to-[#09090b]/90 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#09090b]/70 to-transparent z-10" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ff6a00]/15 rounded-full blur-[140px] pointer-events-none z-10" />
      </div>

      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ============ LEFT HALF: SPACER / HEADING OVERLAY ============ */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8">
          <span className="text-[#ff6a00] font-display font-black text-xs uppercase tracking-[0.25em] mb-2">
            SPORTX AUTHENTICATION
          </span>
          <h1 className="font-display font-black text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-lg">
            BE PART OF <br />
            THE <span className="text-[#ff6a00]">LEGACY.</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-md font-medium leading-relaxed drop-shadow-sm">
            Access your orders, personalized wishlist, and exclusive member-only sports collections.
          </p>
        </div>

        {/* ============ RIGHT HALF: LOGIN FORM CARD ============ */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle Top Ambient Glow Accent */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#ff6a00]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10">
                <Zap size={20} className="text-[#ff6a00]" fill="currentColor" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Sport<span className="text-[#ff6a00]">X</span>
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Log in to your SportX account to get back in the game
            </p>

            {error && (
              <div className="mt-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative group">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-0.5">
                <Link to="/forgot-password" className="text-xs font-semibold text-[#ff6a00] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#ff6a00] hover:bg-[#ea580c] text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] mt-2"
              >
                {loading ? 'Logging in...' : 'Log In'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#ff6a00] hover:underline">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
