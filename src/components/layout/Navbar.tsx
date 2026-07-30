import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-white/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SportX
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/products" label="Products" />
            <NavLink to="/about" label="About" />

            {isAuthenticated ? (
              <>
                <NavLink to="/cart" label="Cart" />
                <NavLink to="/wishlist" label="Wishlist" />
                <NavLink to="/orders" label="Orders" />
                <NavLink to="/profile" label="Profile" />
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/admin/dashboard"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
                <span className="text-gray-500 text-sm">{user?.firstName}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login" label="Login" />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <MobileLink to="/products" label="Products" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/cart" label="Cart" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/wishlist" label="Wishlist" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/orders" label="Orders" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/profile" label="Profile" onClick={() => setMobileOpen(false)} />
                  {isAdmin && <MobileLink to="/admin/dashboard" label="Admin" onClick={() => setMobileOpen(false)} />}
                  <button onClick={handleLogout} className="text-red-500 font-medium text-left py-2">Logout</button>
                </>
              ) : (
                <>
                  <MobileLink to="/products" label="Products" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/about" label="About" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/login" label="Login" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/register" label="Register" onClick={() => setMobileOpen(false)} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Link to={to} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
        {label}
      </Link>
    </motion.div>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors">
      {label}
    </Link>
  );
}
