import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Zap,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ronaldoHeroPerfectImg from '../assets/image/ronaldo_hero_perfect.jpg';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    if (!firstName) {
      setError('Please enter your first name');
      return;
    }
    if (!lastName) {
      setError('Please enter your last name');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({ firstName, lastName, email, password: form.password, phone: form.phone.trim() });
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
            JOIN SPORTX TODAY
          </span>
          <h1 className="font-display font-black text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight mb-4 drop-shadow-lg">
            UNLEASH YOUR <br />
            INNER <span className="text-[#ff6a00]">CHAMPION.</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-md font-medium leading-relaxed drop-shadow-sm">
            Create an account to unlock fast checkout, order tracking, and exclusive discounts on top sports gear.
          </p>
        </div>

        {/* ============ RIGHT HALF: REGISTER FORM CARD ============ */}
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

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Join the SportX community for free
            </p>

            {error && (
              <div className="mt-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                    <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium" placeholder="First Name" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                    <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium" placeholder="Last Name" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium" placeholder="Enter email address" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium"
                    placeholder="Enter password (min 6 characters)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Phone (optional)</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff6a00] transition-colors" />
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all font-medium" placeholder="Phone number (optional)" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#ff6a00] hover:bg-[#ea580c] text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] mt-3"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="text-center mt-5 text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#ff6a00] hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
