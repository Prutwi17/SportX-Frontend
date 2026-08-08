import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Flame,
  ChevronRight,
  UserCheck,
  ShoppingBag,
  Trophy,
} from 'lucide-react';
import type { Product } from '../types';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

import ronaldoHeroPerfectImg from '../assets/image/ronaldo_hero_perfect.jpg';
import realMadridJerseyUserImg from '../assets/image/real_madrid_jersey_user.png';
import footballBootsUserImg from '../assets/image/football_boots_user.png';

// Exact cropped category image cutouts from reference image
import catFootballImg from '../assets/image/cat_football.png';
import catCricketImg from '../assets/image/cat_cricket.png';
import catJerseysImg from '../assets/image/cat_jerseys.png';
import catShoesImg from '../assets/image/cat_shoes.png';
import catBadmintonImg from '../assets/image/cat_badminton.png';
import catTennisImg from '../assets/image/cat_tennis.png';
import catGymImg from '../assets/image/cat_gym.png';
import catBagsImg from '../assets/image/cat_bags.png';

const CATEGORY_ITEMS = [
  { name: 'Football', img: catFootballImg, categoryId: 2 },
  { name: 'Cricket', img: catCricketImg, categoryId: 1 },
  { name: 'Jerseys', img: catJerseysImg, categoryId: 49 },
  { name: 'Running Shoes', img: catShoesImg, categoryId: 60 },
  { name: 'Badminton', img: catBadmintonImg, categoryId: 58 },
  { name: 'Tennis', img: catTennisImg, categoryId: 4 },
  { name: 'Gym & Fitness', img: catGymImg, categoryId: 61 },
  { name: 'Sports Bags', img: catBagsImg },
];

const categoryHref = (cat: { name: string; categoryId?: number }) =>
  cat.categoryId ? `/products?categoryId=${cat.categoryId}` : `/products?q=${encodeURIComponent(cat.name)}`;

// Real product IDs from the database specified by user for featured products
const FEATURED_PRODUCT_IDS = [438, 439, 440, 28, 361, 432, 336, 335];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFeaturedLoading(true);
    Promise.all(FEATURED_PRODUCT_IDS.map((id) => productService.getById(id)))
      .then((results) => {
        if (!cancelled) setFeaturedProducts(results.map((r) => r.data));
      })
      .catch(() => {
        if (!cancelled) setFeaturedProducts([]);
      })
      .finally(() => {
        if (!cancelled) setFeaturedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#09090b]">
      {/* ============ HERO SECTION (Ronaldo Stadium Wallpaper Artwork Canvas) ============ */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center text-white py-12 lg:py-20 overflow-hidden">
        
        {/* Full Background Artwork Image Canvas */}
        <div className="absolute inset-0 z-0 bg-[#09090b]">
          <img
            src={ronaldoHeroPerfectImg}
            alt="Ronaldo Stadium Artwork"
            className="w-full h-full object-cover object-center lg:object-right opacity-90 filter contrast-105"
          />
          {/* Gradient Overlay For Text Readability on Left Side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 sm:via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent z-10" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#09090b]/70 to-transparent z-10" />
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[450px] bg-[#ff6a00]/15 rounded-full blur-[130px] pointer-events-none z-10" />
        </div>

        {/* Text & Interactive Layer Over Background Canvas */}
        <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Side: Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#ff6a00] font-display font-extrabold text-xs sm:text-sm uppercase tracking-[0.25em] mb-3 flex items-center gap-2"
              >
                <Flame size={16} className="text-[#ff6a00] animate-pulse" />
                FUEL YOUR PASSION
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight uppercase text-white mb-5 drop-shadow-md"
              >
                PLAY <span className="text-[#ff6a00]">BIGGER.</span>
                <br />
                LIVE <span className="text-[#ff6a00]">LOUDER.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-slate-200 text-sm sm:text-base max-w-lg mb-8 font-medium leading-relaxed drop-shadow-sm"
              >
                Premium sports gear for athletes, dreamers and champions. Gear up with top-tier equipment and iconic activewear.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <Link
                  to="/products"
                  className="bg-[#ff6a00] hover:bg-[#ea580c] text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-xl shadow-orange-500/30 active:scale-95 hover:shadow-orange-500/50"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/products"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-display font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full flex items-center gap-2 transition-all backdrop-blur-md active:scale-95"
                >
                  Explore Collections
                  <ArrowRight size={16} />
                </Link>
              </motion.div>

              {/* Stat Counters */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/15"
              >
                <div className="flex items-center gap-3">
                  <UserCheck size={22} className="text-[#ff6a00]" />
                  <div>
                    <p className="font-display font-extrabold text-lg sm:text-xl text-white">50K+</p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Happy Customers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShoppingBag size={22} className="text-[#ff6a00]" />
                  <div>
                    <p className="font-display font-extrabold text-lg sm:text-xl text-white">500+</p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Products</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Trophy size={22} className="text-[#ff6a00]" />
                  <div>
                    <p className="font-display font-extrabold text-lg sm:text-xl text-white">100+</p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Top Brands</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Spacer for Background Artwork Canvas */}
            <div className="hidden lg:block lg:col-span-5 min-h-[400px]" />

          </div>
        </div>
      </section>

      {/* ============ MAIN WHITE CONTAINER (CATEGORIES + PRODUCTS) ============ */}
      <div className="relative z-20 bg-slate-50 dark:bg-dark-900 rounded-t-[32px] sm:rounded-t-[40px] pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 shadow-2xl">
        <div className="max-w-[1440px] mx-auto">
          
          {/* ============ CATEGORY CARDS GRID ============ */}
          <section className="mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {CATEGORY_ITEMS.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white dark:bg-dark-800 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                >
                  <Link to={categoryHref(cat)} className="w-full flex flex-col items-center">
                    <div className="w-full aspect-square rounded-xl bg-slate-50 dark:bg-dark-900 p-2 mb-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 rounded-lg"
                      />
                    </div>
                    <span className="font-display font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#ff6a00] transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============ FEATURED PRODUCTS SECTION ============ */}
          <section className="mb-16">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured Products
                </h2>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-[#ff6a00] font-bold text-xs px-3 py-1 rounded-full">
                  <Flame size={14} className="fill-current" />
                  Bestsellers
                </span>
              </div>

              <Link
                to="/products"
                className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-[#ff6a00] hover:text-[#ea580c] flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Products Grid (Real Products From Database) */}
            {featuredLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-white/10 p-3 sm:p-4 animate-pulse">
                    <div className="aspect-square bg-slate-100 dark:bg-dark-900 rounded-xl mb-3" />
                    <div className="h-3 bg-slate-100 dark:bg-dark-900 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-slate-100 dark:bg-dark-900 rounded w-2/3 mb-2" />
                    <div className="h-5 bg-slate-100 dark:bg-dark-900 rounded w-1/2 mb-3" />
                    <div className="h-9 bg-slate-100 dark:bg-dark-900 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">Featured products unavailable right now.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {featuredProducts.map((prod, index) => (
                  <ProductCard key={prod.id} product={prod} index={index} />
                ))}
              </div>
            )}
          </section>

          {/* ============ PROMOTIONAL BANNERS GRID ============ */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Banner 1: Football Collection (Dark Orange Flame Gradient) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120800] via-[#2a0e00] to-[#09090b] p-8 sm:p-10 text-white shadow-xl min-h-[220px] flex items-center justify-between border border-orange-900/30 group"
            >
              {/* Flame Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a00]/20 via-orange-600/10 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xs">
                <span className="text-xs font-black uppercase tracking-widest text-[#ff6a00] inline-block mb-2">
                  UP TO <span className="text-2xl font-black text-white block mt-0.5">50% OFF</span>
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase leading-tight mb-5 tracking-wide text-white">
                  FOOTBALL COLLECTION
                </h3>
                <Link
                  to="/products?q=Football"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#ff6a00] border border-white/20 hover:border-[#ff6a00] text-white font-display font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-md"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="w-48 sm:w-56 h-48 sm:h-56 shrink-0 relative z-10">
                <img
                  src={footballBootsUserImg}
                  alt="Football boots collection"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(255,106,0,0.4)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Banner 2: Real Madrid Jersey (Dark Blue Stadium & Crest) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071328] via-[#0d1e3d] to-[#09090b] p-8 sm:p-10 text-white shadow-xl min-h-[220px] flex items-center justify-between border border-blue-900/30 group"
            >
              {/* Blue Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xs">
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase leading-tight mb-1 tracking-wide text-white">
                  REAL MADRID <br />
                  <span className="text-blue-300">HOME JERSEY</span>
                </h3>
                <p className="text-slate-400 text-xs font-medium mb-5">Feel the Legacy</p>
                <Link
                  to="/products?q=Real%20Madrid"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#ff6a00] border border-white/20 hover:border-[#ff6a00] text-white font-display font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-md"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="w-44 sm:w-52 h-44 sm:h-52 shrink-0 relative z-10">
                <img
                  src={realMadridJerseyUserImg}
                  alt="Real Madrid Jersey"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

          </section>

        </div>
      </div>
    </div>
  );
}
