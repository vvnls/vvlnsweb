import api from './axios';

export const getCategories = () => api.get('/categories').then((r) => r.data.categories);

export const getProducts = (params = {}) =>
  api.get('/products', { params }).then((r) => r.data);

export const getProduct = (slug) =>
  api.get(`/products/${slug}`).then((r) => r.data.product);

export const getReviews = (slug) =>
  api.get(`/products/${slug}/reviews`).then((r) => r.data);