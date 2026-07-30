import { useState, useEffect, FormEvent } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import type { Product, Category, Brand, PagedResponse } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    });
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
      alert('Failed to save product');
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
    await productService.delete(id);
    fetchProducts();
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', discountedPrice: '', stockQuantity: '10', categoryId: '', brandId: '', imageUrls: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); resetForm(); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Name</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Discounted Price</label><input type="number" step="0.01" value={form.discountedPrice} onChange={(e) => setForm((p) => ({ ...p, discountedPrice: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Stock Quantity</label><input type="number" value={form.stockQuantity} onChange={(e) => setForm((p) => ({ ...p, stockQuantity: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Category</label><select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required><option value="">Select</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium">Brand</label><select value={form.brandId} onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required><option value="">Select</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" rows={3} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium">Image URLs (comma-separated)</label><input value={form.imageUrls} onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" placeholder="https://images.unsplash.com/photo-..." />
              {form.imageUrls && <img src={form.imageUrls.split(',')[0].trim()} alt="preview" className="h-24 mt-2 rounded object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 mt-4">
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.content.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {p.primaryImage ? <img src={p.primaryImage} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">N/A</div>}
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate font-medium">{p.name}</td>
                  <td className="py-3 px-4">₹{p.discountedPrice || p.price}</td>
                  <td className="py-3 px-4">{p.stockQuantity}</td>
                  <td className="py-3 px-4">{p.categoryName}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products && products.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array.from({ length: products.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} className={`px-3 py-1 rounded ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
