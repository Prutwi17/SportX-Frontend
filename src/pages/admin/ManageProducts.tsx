import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Eye,
  RefreshCw,
  Star,
  Trash,
  X,
  LayoutGrid,
  List,
  Tag,
  Boxes,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import type { Product, Category, Brand, PagedResponse } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductImage from '../../components/common/ProductImage';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
import Pagination from '../../components/admin/Pagination';

type StockFilter = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

const stockFilterLabels: Record<StockFilter, string> = {
  ALL: 'All Stock',
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

export default function ManageProducts() {
  const [products, setProducts] = useState<PagedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('ALL');

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    stockQuantity: '10',
    categoryId: '',
    brandId: '',
    imageUrls: '',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      stockQuantity: '10',
      categoryId: '',
      brandId: '',
      imageUrls: '',
    });
  };

  const fetchProducts = () => {
    setLoading(true);
    productService
      .adminList({
        page,
        size: viewMode === 'grid' ? 12 : 10,
        keyword: appliedKeyword || undefined,
        categoryId: categoryFilter || undefined,
        brandId: brandFilter || undefined,
        stockStatus: stockFilter,
      })
      .then((res) => {
        setProducts(res.data);
        setSelected(new Set());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    categoryService.getAll().then((res) => setCategories(res.data));
    brandService.getAll().then((res) => setBrands(res.data));
  }, [page, appliedKeyword, categoryFilter, brandFilter, stockFilter, viewMode]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setAppliedKeyword(keyword.trim());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsedImages = form.imageUrls
      ? form.imageUrls
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
      imageUrls: parsedImages && parsedImages.length > 0 ? parsedImages : editingId ? undefined : [],
    };

    try {
      if (editingId) {
        setProducts((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((item) =>
                  item.id === editingId
                    ? {
                        ...item,
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        discountedPrice: data.discountedPrice || 0,
                        stockQuantity: data.stockQuantity,
                      }
                    : item
                ),
              }
            : prev
        );
        await productService.update(editingId, data as unknown as Record<string, unknown>);
        showToast('Product updated successfully');
      } else {
        await productService.create(data as unknown as Record<string, unknown>);
        showToast('Product created successfully');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
      fetchProducts();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleteBusy(true);
    // Optimistic Real-Time Removal from UI
    setProducts((prev) =>
      prev
        ? {
            ...prev,
            content: prev.content.filter((item) => item.id !== targetId),
            totalElements: Math.max(0, prev.totalElements - 1),
          }
        : prev
    );
    setDeleteTarget(null);
    try {
      await productService.delete(targetId);
      showToast('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete product';
      showToast(msg, 'error');
      fetchProducts();
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    const targets = Array.from(selected);
    setDeleteBusy(true);
    // Optimistic Real-Time Bulk Removal
    setProducts((prev) =>
      prev
        ? {
            ...prev,
            content: prev.content.filter((item) => !selected.has(item.id)),
            totalElements: Math.max(0, prev.totalElements - selected.size),
          }
        : prev
    );
    setBulkDeleteOpen(false);
    setSelected(new Set());
    try {
      await Promise.all(targets.map((id) => productService.delete(id)));
      showToast(`${targets.length} product(s) deleted successfully`);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed bulk delete';
      showToast(msg, 'error');
      fetchProducts();
    } finally {
      setDeleteBusy(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!products) return;
    if (selected.size === products.content.length) setSelected(new Set());
    else setSelected(new Set(products.content.map((p) => p.id)));
  };

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide';

  return (
    <AdminLayout>
      <Toast message={toast} type={toastType} />

      {/* Header & Page Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ff6a00] flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
            <Package size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Inventory Catalog
            </h1>
            <p className="text-slate-500 text-sm">
              Manage products, stock levels, categories and pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-200/80 dark:bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-800 text-[#ff6a00] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={15} /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-dark-800 text-[#ff6a00] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List size={15} /> Table View
            </button>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              } else {
                resetForm();
                setEditingId(null);
                setShowForm(true);
              }
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide transition-all ${
              showForm
                ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-[#ff6a00] text-white hover:bg-[#ea580c] shadow-lg shadow-orange-500/25'
            }`}
          >
            {showForm ? 'Cancel' : <><Plus size={16} /> Add Product</>}
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6a00] flex items-center justify-center font-bold">
            <Boxes size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Products</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{products?.totalElements || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Categories</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold">
            <Tag size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Brands</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{brands.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Filter Applied</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[120px]">
              {stockFilterLabels[stockFilter]}
            </p>
          </div>
        </div>
      </div>

      {/* Form Drawer / Card */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="admin-card p-6 mb-8 border-2 border-[#ff6a00]/30"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Package size={18} className="text-[#ff6a00]" />
            {editingId ? 'Edit Product' : 'Create New Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Nike Mercurial Vapor 16"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Discounted Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.discountedPrice}
                  onChange={(e) => setForm((p) => ({ ...p, discountedPrice: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm((p) => ({ ...p, stockQuantity: e.target.value }))}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className={inputClass}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <select
                  value={form.brandId}
                  onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))}
                  className={inputClass}
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={inputClass}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Image URLs (comma-separated)</label>
              <input
                value={form.imageUrls}
                onChange={(e) => setForm((p) => ({ ...p, imageUrls: e.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
              {form.imageUrls && (
                <ProductImage
                  src={form.imageUrls.split(',')[0].trim()}
                  alt="preview"
                  className="h-24 mt-2 rounded-xl object-contain bg-slate-50 dark:bg-dark-900 p-2"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ff6a00] hover:bg-[#ea580c] text-white px-8 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide shadow-lg shadow-orange-500/25"
            >
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-premium input-with-icon"
            placeholder="Search products by name..."
          />
        </form>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setPage(0);
            setCategoryFilter(e.target.value);
          }}
          className="input-premium w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => {
            setPage(0);
            setBrandFilter(e.target.value);
          }}
          className="input-premium w-auto"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => {
            setPage(0);
            setStockFilter(e.target.value as StockFilter);
          }}
          className="input-premium w-auto"
        >
          {(Object.keys(stockFilterLabels) as StockFilter[]).map((k) => (
            <option key={k} value={k}>
              {stockFilterLabels[k]}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setPage(0);
            setKeyword('');
            setAppliedKeyword('');
            setCategoryFilter('');
            setBrandFilter('');
            setStockFilter('ALL');
          }}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl px-5 py-3 mb-5">
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
            {selected.size} product(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <X size={14} /> Clear
            </button>
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:-translate-y-0.5 transition-transform shadow-lg shadow-red-500/30"
            >
              <Trash size={14} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : viewMode === 'grid' ? (
        /* ==================== CATALOG CARDS GRID VIEW ==================== */
        <div>
          {products?.content.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10">
              <Package size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-800 dark:text-white text-base">No products found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting search query or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products?.content.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-white dark:bg-dark-800 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden p-4"
                >
                  {/* Image Header Tile */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-dark-900 rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
                    <ProductImage
                      src={p.primaryImage}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock status pill */}
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        p.stockQuantity === 0
                          ? 'bg-red-500 text-white'
                          : p.stockQuantity <= 5
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {p.stockQuantity === 0 ? 'Out of Stock' : `${p.stockQuantity} left`}
                    </span>

                    {/* Rating badge */}
                    <span className="absolute bottom-2.5 right-2.5 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-sm">
                      <Star size={11} className="text-amber-400 fill-current" />
                      {p.averageRating ? p.averageRating.toFixed(1) : '4.8'}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      {p.brandName || p.categoryName || 'SportX'}
                    </p>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1 mb-2">
                      {p.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display font-extrabold text-slate-900 dark:text-white text-lg">
                        ₹{(p.discountedPrice || p.price).toLocaleString('en-IN')}
                      </span>
                      {p.discountedPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="mt-auto grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-100 dark:border-white/5">
                      <a
                        href={`/products/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-action justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                        title="View on store"
                      >
                        <Eye size={13} /> View
                      </a>
                      <button
                        onClick={() => handleEdit(p)}
                        className="admin-action justify-center text-[#ff6a00] hover:bg-orange-50 dark:hover:bg-orange-950/40"
                        title="Edit product"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="admin-action justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete product"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={products.totalPages}
                onPage={setPage}
                totalElements={products.totalElements}
                pageSize={12}
              />
            </div>
          )}
        </div>
      ) : (
        /* ==================== DATA TABLE VIEW ==================== */
        <div className="admin-card overflow-x-auto lg:overflow-visible">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-12 hidden sm:table-cell">
                  <input
                    type="checkbox"
                    checked={!!products && products.content.length > 0 && selected.size === products.content.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[#ff6a00]"
                  />
                </th>
                <th>Product</th>
                <th className="hidden md:table-cell">Brand</th>
                <th className="hidden xl:table-cell">Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="hidden 2xl:table-cell">Rating</th>
                <th>Status</th>
                <th className="admin-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.content.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <p className="text-sm font-medium text-slate-400">No products found</p>
                  </td>
                </tr>
              )}
              {products?.content.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="hidden sm:table-cell">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="w-4 h-4 accent-[#ff6a00]"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductImage
                        src={p.primaryImage}
                        alt={p.name}
                        className="h-11 w-11 rounded-xl object-contain bg-slate-50 dark:bg-dark-900 p-1 shrink-0"
                      />
                      <span className="max-w-[220px] truncate font-semibold text-slate-800 dark:text-slate-100">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-sm text-slate-600 dark:text-slate-400">{p.brandName || '—'}</td>
                  <td className="hidden xl:table-cell text-sm text-slate-600 dark:text-slate-400">{p.categoryName || '—'}</td>
                  <td>
                    <div className="whitespace-nowrap font-display font-bold text-slate-900 dark:text-white">
                      ₹{p.discountedPrice || p.price}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        p.stockQuantity === 0
                          ? 'bg-red-100 text-red-700'
                          : p.stockQuantity <= 5
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {p.stockQuantity} left
                    </span>
                  </td>
                  <td className="hidden 2xl:table-cell">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <Star size={13} className="text-amber-400 fill-current" />
                      {p.averageRating ? p.averageRating.toFixed(1) : '4.8'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="admin-td-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/products/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-action text-slate-600 dark:text-slate-300"
                        title="View on store"
                      >
                        <Eye size={13} /> View
                      </a>
                      <button
                        onClick={() => handleEdit(p)}
                        className="admin-action text-[#ff6a00]"
                        title="Edit product"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="admin-action text-red-500"
                        title="Delete product"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products && (
            <Pagination
              page={page}
              totalPages={products.totalPages}
              onPage={setPage}
              totalElements={products.totalElements}
              pageSize={10}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Delete "${deleteTarget?.name}"? This will mark the product as inactive.`}
        confirmLabel="Delete"
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Delete Selected Products"
        message={`Delete ${selected.size} selected product(s)?`}
        confirmLabel={`Delete ${selected.size}`}
        loading={deleteBusy}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </AdminLayout>
  );
}
