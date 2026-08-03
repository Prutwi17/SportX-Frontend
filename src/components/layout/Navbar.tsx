import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  Zap,
  Package,
  Settings,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
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

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-slate-900/5' : 'bg-white/70 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[68px]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient-brand tracking-tight">
              SportX
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <IconLink to="/cart" icon={ShoppingCart} count={cartCount} label="Cart" />
                <IconLink to="/wishlist" icon={Heart} count={wishlistCount} label="Wishlist" />
                <IconLink to="/orders" icon={Package} label="Orders" />

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 ml-1 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {(user?.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    <ChevronDown size={15} className={`text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-60 glass rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-200/60">
                          <p className="font-display font-semibold text-sm text-slate-900 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <DropdownLink to="/profile" icon={Settings} label="My Profile" onClick={() => setProfileOpen(false)} />
                          <DropdownLink to="/orders" icon={Package} label="My Orders" onClick={() => setProfileOpen(false)} />
                          <DropdownLink to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setProfileOpen(false)} />
                          {isAdmin && (
                            <DropdownLink to="/admin/dashboard" icon={LayoutDashboard} label="Admin Panel" onClick={() => setProfileOpen(false)} />
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={17} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-brand-600 px-4 py-2.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gradient text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200/60 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <MobileLink key={link.to} to={link.to} label={link.label} onClick={() => setMobileOpen(false)} />
              ))}
              {isAuthenticated ? (
                <>
                  <MobileLink to="/cart" label={`Cart${cartCount > 0 ? ` (${cartCount})` : ''}`} onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/wishlist" label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`} onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/orders" label="Orders" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/profile" label="Profile" onClick={() => setMobileOpen(false)} />
                  {isAdmin && <MobileLink to="/admin/dashboard" label="Admin Panel" onClick={() => setMobileOpen(false)} />}
                  <button onClick={handleLogout} className="text-red-500 font-medium text-left px-3 py-2.5">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileLink to="/login" label="Login" onClick={() => setMobileOpen(false)} />
                  <MobileLink to="/register" label="Register" onClick={() => setMobileOpen(false)} />
                </>
              )}
              <div className="flex items-center justify-between px-3 pt-2 mt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
    >
      {label}
      <motion.span
        initial={false}
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-1 left-0 right-0 h-0.5 mx-4 bg-gradient-to-r from-brand-500 to-fuchsia-500 rounded-full"
      />
    </Link>
  );
}

function IconLink({
  to,
  icon: Icon,
  count,
  label,
}: {
  to: string;
  icon: React.ElementType;
  count?: number;
  label: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-all"
    >
      <Icon size={20} />
      {count !== undefined && count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-accent-500 to-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </Link>
  );
}

function DropdownLink({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
    >
      <Icon size={17} className="text-slate-400" />
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
      {label}
    </Link>
  );
}
