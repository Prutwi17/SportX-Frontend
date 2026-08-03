import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Zap, ShieldCheck, Truck, RotateCcw,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ronaldoImg from '../assets/image/RONALDO.png';

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
    <div className="min-h-screen flex items-stretch bg-dark-900">
      {/* ============ LEFT PANEL ============ */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/40 via-purple-700/25 to-fuchsia-600/20" />
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-16 right-10 w-64 h-64 border-2 border-white/10 rounded-full animate-float-slow" />

        <div className="relative z-10 w-full max-w-md mx-auto px-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur border border-white/15 px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-accent-400" />
              Join the Team
            </span>
            <h1 className="font-display text-5xl font-extrabold text-white leading-tight mt-6">
              BECOME PART OF
              <span className="block text-gradient">THE CHAMPIONS</span>
            </h1>
            <p className="text-slate-300 text-lg mt-5 leading-relaxed">
              Create your free account and unlock member-only deals, faster checkout and order tracking.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery' },
                { icon: ShieldCheck, label: 'Authentic Gear' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-dark rounded-2xl p-4 text-center"
                >
                  <f.icon size={20} className="mx-auto text-accent-400" />
                  <p className="text-[11px] text-slate-300 mt-2 font-medium">{f.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-[28px] overflow-hidden border border-white/15 shadow-2xl">
              <img src={ronaldoImg} alt="Football legend" className="w-full h-[260px] object-cover" />
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

          <h2 className="font-display text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join the SportX community for free</p>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                  <input name="firstName" value={form.firstName} onChange={handleChange} className="input-premium input-with-icon" placeholder="Enter your first name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                  <input name="lastName" value={form.lastName} onChange={handleChange} className="input-premium input-with-icon" placeholder="Enter your last name" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-premium input-with-icon" placeholder="Enter your email address" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-premium input-with-icon input-with-icon-right"
                  placeholder="Enter your password"
                  required
                  minLength={6}
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone (optional)</label>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                <input name="phone" value={form.phone} onChange={handleChange} className="input-premium input-with-icon" placeholder="Enter your phone number (optional)" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gradient w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
