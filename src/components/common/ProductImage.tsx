import { useState } from 'react';
import { Tag } from 'lucide-react';

interface Props {
  src?: string | null;
  alt?: string;
  className?: string;
}

function normalizeUrl(src?: string | null): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('/@fs/') || trimmed.includes('/assets/') || trimmed.includes('assets/')) {
    return trimmed;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const apiBase = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
      : '';
    return `${apiBase}${cleanPath}`;
  }
  if (trimmed.startsWith('/')) return trimmed;
  return trimmed;
}

export default function ProductImage({ src, alt = '', className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeUrl(src);

  if (!normalized || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400 ${className}`}>
        <Tag className="w-1/3 h-1/3 min-w-[16px] min-h-[16px]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={normalized}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
