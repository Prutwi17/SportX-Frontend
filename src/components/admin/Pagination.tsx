import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  totalElements?: number;
  pageSize?: number;
}

function getPageWindow(page: number, totalPages: number): (number | 'ellipsis-l' | 'ellipsis-r')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
  const items: (number | 'ellipsis-l' | 'ellipsis-r')[] = [0];
  if (page > 3) items.push('ellipsis-l');
  for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) items.push(i);
  if (page < totalPages - 4) items.push('ellipsis-r');
  items.push(totalPages - 1);
  return items;
}

export default function Pagination({ page, totalPages, onPage, totalElements, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = page * (pageSize || 1) + 1;
  const to = Math.min((page + 1) * (pageSize || 1), totalElements || 0);
  const items = getPageWindow(page, totalPages);

  const navBtn =
    'w-9 h-9 rounded-xl flex items-center justify-center font-display font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
      {typeof totalElements === 'number' && totalElements > 0 ? (
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{from}–{to}</span> of{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{totalElements}</span>
        </p>
      ) : <span />}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(Math.max(0, page - 1))}
          disabled={page === 0}
          aria-label="Previous page"
          className={`${navBtn} bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`}
        >
          <ChevronLeft size={16} />
        </button>
        {items.map((p, i) =>
          typeof p === 'string' ? (
            <span key={`${p}-${i}`} className="px-1 text-slate-400 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`${navBtn} ${
                p === page
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {p + 1}
            </button>
          )
        )}
        <button
          onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className={`${navBtn} bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
