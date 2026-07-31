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
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-slate-300 mt-auto relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="py-14 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                Stay in the Game
              </h3>
              <p className="text-slate-400">
                Subscribe for exclusive deals, new arrivals &amp; sports news.
              </p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
                <Mail size={18} className="text-slate-500 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="bg-transparent py-3.5 w-full text-white placeholder-slate-500 outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="btn-accent flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm shrink-0"
              >
                <Send size={16} />
                Subscribe
              </button>
            </motion.form>
          </div>
        </div>

        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <span className="font-display text-xl font-bold text-gradient-brand">SportX</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your one-stop destination for premium sports equipment. Gear up and dominate every game.
            </p>
            <div className="flex gap-2.5">
              {[Globe, MessageCircle, AtSign, Rss].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-600 transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <h4 className="font-display font-semibold text-white mb-5">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/products">Shop Products</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/wishlist">Wishlist</FooterLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
          >
            <h4 className="font-display font-semibold text-white mb-5">Customer Service</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/cart">Shopping Cart</FooterLink>
              <FooterLink to="/orders">My Orders</FooterLink>
              <FooterLink to="/profile">My Account</FooterLink>
              <FooterLink to="/login">Login / Register</FooterLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
          >
            <h4 className="font-display font-semibold text-white mb-5">Get in Touch</h4>
            <div className="flex flex-col gap-3.5 text-sm text-slate-400">
              <p className="flex items-start gap-3">
                <MapPin size={17} className="text-brand-400 shrink-0 mt-0.5" />
                SportX HQ, Mumbai, India
              </p>
              <p className="flex items-center gap-3">
                <Mail size={17} className="text-brand-400 shrink-0" />
                support@sportx.com
              </p>
              <p className="flex items-center gap-3">
                <Phone size={17} className="text-brand-400 shrink-0" />
                +91 98765 43210
              </p>
            </div>
            <div className="flex items-center gap-2 mt-5">
              {['VISA', 'MC', 'UPI', 'COD'].map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1"
                >
                  <CreditCard size={11} />
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SportX. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-slate-500">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Refund Policy</span>
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
