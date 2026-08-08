import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderOpen, AlertCircle, Eye } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  const fetchCategories = () => {
    setLoading(true);
    categoryService.getAll().then((res) => {
      setCategories(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError('Category name is required');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...form, name } : c))
        );
        await categoryService.update(editing.id, { ...form, name });
        showToast('Category updated successfully');
      } else {
        await categoryService.create({ ...form, name });
        showToast('Category created successfully');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', imageUrl: '' });
      fetchCategories();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save category';
      showToast(msg, 'error');
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '' });
    setFormError('');
    setEditing(cat);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleteBusy(true);
    // Real-Time Optimistic State Removal
    setCategories((prev) => prev.filter((c) => c.id !== targetId));
    setDeleteTarget(null);
    try {
      await categoryService.delete(targetId);
      showToast('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete category';
      showToast(msg, 'error');
      fetchCategories();
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
            <FolderOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Categories</h1>
            <p className="text-slate-500 text-sm">Organize your store by sport</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', imageUrl: '' }); setFormError(''); }}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-accent shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Category</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="admin-card p-7 mb-8 max-w-2xl"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">{editing ? 'Edit' : 'New'} Category</h2>
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
              <AlertCircle size={15} className="shrink-0" /> {formError}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="e.g. Football" required />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} placeholder="Short description of this category" />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className={`flex-1 btn-accent px-6 py-3 rounded-2xl font-display font-semibold text-sm uppercase tracking-wide ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="admin-card overflow-x-auto lg:overflow-visible">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Description</th>
              <th>Products</th>
              <th className="admin-th-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="py-14 text-center">
                  <p className="text-sm font-medium text-slate-400">No categories yet</p>
                  <p className="text-xs text-slate-400/80 mt-1">Create your first category to get started</p>
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td>
                  <div className="flex items-center gap-3 min-w-0">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="h-10 w-10 rounded-xl object-cover shrink-0" loading="lazy" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <FolderOpen size={16} className="text-brand-600" />
                      </div>
                    )}
                    <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                  </div>
                </td>
                <td className="hidden sm:table-cell text-sm text-slate-500">
                  <span className="block max-w-[320px] truncate">{cat.description || '—'}</span>
                </td>
                <td>
                  <span className="admin-badge bg-brand-50 text-brand-700 dark:bg-white/10">{cat.productCount}</span>
                </td>
                <td className="admin-td-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <a href={`/products?categoryId=${cat.id}`} target="_blank" rel="noreferrer" className="admin-action text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10" title="View products in this category">
                      <Eye size={13} /> View
                    </a>
                    <button onClick={() => handleEdit(cat)} className="admin-action text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} className="admin-action text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-white/10">
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
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Products in this category will become uncategorized.`}
        confirmLabel="Delete"
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
