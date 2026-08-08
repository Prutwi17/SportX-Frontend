import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cartService } from '../../services/cartService';
import ThemeToggle from '../common/ThemeToggle';
import {
  ShoppingCart,
  Heart,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Package,
  Settings,
  Search,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  const fetchCart = useCallback(() => {
    if (isAuthenticated) {
      cartService.getCart().then((res) => {
        setCartCount(res.data.totalItems || 0);
      }).catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    window.addEventListener('cart-updated', fetchCart);
    return () => window.removeEventListener('cart-updated', fetchCart);
  }, [fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    setMobileOpen(false);
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'PRODUCTS', path: '/products' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACTS', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-[#09090b] text-white border-b border-white/10 transition-all duration-300 ${
      scrolled ? 'shadow-2xl shadow-black/80 border-white/15' : 'shadow-lg'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px] gap-4">
          
          {/* LEFT: Logo & Navigation Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex items-center shrink-0">
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                Sport<span className="text-[#ff6a00]">X</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`relative py-1 font-display text-xs lg:text-sm font-bold uppercase tracking-wider transition-colors ${
                      active ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff6a00] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER: Search Bar (48px height) */}
          <form onSubmit={handleSearch} className="hidden xl:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-12 pl-5 pr-11 rounded-full bg-[#18181b] border border-slate-800 text-sm text-white placeholder-slate-400 outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* RIGHT: Actions (Cart, Wishlist, Auth/Profile, Theme) */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <ThemeToggle />

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-200 hover:text-white transition-colors"
              title="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff6a00] text-white font-bold text-[11px] flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-200 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff6a00] text-white font-bold text-[11px] flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons / Profile Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 h-12 rounded-full bg-[#18181b] border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff6a00] text-white flex items-center justify-center font-bold text-xs">
                    {(user?.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-white hidden sm:inline">{user?.firstName}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                        <p className="font-bold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <div className="pt-2">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10"
                        >
                          <Settings size={15} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10"
                        >
                          <Package size={15} /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 text-[#ff6a00]"
                          >
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="relative text-xs lg:text-sm font-medium uppercase tracking-wider text-slate-200 hover:text-white transition-colors py-1 group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff6a00] group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
                <Link
                  to="/register"
                  className="h-12 px-6 rounded-full bg-[#ff6a00] hover:bg-[#ea580c] text-white font-display font-bold text-xs lg:text-sm uppercase tracking-wider flex items-center justify-center transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:text-white md:hidden"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#09090b] px-4 py-4 space-y-3"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 px-4 rounded-full bg-[#18181b] border border-slate-800 text-sm text-white placeholder-slate-400 outline-none"
              />
            </form>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block font-display font-bold text-sm uppercase tracking-wider text-slate-200 hover:text-[#ff6a00]"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
