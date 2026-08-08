import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, PackageSearch, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import type { Product, Category, Brand, PagedResponse } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/common/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<PagedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '0');
  const filters = {
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 16 };
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.brandId) params.brandId = filters.brandId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;

      let res;
      if (search) {
        res = await productService.search(search, page, 16);
      } else if (Object.values(filters).some(Boolean)) {
        res = await productService.filter(params);
      } else {
        res = await productService.getAll(page, 16);
      }
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
    brandService.getAll().then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('q', search);
      next.set('page', '0');
      return next;
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '0');
      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('categoryId');
      next.delete('brandId');
      next.delete('minPrice');
      next.delete('maxPrice');
      next.delete('minRating');
      next.set('page', '0');
      return next;
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const goToPage = (target: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(target));
      return next;
    });

  return (
    <div className="overflow-x-hidden">
      {/* Page header */}
      <div className="relative bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_85%_-10%,rgba(249,115,22,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_-10%_120%,rgba(249,115,22,0.12),transparent)]" />
        <div className="absolute -top-24 left-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-3">
            <Zap size={12} fill="currentColor" className="text-brand-500" />
            SportX Catalogue
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
            {search ? (
              <>Results for <span className="text-gradient-brand">{`"${search}"`}</span></>
            ) : (
              <>EVERY GEAR.<span className="text-gradient-brand"> EVERY GAME.</span></>
            )}
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
            Find the perfect gear for your sport — shoes, jerseys, equipment and more.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-premium pl-11"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-accent px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide"
            >
              Search
            </motion.button>
          </form>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl px-5 py-3 font-display font-semibold text-sm transition-all flex items-center gap-2 border ${
              activeFilterCount > 0
                ? 'border-brand-500/50 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          className="overflow-hidden mb-8"
        >
          <div className="bg-white dark:bg-dark-800 border border-slate-100 dark:border-white/10 shadow-soft rounded-2xl p-6 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Category</label>
              <select value={filters.categoryId} onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="input-premium">
                <option value="">All</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Brand</label>
              <select value={filters.brandId} onChange={(e) => handleFilterChange('brandId', e.target.value)}
                className="input-premium">
                <option value="">All</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Min Price</label>
              <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="₹0" className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Max Price</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="₹10000" className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Min Rating</label>
              <select value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="input-premium">
                <option value="">Any</option>
                <option value="4">4+ ★</option>
                <option value="3">3+ ★</option>
                <option value="2">2+ ★</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className="col-span-full flex justify-end">
                <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                  <X size={14} /> Clear all filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {loading ? (
          <LoadingSpinner />
        ) : !products || products.content.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-5">
              <PackageSearch size={36} className="text-brand-500" />
            </div>
            <p className="font-display text-xl font-bold text-slate-800 dark:text-white">No products found</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="btn-accent mt-6 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-700 dark:text-slate-200">{products.content.length}</span> of{' '}
                <span className="font-bold text-slate-700 dark:text-slate-200">{products.totalElements}</span> products
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Page <span className="font-bold text-slate-700 dark:text-slate-200">{page + 1}</span> of{' '}
                <span className="font-bold text-slate-700 dark:text-slate-200">{products.totalPages}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.content.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {products.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="mx-auto" />
                </motion.button>
                {Array.from({ length: products.totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goToPage(i)}
                    className={`w-10 h-10 rounded-xl font-display font-semibold transition-all ${
                      i === page
                        ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30'
                        : 'bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(page + 1)}
                  disabled={products.last}
                  aria-label="Next page"
                  className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="mx-auto" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
