import api from '../../api/axios';

export const adminListUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);
export const adminGetUser = (id) => api.get(`/admin/users/${id}`).then((r) => r.data);
export const adminCreateUser = (data) => api.post('/admin/users', data).then((r) => r.data.user);
export const adminUpdateUser = (id, data) => api.patch(`/admin/users/${id}`, data).then((r) => r.data.user);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);