import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import type { Product, Category, Brand, PagedResponse } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/common/ProductCard';
import SectionHeading from '../components/common/SectionHeading';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<PagedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  const page = parseInt(searchParams.get('page') || '0');

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
    fetchProducts();
  }, [page, search, filters]);

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
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ categoryId: '', brandId: '', minPrice: '', maxPrice: '', minRating: '' });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
      <SectionHeading
        eyebrow="Catalogue"
        title="Products"
        subtitle="Find the perfect gear for your sport"
      />

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-premium input-with-icon"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm"
          >
            Search
          </motion.button>
        </form>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className="border border-slate-200 rounded-2xl px-5 py-3 font-display font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden mb-6"
      >
        <div className="bg-white border border-slate-100 shadow-soft rounded-3xl p-6 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Category</label>
            <select value={filters.categoryId} onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="input-premium">
              <option value="">All</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Brand</label>
            <select value={filters.brandId} onChange={(e) => handleFilterChange('brandId', e.target.value)}
              className="input-premium">
              <option value="">All</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Min Price</label>
            <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="₹0" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Max Price</label>
            <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="₹10000" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Min Rating</label>
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
              <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600">
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
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
            <PackageSearch size={36} className="text-slate-400" />
          </div>
          <p className="font-display text-xl font-bold text-slate-800">No products found</p>
          <p className="text-slate-500 mt-1.5">Try adjusting your filters or search term.</p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mt-8 mb-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-700 dark:text-slate-200">{products.content.length}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{products.totalElements}</span> products
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Page <span className="font-bold text-slate-700 dark:text-slate-200">{page + 1}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{products.totalPages}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {products.content.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {products.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('page', String(page - 1));
                    return next;
                  })
                }
                disabled={page === 0}
                aria-label="Previous page"
                className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </motion.button>
              {Array.from({ length: products.totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('page', String(i));
                      return next;
                    })
                  }
                  className={`w-10 h-10 rounded-xl font-display font-semibold transition-all ${
                    i === page
                      ? 'btn-gradient shadow-lg'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('page', String(page + 1));
                    return next;
                  })
                }
                disabled={products.last}
                aria-label="Next page"
                className="w-10 h-10 rounded-xl font-display font-semibold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
