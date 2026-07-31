import { motion } from 'framer-motion';
import { Target, Eye, Heart, Zap, Trophy, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark-900 relative overflow-hidden py-24">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="absolute top-16 right-[20%] w-16 h-16 border-2 border-white/10 rounded-full animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur border border-white/15 px-4 py-2 rounded-full"
          >
            <Zap size={14} className="text-accent-400" />
            About SportX
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight mt-6"
          >
            WE POWER
            <span className="block text-gradient">CHAMPIONS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            SportX is your premier destination for high-quality sports equipment. We are passionate
            about sports and committed to providing athletes of all levels with the gear they need
            to perform at their best.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
              Founded to make <span className="text-gradient">premium gear accessible</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mt-5">
              Founded with a vision to make premium sports equipment accessible to everyone,
              SportX offers a wide range of products from top brands across cricket, football,
              basketball, tennis and fitness.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mt-4">
              Every product is hand-picked, 100% authentic, and backed by our commitment to
              quality and customer satisfaction. From your first game to your championship run —
              we're with you every step of the way.
            </p>
            <div className="flex flex-wrap gap-8 mt-8">
              {[
                { icon: Trophy, value: '50K+', label: 'Athletes served' },
                { icon: Award, value: '100%', label: 'Authentic gear' },
                { icon: Users, value: '24/7', label: 'Customer support' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <s.icon size={22} />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Cricket', desc: 'Bats, balls, protective gear' },
                { icon: Trophy, title: 'Football', desc: 'Jerseys, boots & more' },
                { icon: Award, title: 'Fitness', desc: 'Dumbbells, resistance bands' },
                { icon: Heart, title: 'Basketball', desc: 'Balls, hoops, footwear' },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-6 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center mb-4">
                    <c.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Our Mission', desc: 'Empower every athlete with the best equipment', color: 'from-brand-500 to-purple-500' },
              { icon: Eye, title: 'Our Vision', desc: 'Be the most trusted sports equipment platform', color: 'from-accent-500 to-orange-400' },
              { icon: Heart, title: 'Our Values', desc: 'Quality, authenticity, and customer satisfaction', color: 'from-emerald-500 to-teal-400' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-8 text-center transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center shadow-lg mb-5`}>
                  <v.icon size={26} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
