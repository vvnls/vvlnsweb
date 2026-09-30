import api from '../../api/axios';

export const adminListCategories = () => api.get('/admin/categories').then((r) => r.data);
export const adminCreateCategory = (data) => api.post('/admin/categories', data).then((r) => r.data.category);
export const adminUpdateCategory = (id, data) => api.patch(`/admin/categories/${id}`, data).then((r) => r.data.category);
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data);