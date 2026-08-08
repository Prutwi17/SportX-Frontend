import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message);
      if (res.data.token) {
        setResetToken(res.data.token);
        setStep('reset');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      setStep('done');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden px-4 py-12">
      <div className="absolute -top-24 -left-24 w-[400px] h-[400px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-16 right-10 w-64 h-64 border-2 border-white/10 rounded-full animate-float-slow" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-premium p-8 md:p-10"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl font-extrabold text-slate-900">
            Sport<span className="text-gradient">X</span>
          </span>
        </div>

        {step === 'request' && (
          <>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Forgot Password</h2>
            <p className="text-slate-500 mt-2">Enter your registered email and we'll help you reset your password</p>

            {message && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRequest} className="space-y-5 mt-8">
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

              <button type="submit" disabled={loading} className="btn-accent w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide">
                {loading ? 'Sending...' : 'Send Reset Link'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Set a New Password</h2>
            <p className="text-slate-500 mt-2">
              {message} For this demo, the reset link is shown below.
            </p>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-brand-700 mb-1">Your reset token</p>
              <p className="font-mono text-xs text-brand-800 break-all">{resetToken}</p>
            </div>

            <form onSubmit={handleReset} className="space-y-5 mt-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative group">
                  <KeyRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-brand-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-premium input-with-icon input-with-icon-right"
                    placeholder="Enter a new password"
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-premium w-full"
                  placeholder="Re-enter the new password"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-accent w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide">
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2">Password Updated</h2>
            <p className="text-slate-500 mb-8">Your password has been reset successfully. You can now log in.</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-accent w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide"
            >
              Back to Login
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={15} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
