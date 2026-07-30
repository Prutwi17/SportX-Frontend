import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-200 font-medium uppercase tracking-widest text-sm mb-4"
          >
            Premium Sports Equipment
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Gear Up for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Greatness
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto"
          >
            Premium sports equipment for every athlete — from amateur to pro
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Shop Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="inline-block bg-white/10 text-white border-2 border-white/30 px-10 py-4 rounded-xl font-bold text-lg backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-bold text-center mb-4">
            Shop by Category
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-center mb-12 max-w-md mx-auto">
            Find exactly what you need from our wide range of sports categories
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Cricket', emoji: '🏏', desc: 'Bats, balls, protective gear & more' },
              { name: 'Football', emoji: '⚽', desc: 'Boots, jerseys, balls & accessories' },
              { name: 'Basketball', emoji: '🏀', desc: 'Shoes, hoops, balls & apparel' },
              { name: 'Tennis', emoji: '🎾', desc: 'Rackets, balls, shoes & nets' },
              { name: 'Fitness', emoji: '💪', desc: 'Gym equipment, mats & accessories' },
              { name: 'Swimming', emoji: '🏊', desc: 'Swimwear, goggles & training gear' },
            ].map((cat, i) => (
              <motion.div key={cat.name} variants={scaleIn} custom={i}>
                <Link
                  to={`/products?category=${cat.name}`}
                  className="card-hover block bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl"
                >
                  <motion.div
                    className="text-5xl mb-4 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    {cat.emoji}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm">{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-gradient-to-r from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-4">
              Why Choose SportX?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mb-12 max-w-lg mx-auto">
              We're committed to providing the best sports equipment experience
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Premium Quality', desc: 'Top brands and authentic products guaranteed', icon: '🏆' },
                { title: 'Fast Delivery', desc: 'Free shipping on orders above ₹500', icon: '🚚' },
                { title: 'Easy Returns', desc: '30-day hassle-free return policy', icon: '🔄' },
                { title: 'Secure Payments', desc: '100% secure checkout with multiple options', icon: '🔒' },
                { title: '24/7 Support', desc: 'Round-the-clock customer support team', icon: '💬' },
                { title: 'Best Prices', desc: 'Competitive prices with regular discounts', icon: '💰' },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Game?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of athletes who trust SportX for their sports equipment needs
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              to="/products"
              className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
