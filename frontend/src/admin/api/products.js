import api from '../../api/axios';

export const adminListProducts = (params) => api.get('/admin/products', { params }).then((r) => r.data);
export const adminGetProduct = (id) => api.get(`/admin/products/${id}`).then((r) => r.data.product);
export const adminCreateProduct = (data) => api.post('/admin/products', data).then((r) => r.data.product);
export const adminUpdateProduct = (id, data) => api.patch(`/admin/products/${id}`, data).then((r) => r.data.product);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then((r) => r.data);