import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { brandService } from '../../services/brandService';
import type { Brand } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ManageBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });

  const fetchBrands = () => {
    brandService.getAll().then((res) => {
      setBrands(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await brandService.update(editing.id, form);
      else await brandService.create(form);
      setShowForm(false); setEditing(null); setForm({ name: '', description: '', imageUrl: '' });
      fetchBrands();
    } catch { alert('Failed to save brand'); }
  };

  const handleEdit = (brand: Brand) => {
    setForm({ name: brand.name, description: brand.description || '', imageUrl: brand.imageUrl || '' });
    setEditing(brand);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await brandService.delete(id);
      fetchBrands();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete brand';
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Brands</h1>
            <p className="text-slate-500 text-sm">Add and manage product brands</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', imageUrl: '' }); }}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-gradient shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Brand</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-8 max-w-2xl"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">{editing ? 'Edit' : 'New'} Brand</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm mt-5">
            {editing ? 'Update Brand' : 'Create Brand'}
          </button>
        </motion.form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Name</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Products</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-800">{brand.name}</td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">{brand.productCount}</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(brand)} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(brand.id)} className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
