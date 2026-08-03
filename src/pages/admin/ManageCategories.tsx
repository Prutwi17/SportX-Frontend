import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });

  const fetchCategories = () => {
    categoryService.getAll().then((res) => {
      setCategories(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoryService.update(editing.id, form);
      } else {
        await categoryService.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', imageUrl: '' });
      fetchCategories();
    } catch { alert('Failed to save category'); }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '' });
    setEditing(cat);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete category';
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FolderOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Categories</h1>
            <p className="text-slate-500 text-sm">Organize your store by sport</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', imageUrl: '' }); }}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-gradient shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-8 max-w-2xl"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">{editing ? 'Edit' : 'New'} Category</h2>
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
            {editing ? 'Update Category' : 'Create Category'}
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
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-800">{cat.name}</td>
                <td className="py-3.5 px-5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">{cat.productCount}</span>
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(cat)} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
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
