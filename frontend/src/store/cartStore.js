import { create } from 'zustand';

const load = () => {
  try { return JSON.parse(sessionStorage.getItem('vn-cart') || '{}'); }
  catch { return {}; }
};
const persist = (items) => sessionStorage.setItem('vn-cart', JSON.stringify(items));

export const useCartStore = create((set, get) => ({
  items: load(), // { "productId:variantLabel": { product, variant, qty } }

  add(product, variant) {
    const key = `${product._id}:${variant.label}`;
    const items = { ...get().items };
    items[key] = { product, variant, qty: (items[key]?.qty || 0) + 1 };
    persist(items);
    set({ items });
  },

  setQty(key, qty) {
    const items = { ...get().items };
    if (qty <= 0) delete items[key];
    else items[key].qty = qty;
    persist(items);
    set({ items });
  },

  clear() {
    persist({});
    set({ items: {} });
  },

  get count() {
    return Object.values(get().items).reduce((n, i) => n + i.qty, 0);
  },
  get subtotal() {
    return Object.values(get().items).reduce((n, i) => n + i.qty * i.variant.price, 0);
  },
}));