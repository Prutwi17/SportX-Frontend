import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import type { Product, Category, Brand, PagedResponse } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductImage from '../../components/common/ProductImage';

export default function ManageProducts() {
  const [products, setProducts] = useState<PagedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountedPrice: '',
    stockQuantity: '10', categoryId: '', brandId: '', imageUrls: '',
  });

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll(page, 10).then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    categoryService.getAll().then((res) => setCategories(res.data));
    brandService.getAll().then((res) => setBrands(res.data));
  }, [page]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
      imageUrls: form.imageUrls ? form.imageUrls.split(',').map((s) => s.trim()) : [],
    };

    try {
      if (editingId) {
        await productService.update(editingId, data as unknown as Record<string, unknown>);
      } else {
        await productService.create(data as unknown as Record<string, unknown>);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save product';
      alert(msg);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      discountedPrice: product.discountedPrice ? String(product.discountedPrice) : '',
      stockQuantity: String(product.stockQuantity),
      categoryId: String(product.categoryId),
      brandId: String(product.brandId),
      imageUrls: product.imageUrls?.join(', ') || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      fetchProducts();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete product';
      alert(msg);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', discountedPrice: '', stockQuantity: '10', categoryId: '', brandId: '', imageUrls: '' });
  };

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Products</h1>
            <p className="text-slate-500 text-sm">Add, edit and remove products</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all ${showForm ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'btn-gradient shadow-lg'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-8"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">{editingId ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Discounted Price (₹)</label>
              <input type="number" step="0.01" value={form.discountedPrice} onChange={(e) => setForm((p) => ({ ...p, discountedPrice: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input type="number" value={form.stockQuantity} onChange={(e) => setForm((p) => ({ ...p, stockQuantity: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} className={inputClass} required>
                <option value="">Select</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <select value={form.brandId} onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))} className={inputClass} required>
                <option value="">Select</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Image URLs (comma-separated)</label>
              <input value={form.imageUrls} onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))} className={inputClass} placeholder="https://images.unsplash.com/photo-..." />
              {form.imageUrls && <ProductImage src={form.imageUrls.split(',')[0].trim()} alt="preview" className="h-24 mt-2 rounded-xl object-cover" />}
            </div>
          </div>
          <button type="submit" className="btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm mt-5">
            {editingId ? 'Update Product' : 'Create Product'}
          </button>
        </motion.form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Image</th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Name</th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Price</th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Stock</th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Category</th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.content.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5">
                    <ProductImage src={p.primaryImage} alt={p.name} className="h-11 w-11 rounded-xl object-cover" />
                  </td>
                  <td className="py-3 px-5 max-w-[200px] truncate font-semibold text-slate-800">{p.name}</td>
                  <td className="py-3 px-5">
                    <div>
                      {p.discountedPrice ? (
                        <>
                          <span className="font-display font-bold text-slate-900">₹{p.discountedPrice}</span>
                          <span className="text-xs text-slate-400 line-through ml-1.5">₹{p.price}</span>
                        </>
                      ) : (
                        <span className="font-display font-bold text-slate-900">₹{p.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.stockQuantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-slate-600">{p.categoryName}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products && products.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-5">
              {Array.from({ length: products.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-xl font-display font-semibold text-sm transition-all ${i === page ? 'btn-gradient shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
