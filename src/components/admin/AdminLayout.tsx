import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Building2,
  ShoppingCart,
  TicketPercent,
  Users,
  BarChart3,
  LogOut,
  ExternalLink,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/brands', label: 'Brands', icon: Building2 },
  { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const current = navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex overflow-x-hidden">
      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col flex-1 bg-dark-900 text-white border-r border-white/10 shadow-2xl relative">
          
          {/* Header & Logo */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6a00] to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <Zap size={20} className="text-white" fill="currentColor" />
              </div>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                  <span className="font-display text-lg font-black tracking-tight text-white block leading-none">
                    SPORT<span className="text-[#ff6a00]">X</span>
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-slate-400 block mt-1">
                    Seller Console
                  </span>
                </motion.div>
              )}
            </Link>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#ff6a00] text-white shadow-lg shadow-orange-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={19} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {active && !collapsed && (
                    <Sparkles size={14} className="ml-auto text-white/80 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Profile & Actions */}
          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                {(user?.firstName?.[0] || 'A').toUpperCase()}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={13} />
                  View Store
                </Link>
                <ThemeToggle />
              </div>
            )}

            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-red-600/90 text-white transition-all ${
                collapsed ? 'px-2' : 'px-4'
              }`}
              title="Logout"
            >
              <LogOut size={15} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
            
            {/* Left: Breadcrumbs & Page Title */}
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/" className="flex items-center gap-2 shrink-0 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-[#ff6a00] flex items-center justify-center text-white">
                  <Zap size={16} fill="currentColor" />
                </div>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{current.label}</span>
                </div>
              </div>
            </div>

            {/* Middle: Global Search Input */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/40 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Notifications Popover Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff6a00] rounded-full ring-2 ring-white dark:ring-dark-900" />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 z-50"
                    >
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Notifications</span>
                        <span className="text-[10px] font-bold text-[#ff6a00] bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full">3 New</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                          <p className="font-bold text-slate-800 dark:text-slate-200">New Order #ORD-9482</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">₹11,995 • 2 mins ago</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-900 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                          <p className="font-bold text-slate-800 dark:text-slate-200">Low Stock Alert</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Predator Elite (3 remaining)</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />

              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all"
              >
                <ExternalLink size={14} />
                View Store
              </Link>

              {/* Profile Avatar Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ff6a00] text-white font-bold text-xs flex items-center justify-center">
                    {(user?.firstName?.[0] || 'A').toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Mobile Horizontal Tabs */}
          <div className="lg:hidden overflow-x-auto border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-dark-900">
            <div className="flex gap-1.5 px-3 py-2 items-center min-w-max">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-[#ff6a00] text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 min-w-0 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
