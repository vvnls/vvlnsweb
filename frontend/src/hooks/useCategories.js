import { useEffect, useState } from 'react';
import { getCategories } from '../api/products';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { getCategories().then(setCategories); }, []);
  return categories;
}