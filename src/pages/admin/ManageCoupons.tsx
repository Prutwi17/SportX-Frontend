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

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
            <TicketPercent size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Coupons</h1>
            <p className="text-slate-500 text-sm">Create discount codes for your store</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-accent shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Coupon</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="admin-card p-7 mb-8"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">New Coupon</h2>
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
              <input type="number" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Valid From</label>
              <input type="datetime-local" value={form.validFrom} onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Valid Until</label>
              <input type="datetime-local" value={form.validUntil} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))} className={inputClass} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className={`flex-1 btn-accent px-6 py-3 rounded-2xl font-display font-semibold text-sm uppercase tracking-wide ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
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
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td>
                  <span className="font-mono font-bold text-brand-600 bg-brand-50 border border-brand-100 dark:bg-white/10 dark:border-white/10 px-3 py-1 rounded-lg">{c.code}</span>
                </td>
                <td className="font-display font-bold text-slate-900">{c.discountPercent}%</td>
                <td className="hidden sm:table-cell">
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-accent-600 rounded-full" style={{ width: `${Math.min(100, (c.usedCount / (c.usageLimit || 1)) * 100)}%` }} />
                    </div>
                    <span className="text-sm text-slate-600 whitespace-nowrap">{c.usedCount}/{c.usageLimit}</span>
                  </div>
                </td>
                <td>
                  {c.active ? (
                    <span className="admin-badge bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="admin-badge bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
                    </span>
                  )}
                </td>
                <td className="admin-td-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => setDeleteTarget(c)} className="admin-action text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-white/10">
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
