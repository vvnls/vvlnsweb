import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';

export function useProducts(params) {
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getProducts(params)
      .then((res) => { if (alive) setData(res); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [JSON.stringify(params)]);

  return { ...data, loading };
}