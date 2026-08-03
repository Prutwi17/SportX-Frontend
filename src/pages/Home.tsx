import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  BadgePercent,
  Quote,
  Sparkles,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { Product, Category, PagedResponse } from '../types';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';
import ronaldoImg from '../assets/image/RONALDO.png';

export default function Home() {
  const [featured, setFeatured] = useState<PagedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productPage, setProductPage] = useState(0);

  useEffect(() => {
    productService.getAll(productPage, 16).then((res) => setFeatured(res.data));
    categoryService.getAll().then((res) => setCategories(res.data));
  }, [productPage]);

  return (
    <div className="overflow-x-hidden">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[92vh] flex items-center bg-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[70%] h-full bg-gradient-to-br from-brand-700/40 via-purple-700/30 to-fuchsia-600/20" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-600/25 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-3xl" />

          <div className="absolute top-24 left-[8%] w-24 h-24 border-2 border-brand-500/30 rounded-full animate-float-slow" />
          <div className="absolute bottom-32 left-[45%] w-16 h-16 border-2 border-fuchsia-500/25 rounded-full animate-float" />
          <div className="absolute top-40 right-[42%] w-10 h-10 bg-brand-500/20 rounded-2xl rotate-12 animate-float" />
          <div className="absolute bottom-24 left-[15%] w-20 h-20 bg-accent-500/10 rounded-2xl rotate-45 animate-float-slow" />
          <div className="absolute top-1/2 left-[55%] w-3 h-3 bg-white/30 rounded-full animate-float" />
          <div className="absolute top-64 right-[8%] w-3 h-3 bg-accent-400/50 rounded-full animate-float" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur border border-white/15 px-4 py-2 rounded-full"
            >
              <Sparkles size={14} className="text-accent-400" />
              Official Sports Store 2026
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-display text-5xl sm:text-6xl xl:text-[76px] font-extrabold leading-[1.05] text-white mt-6"
            >
              UNLEASH
              <span className="block text-gradient">YOUR</span>
              <span className="block text-gradient">GREATNESS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-300 text-lg md:text-xl mt-6 max-w-lg leading-relaxed"
            >
              Premium gear for champions. Train like the best, perform like a legend — every single day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-9"
            >
              <Link to="/products" className="btn-accent inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-base">
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-base text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur transition-all"
              >
                <Trophy size={18} className="text-accent-400" />
                Explore Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-8 mt-12"
            >
              {[
                { value: '22+', label: 'Premium Products' },
                { value: '5+', label: 'Sports Categories' },
                { value: '50K+', label: 'Happy Athletes' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative mx-auto max-w-[480px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-purple-500 to-fuchsia-500 rounded-[40px] opacity-20 blur-2xl scale-90 animate-pulse-glow" />
              <div className="relative rounded-[36px] overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src={ronaldoImg}
                  alt="Football champion celebrating victory"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -left-8 top-16 glass rounded-2xl px-5 py-4 shadow-xl"
              >
                <p className="flex items-center gap-2 font-display font-bold text-white-900 text-lg">
                  <Trophy size={18} className="text-accent-500" />
                  #1 Sports Store
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Trusted by athletes</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-6 bottom-16 glass rounded-2xl px-5 py-4 shadow-xl"
              >
                <p className="flex items-center gap-1 text-accent-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className="fill-current" />
                  ))}
                </p>
                <p className="font-display font-bold text-white-900 text-sm mt-1">4.9/5 Rating</p>
                <p className="text-xs text-slate-500">2,400+ reviews</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-800 to-transparent pointer-events-none" />
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500' },
            { icon: ShieldCheck, title: '100% Authentic', desc: 'Genuine branded gear' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <f.icon size={22} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-slate-900">{f.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      {featured && featured.content.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
          <SectionHeading
            eyebrow="Top Picks"
            title="Featured Products"
            subtitle="Hand-picked gear our athletes love the most"
            compact
          />
          <motion.div
            key={productPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-2 xl:gap-3"
          >
            {featured.content.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>

          {featured.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProductPage((p) => Math.max(0, p - 1))}
                disabled={productPage === 0}
                aria-label="Previous page"
                className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </motion.button>
              {Array.from({ length: featured.totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setProductPage(i)}
                  className={`w-10 h-10 rounded-xl font-display font-semibold transition-all ${
                    i === productPage
                      ? 'btn-gradient shadow-lg'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProductPage((p) => Math.min(featured.totalPages - 1, p + 1))}
                disabled={featured.last}
                aria-label="Next page"
                className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </motion.button>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-display font-semibold text-sm"
            >
              View All Products
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ============ CATEGORIES ============ */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Shop by Sport"
            title="Explore Categories"
            subtitle="Everything you need, organized by your game"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-premium transition-all duration-300"
              >
                <Link to={`/products?q=${cat.name}`} className="block p-7 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Trophy size={26} className="text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">
                    {cat.productCount || 0} products
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SPECIAL OFFER ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[36px] bg-dark-900 p-10 md:p-16 lg:p-20"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-600/40 to-fuchsia-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/10 rounded-full animate-float-slow" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-accent-500/15 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                <BadgePercent size={14} />
                Limited Time Offer
              </motion.span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-5 leading-tight">
                GEAR UP FOR THE
                <span className="block text-gradient">BIG GAME</span>
              </h2>
              <p className="text-slate-400 mt-5 max-w-md text-lg">
                Unlock exclusive discounts on jerseys, boots &amp; equipment. Use code{' '}
                <span className="text-accent-400 font-bold">SPORTX20</span> for 20% off.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/products" className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold">
                  Shop the Sale
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { v: '20%', l: 'Discount' },
                { v: '50K+', l: 'Customers' },
                { v: '24/7', l: 'Support' },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-dark rounded-3xl p-5 text-center"
                >
                  <p className="font-display text-2xl md:text-3xl font-extrabold text-gradient">{s.v}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why SportX"
            title="Built for Champions"
            subtitle="More than a store — a partner in your performance"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: 'Premium Quality', desc: 'Only authentic products from world-class brands', color: 'from-brand-500 to-purple-500' },
              { icon: Truck, title: 'Lightning Delivery', desc: 'Free and fast shipping on orders above ₹500', color: 'from-accent-500 to-orange-400' },
              { icon: ShieldCheck, title: 'Secure Checkout', desc: '100% safe payments with COD & online options', color: 'from-emerald-500 to-teal-400' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-8 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg mb-5`}>
                  <f.icon size={24} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Athletes Say"
          subtitle="Real feedback from the SportX community"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Rahul Sharma', role: 'Amateur Cricketer', text: 'The quality of gear is unmatched. My new bat felt like it was made for me — instant game-changer!', initials: 'RS', color: 'from-brand-500 to-purple-500' },
            { name: 'Priya Patel', role: 'Football Enthusiast', text: 'Fast delivery, authentic products, and prices that beat every other store. SportX is my go-to now.', initials: 'PP', color: 'from-accent-500 to-orange-400' },
            { name: 'Amit Verma', role: 'Gym Regular', text: 'Ordered the dumbbell set and resistance bands. Premium build quality and the support team is amazing.', initials: 'AV', color: 'from-emerald-500 to-teal-400' },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-8 transition-all duration-300 relative"
            >
              <Quote size={40} className="absolute top-6 right-6 text-brand-100" />
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} className="text-accent-500 fill-accent-500" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-brand-600 via-purple-600 to-fuchsia-600 text-center p-12 md:p-20"
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent-500/30 rounded-full blur-3xl" />
          <h2 className="relative font-display text-3xl md:text-5xl font-extrabold text-white">
            Ready to Elevate Your Game?
          </h2>
          <p className="relative text-white/90 text-lg mt-4 max-w-xl mx-auto">
            Join thousands of athletes who trust SportX for premium sports equipment.
          </p>
          <div className="relative mt-8">
            <Link
              to="/products"
              className="btn-white inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-base"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
