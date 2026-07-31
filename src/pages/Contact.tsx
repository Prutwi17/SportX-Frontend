import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Headphones, Clock } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = 'input-premium w-full';

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark-900 relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur border border-white/15 px-4 py-2 rounded-full"
          >
            <Headphones size={14} className="text-accent-400" />
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight mt-6"
          >
            WE'RE HERE
            <span className="block text-gradient">TO HELP</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-300 text-lg max-w-xl mx-auto mt-5"
          >
            Have a question or need help with your order? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info cards */}
          <div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
              Contact <span className="text-gradient">Information</span>
            </h2>
            <p className="text-slate-500 mb-8">
              Reach out through any of these channels — we respond within 24 hours.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, title: 'Email Us', desc: 'support@sportx.com', sub: 'For general enquiries' },
                { icon: Phone, title: 'Call Us', desc: '+91 98765 43210', sub: 'Mon–Sat, 9am–9pm IST' },
                { icon: MapPin, title: 'Visit Us', desc: 'Sports Complex, MG Road', sub: 'Bengaluru, India 560001' },
                { icon: Clock, title: 'Working Hours', desc: '9:00 AM – 9:00 PM', sub: '7 days a week' },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-5 bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-6 transition-all"
                >
                  <div className="w-13 h-13 shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <c.icon size={21} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">{c.title}</h3>
                    <p className="text-brand-600 font-semibold text-sm">{c.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-8 lg:sticky lg:top-24 h-fit"
          >
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <Send size={34} className="text-emerald-600" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2">Thank You!</h2>
                <p className="text-slate-500">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center">
                    <MessageSquare size={19} className="text-white" />
                  </div>
                  <h2 className="font-display text-xl font-extrabold text-slate-900">Send us a message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Your Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={inputClass}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className={`${inputClass} min-h-[140px]`}
                      placeholder="How can we help?"
                      rows={5}
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-gradient w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl font-display font-bold"
                  >
                    Send Message
                    <Send size={16} />
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
