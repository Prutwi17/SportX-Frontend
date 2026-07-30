import { useState, useEffect, FormEvent } from 'react';
import { couponService } from '../../services/couponService';
import type { Coupon } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    });
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
    await couponService.delete(id);
    fetchCoupons();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Add Coupon'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">New Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium">Code</label><input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Discount %</label><input type="number" value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Max Discount</label><input type="number" step="0.01" value={form.maxDiscount} onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Min Order</label><input type="number" step="0.01" value={form.minOrderAmount} onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Usage Limit</label><input type="number" value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Valid From</label><input type="datetime-local" value={form.validFrom} onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Valid Until</label><input type="datetime-local" value={form.validUntil} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div className="flex items-center mt-6"><label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} /> Active</label></div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 mt-4">Create Coupon</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50"><tr><th className="py-3 px-4">Code</th><th className="py-3 px-4">Discount</th><th className="py-3 px-4">Used</th><th className="py-3 px-4">Limit</th><th className="py-3 px-4">Active</th><th className="py-3 px-4">Actions</th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{c.code}</td>
                <td className="py-3 px-4">{c.discountPercent}%</td>
                <td className="py-3 px-4">{c.usedCount}/{c.usageLimit}</td>
                <td className="py-3 px-4">{c.active ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</td>
                <td className="py-3 px-4">{c.usageLimit}</td>
                <td className="py-3 px-4"><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
