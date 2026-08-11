import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TicketPercent } from 'lucide-react';
import { couponService } from '../../services/couponService';
import type { Coupon } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';

const emptyForm = {
  code: '', discountPercent: '', maxDiscount: '', minOrderAmount: '',
  usageLimit: '100', active: true, validFrom: '', validUntil: '',
};

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  const fetchCoupons = () => {
    setLoading(true);
    couponService.getAll().then((res) => {
      setCoupons(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponService.create({
        code: form.code.trim(),
        discountPercent: Number(form.discountPercent),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: Number(form.usageLimit),
        active: form.active,
        validFrom: form.validFrom ? new Date(form.validFrom) : undefined,
        validUntil: form.validUntil ? new Date(form.validUntil) : undefined,
      } as unknown as Omit<Coupon, 'id' | 'usedCount'>);
      setShowForm(false);
      setForm(emptyForm);
      fetchCoupons();
      showToast('Coupon created successfully');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create coupon';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleteBusy(true);
    // Real-Time Optimistic Removal
    setCoupons((prev) => prev.filter((c) => c.id !== targetId));
    setDeleteTarget(null);
    try {
      await couponService.delete(targetId);
      showToast('Coupon deleted successfully');
      fetchCoupons();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete coupon';
      showToast(msg, 'error');
      fetchCoupons();
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <AdminLayout>
      <Toast message={toast} type={toastType} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-amber-600 flex items-center justify-center shadow-md text-white shrink-0">
            <TicketPercent size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Coupons</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create and manage promotional discount codes</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shrink-0 ${
            showForm
              ? 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              : 'bg-[#ff6a00] text-white hover:bg-[#ea580c] shadow-lg shadow-orange-500/25'
          }`}
        >
          {showForm ? 'Cancel' : <><Plus size={15} /> Add Coupon</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="admin-card p-6 mb-8 border-2 border-[#ff6a00]/30"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <TicketPercent size={18} className="text-[#ff6a00]" />
            Create New Coupon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Code</label>
              <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className={inputClass} placeholder="SPORTX20" required />
            </div>
            <div>
              <label className={labelClass}>Discount %</label>
              <input type="number" min="1" max="100" value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Max Discount (₹)</label>
              <input type="number" step="0.01" value={form.maxDiscount} onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Min Order (₹)</label>
              <input type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Usage Limit</label>
              <input type="number" min="1" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expiry Date</label>
              <input type="datetime-local" value={form.validUntil} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={saving} className={`bg-[#ff6a00] hover:bg-[#ea580c] text-white px-8 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide shadow-lg shadow-orange-500/25 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="admin-card overflow-x-auto lg:overflow-visible">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th className="hidden sm:table-cell">Usage</th>
              <th>Status</th>
              <th className="admin-th-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="py-14 text-center">
                  <p className="text-sm font-medium text-slate-400">No coupons yet</p>
                  <p className="text-xs text-slate-400/80 mt-1">Create a discount code to promote your store</p>
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                <td>
                  <span className="font-mono font-bold text-[#ff6a00] bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/40 px-3 py-1 rounded-lg text-xs">{c.code}</span>
                </td>
                <td className="font-display font-extrabold text-slate-900 dark:text-white">{c.discountPercent}% OFF</td>
                <td className="hidden sm:table-cell">
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6a00] rounded-full" style={{ width: `${Math.min(100, (c.usedCount / (c.usageLimit || 1)) * 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.usedCount}/{c.usageLimit}</span>
                  </div>
                </td>
                <td>
                  {c.active ? (
                    <span className="admin-badge bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="admin-badge bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
                    </span>
                  )}
                </td>
                <td className="admin-td-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => setDeleteTarget(c)} className="admin-action text-red-500" title="Delete coupon">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Coupon"
        message={`Delete coupon "${deleteTarget?.code}"? Customers will no longer be able to use this code.`}
        confirmLabel="Delete"
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
