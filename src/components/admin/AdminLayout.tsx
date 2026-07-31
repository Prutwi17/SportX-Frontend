import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Building2,
  ShoppingCart,
  TicketPercent,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/brands', label: 'Brands', icon: Building2 },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col fixed inset-y-0 z-40">
        <div className="flex flex-col flex-1 bg-dark-900 text-white">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                SportX Admin
              </span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-fuchsia-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              View Store
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <div className="lg:hidden sticky top-0 z-40 glass shadow-sm border-b border-slate-200 px-4 py-3">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                    active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
