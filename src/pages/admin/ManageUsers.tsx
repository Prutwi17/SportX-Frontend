import { useState, useEffect, type FormEvent } from 'react';
import {
  Users,
  Search,
  Pencil,
  KeyRound,
  ShieldCheck,
  ShieldOff,
  RefreshCw,
  Mail,
  Phone,
  User as UserIcon,
  ShoppingBag,
  LayoutGrid,
  List,
  Shield,
  UserCheck,
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import type { AdminUser, PagedResponse } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
import Pagination from '../../components/admin/Pagination';

const inr = (v: number) => `₹${(v || 0).toLocaleString('en-IN')}`;

export default function ManageUsers() {
  const [data, setData] = useState<PagedResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [enabledFilter, setEnabledFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'ROLE_CUSTOMER',
  });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSaving, setResetSaving] = useState(false);

  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);
  const [toggleBusy, setToggleBusy] = useState(false);

  const customers = data?.content.filter((u) => u.role === 'ROLE_CUSTOMER').length ?? 0;
  const admins = data?.content.filter((u) => u.role === 'ROLE_ADMIN').length ?? 0;
  const activeUsers = data?.content.filter((u) => u.enabled).length ?? 0;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  const fetchUsers = () => {
    setLoading(true);
    adminUserService
      .getUsers({
        page,
        size: viewMode === 'grid' ? 12 : 10,
        keyword: searchTerm || undefined,
        role: roleFilter || undefined,
        enabled: enabledFilter === '' ? undefined : enabledFilter === 'true',
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter, enabledFilter, viewMode]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(keyword.trim());
  };

  const openEdit = (u: AdminUser) => {
    setEditForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
    });
    setEditError('');
    setEditing(u);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const targetId = editing.id;
    setEditSaving(true);
    setEditError('');
    // Real-Time Optimistic Edit Update
    setData((prev) =>
      prev
        ? {
            ...prev,
            content: prev.content.map((u) =>
              u.id === targetId
                ? {
                    ...u,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    email: editForm.email,
                    phone: editForm.phone,
                    role: editForm.role,
                  }
                : u
            ),
          }
        : prev
    );
    try {
      await adminUserService.updateUser(targetId, editForm);
      setEditing(null);
      showToast('User updated successfully');
      fetchUsers();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setEditError(e.response?.data?.message || 'Failed to update user');
      fetchUsers();
    } finally {
      setEditSaving(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    if (resetPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }
    setResetSaving(true);
    setResetError('');
    try {
      await adminUserService.resetPassword(resetTarget.id, resetPassword);
      setResetTarget(null);
      setResetPassword('');
      showToast(`Password reset for ${resetTarget.email}`);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setResetError(e.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    const targetId = toggleTarget.id;
    const nextState = !toggleTarget.enabled;
    setToggleBusy(true);
    // Real-Time Optimistic Toggle Update
    setData((prev) =>
      prev
        ? {
            ...prev,
            content: prev.content.map((u) => (u.id === targetId ? { ...u, enabled: nextState } : u)),
          }
        : prev
    );
    setToggleTarget(null);
    try {
      await adminUserService.setEnabled(targetId, nextState);
      showToast(nextState ? 'User enabled' : 'User disabled');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast(e.response?.data?.message || 'Failed to update user status', 'error');
      fetchUsers();
    } finally {
      setToggleBusy(false);
    }
  };

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide';

  return (
    <AdminLayout>
      <Toast message={toast} type={toastType} />

      {/* Header & Page Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-amber-600 flex items-center justify-center shadow-md text-white shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Users
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage registered customer accounts, roles and security privileges
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center bg-slate-200/80 dark:bg-white/10 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-dark-800 text-[#ff6a00] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={15} /> User Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-dark-800 text-[#ff6a00] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <List size={15} /> Table View
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6a00] flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Users</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{data?.totalElements || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Customers</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{customers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-bold">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Admins</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{admins}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Active Accounts</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{activeUsers}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-premium input-with-icon"
            placeholder="Search by name or email..."
          />
        </form>
        <select
          value={roleFilter}
          onChange={(e) => {
            setPage(0);
            setRoleFilter(e.target.value);
          }}
          className="input-premium w-auto"
        >
          <option value="">All Roles</option>
          <option value="ROLE_CUSTOMER">Customers</option>
          <option value="ROLE_ADMIN">Admins</option>
        </select>
        <select
          value={enabledFilter}
          onChange={(e) => {
            setPage(0);
            setEnabledFilter(e.target.value);
          }}
          className="input-premium w-auto"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </select>
        <button
          onClick={() => {
            setPage(0);
            setSearchTerm('');
            setKeyword('');
            setRoleFilter('');
            setEnabledFilter('');
          }}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : viewMode === 'grid' ? (
        /* ==================== USER CARDS GRID VIEW ==================== */
        <div>
          {data?.content.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10">
              <Users size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-800 dark:text-white text-base">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data?.content.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-amber-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md shadow-orange-500/20">
                          {(u.firstName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-slate-900 dark:text-white text-base truncate">
                            {u.firstName} {u.lastName}
                          </h3>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>

                      <span
                        className={`admin-badge shrink-0 ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                        }`}
                      >
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                      </span>
                    </div>

                    {/* Stats Metrics Sub-grid */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-100 dark:border-white/5 mb-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Orders</span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1 mt-0.5">
                          <ShoppingBag size={13} className="text-[#ff6a00]" /> {u.totalOrders}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Spending</span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">
                          {inr(u.totalSpending)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-extrabold ${
                        u.enabled ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${u.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {u.enabled ? 'Active Account' : 'Disabled'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(u)}
                        className="admin-action text-[#ff6a00]"
                        title="Edit user"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setResetTarget(u);
                          setResetPassword('');
                          setResetError('');
                        }}
                        className="admin-action text-amber-600"
                        title="Reset password"
                      >
                        <KeyRound size={13} /> Reset
                      </button>
                      {!(u.role === 'ROLE_ADMIN' && u.enabled) && (
                        <button
                          onClick={() => setToggleTarget(u)}
                          className={`admin-action ${u.enabled ? 'text-red-500' : 'text-emerald-600'}`}
                          title={u.enabled ? 'Disable user' : 'Enable user'}
                        >
                          {u.enabled ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={data.totalPages}
                onPage={setPage}
                totalElements={data.totalElements}
                pageSize={12}
              />
            </div>
          )}
        </div>
      ) : (
        /* ==================== DATA TABLE VIEW ==================== */
        <div className="admin-card overflow-x-auto lg:overflow-visible">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th className="hidden sm:table-cell">Role</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Joined</th>
                <th className="hidden md:table-cell">Orders</th>
                <th className="hidden lg:table-cell">Spending</th>
                <th className="admin-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <p className="text-sm font-medium text-slate-400">No users found</p>
                  </td>
                </tr>
              )}
              {data?.content.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#ff6a00] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {(u.firstName?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="admin-badge bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                      {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell text-sm text-slate-500 whitespace-nowrap">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="hidden md:table-cell font-semibold text-slate-800 dark:text-slate-200">{u.totalOrders}</td>
                  <td className="hidden lg:table-cell font-display font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {inr(u.totalSpending)}
                  </td>
                  <td className="admin-td-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(u)} className="admin-action text-[#ff6a00]">
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setResetTarget(u);
                          setResetPassword('');
                          setResetError('');
                        }}
                        className="admin-action text-amber-600"
                      >
                        <KeyRound size={13} /> Reset
                      </button>
                      {!(u.role === 'ROLE_ADMIN' && u.enabled) && (
                        <button
                          onClick={() => setToggleTarget(u)}
                          className={`admin-action ${u.enabled ? 'text-red-500' : 'text-emerald-600'}`}
                        >
                          {u.enabled ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPage={setPage}
              totalElements={data.totalElements}
              pageSize={10}
            />
          )}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit User" subtitle={editing?.email}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {editError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{editError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <UserIcon size={11} className="inline mr-1" />
                First Name
              </label>
              <input
                value={editForm.firstName}
                onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                <UserIcon size={11} className="inline mr-1" />
                Last Name
              </label>
              <input
                value={editForm.lastName}
                onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>
              <Mail size={11} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              <Phone size={11} className="inline mr-1" />
              Phone
            </label>
            <input
              value={editForm.phone}
              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <ShieldCheck size={11} className="inline mr-1" />
              Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
              className={inputClass}
            >
              <option value="ROLE_CUSTOMER">Customer</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={editSaving} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#ff6a00]">
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset password modal */}
      <Modal open={!!resetTarget} onClose={() => setResetTarget(null)} title="Reset Password" subtitle={resetTarget?.email}>
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {resetError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{resetError}</div>}
          <div>
            <label className={labelClass}>
              <KeyRound size={11} className="inline mr-1" />
              New Password
            </label>
            <input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              className={inputClass}
              placeholder="Minimum 6 characters"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setResetTarget(null)}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={resetSaving} className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#ff6a00]">
              {resetSaving ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Enable/disable confirm */}
      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.enabled ? 'Disable User' : 'Enable User'}
        message={
          toggleTarget
            ? toggleTarget.enabled
              ? `Disable ${toggleTarget.firstName} ${toggleTarget.lastName}? They will no longer be able to sign in.`
              : `Enable ${toggleTarget.firstName} ${toggleTarget.lastName}? They will be able to sign in again.`
            : ''
        }
        confirmLabel={toggleTarget?.enabled ? 'Disable' : 'Enable'}
        danger={!!toggleTarget?.enabled}
        loading={toggleBusy}
        onConfirm={handleToggle}
        onCancel={() => setToggleTarget(null)}
      />
    </AdminLayout>
  );
}
