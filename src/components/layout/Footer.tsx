import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Globe,
  MessageCircle,
  AtSign,
  Rss,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

const categories = [
  'Football',
  'Cricket',
  'Running',
  'Gym & Fitness',
  'Accessories',
  'Jerseys',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-dark-900 text-slate-300 mt-auto relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              GET IN THE GAME<span className="text-brand-600">.</span>
            </h3>
            <p className="text-slate-400 mt-1.5">
              Subscribe for exclusive deals, new arrivals &amp; sports news.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
            className="flex gap-2 w-full max-w-md"
          >
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 focus-within:border-brand-500 transition-colors">
              <Mail size={17} className="text-slate-500 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-transparent py-3.5 w-full text-white placeholder-slate-500 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="btn-accent flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shrink-0"
            >
              <Send size={15} />
              {subscribed ? 'Done' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 sm:col-span-3 lg:col-span-2"
          >
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <Zap size={18} className="text-brand-600" fill="currentColor" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-white">
                SPORT<span className="text-brand-600">X</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              Premium sports equipment for every athlete. Gear up, train hard, and dominate every game.
            </p>
            <div className="flex gap-2.5">
              {[Globe, MessageCircle, AtSign, Rss].map((Icon, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">Company</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/products">Shop All</FooterLink>
              <FooterLink to="/wishlist">Wishlist</FooterLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">Categories</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {categories.map((c) => (
                <FooterLink key={c} to={`/products?q=${encodeURIComponent(c)}`}>{c}</FooterLink>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">Support</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/orders">My Orders</FooterLink>
              <FooterLink to="/profile">My Account</FooterLink>
              <FooterLink to="/cart">Shopping Cart</FooterLink>
              <FooterLink to="/login">Login / Register</FooterLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-5">Contact</h4>
            <div className="flex flex-col gap-3.5 text-sm text-slate-400">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-500 shrink-0 mt-0.5" />
                SportX HQ, Bengaluru, India
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-brand-500 shrink-0" />
                support@sportx.com
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-brand-500 shrink-0" />
                +91 91100 91100
              </p>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SportX. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'UPI', 'COD'].map((p) => (
              <span
                key={p}
                className="px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1"
              >
                <CreditCard size={10} />
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-5 text-xs text-slate-500 items-center">
            <span className="transition-colors">Privacy</span>
            <span className="transition-colors">Terms</span>
            <span className="transition-colors">Returns</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-brand-400 transition-colors"
            >
              <ShieldCheck size={13} />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-slate-400 hover:text-white transition-colors w-fit">
      {children}
    </Link>
  );
}
