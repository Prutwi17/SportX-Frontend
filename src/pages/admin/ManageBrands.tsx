import { useState, useEffect, FormEvent } from 'react';
import { brandService } from '../../services/brandService';
import type { Brand } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    });
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
    await brandService.delete(id);
    fetchBrands();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Brands</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', imageUrl: '' }); }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Add Brand'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'New'} Brand</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium">Name</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div><label className="block text-sm font-medium">Image URL</label><input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 mt-4">{editing ? 'Update' : 'Create'}</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50"><tr><th className="py-3 px-4">Name</th><th className="py-3 px-4">Products</th><th className="py-3 px-4">Actions</th></tr></thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{brand.name}</td>
                <td className="py-3 px-4">{brand.productCount}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => handleEdit(brand)} className="text-indigo-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
