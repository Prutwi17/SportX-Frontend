import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  ids: Set<number>;
  count: number;
  loading: boolean;
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const idsRef = useRef(ids);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    try {
      const res = await wishlistService.getWishlist();
      setIds(new Set(res.data.map((item) => item.productId)));
    } catch {
      setIds(new Set());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [isAuthenticated, refresh]);

  const toggle = useCallback(async (productId: number) => {
    const existed = ids.has(productId);
    setIds((prev) => {
      const next = new Set(prev);
      if (existed) next.delete(productId);
      else next.add(productId);
      return next;
    });
    try {
      if (existed) await wishlistService.removeItem(productId);
      else await wishlistService.addItem(productId);
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        if (existed) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }, [ids]);

  const isWishlisted = useCallback((productId: number) => ids.has(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.size, loading, isWishlisted, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
