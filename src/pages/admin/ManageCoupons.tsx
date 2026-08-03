import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TicketPercent } from 'lucide-react';
import { couponService } from '../../services/couponService';
import type { Coupon } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discountPercent: '', maxDiscount: '', minOrderAmount: '',
    usageLimit: '100', active: true, validFrom: '', validUntil: '',
  });

  const fetchCoupons = () => {
    couponService.getAll().then((res) => {
      setCoupons(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await couponService.create({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: Number(form.usageLimit),
        active: form.active,
        validFrom: form.validFrom ? new Date(form.validFrom) : undefined,
        validUntil: form.validUntil ? new Date(form.validUntil) : undefined,
      } as unknown as Omit<Coupon, 'id' | 'usedCount'>);
      setShowForm(false);
      setForm({ code: '', discountPercent: '', maxDiscount: '', minOrderAmount: '', usageLimit: '100', active: true, validFrom: '', validUntil: '' });
      fetchCoupons();
    } catch { alert('Failed to create coupon'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await couponService.delete(id);
      fetchCoupons();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete coupon';
      alert(msg);
    }
  };

  if (loading) return <LoadingSpinner />;

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <TicketPercent size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Coupons</h1>
            <p className="text-slate-500 text-sm">Create discount codes for your store</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-gradient shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Coupon</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-8"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">New Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Code</label>
              <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className={inputClass} placeholder="SPORTX20" required />
            </div>
            <div>
              <label className={labelClass}>Discount %</label>
              <input type="number" value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: e.target.value }))} className={inputClass} required />
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
          <button type="submit" className="btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm mt-5">
            Create Coupon
          </button>
        </motion.form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Code</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Discount</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Used</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Limit</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Active</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5">
                  <span className="font-mono font-bold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-lg">{c.code}</span>
                </td>
                <td className="py-3.5 px-5 font-display font-bold text-slate-900">{c.discountPercent}%</td>
                <td className="py-3.5 px-5 text-sm text-slate-600">
                  {c.usedCount}/{c.usageLimit}
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-fuchsia-500 rounded-full" style={{ width: `${Math.min(100, (c.usedCount / (c.usageLimit || 1)) * 100)}%` }} />
                  </div>
                </td>
                <td className="py-3.5 px-5 text-sm text-slate-600">{c.usageLimit}</td>
                <td className="py-3.5 px-5">
                  {c.active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5">
                  <button onClick={() => handleDelete(c.id)} className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
