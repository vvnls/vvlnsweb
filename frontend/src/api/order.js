import api from './axios';

export const createOrder = (data) => api.post('/orders', data).then((r) => r.data);
export const verifyPayment = (data) => api.post('/orders/verify-payment', data).then((r) => r.data);
export const getMyOrders = () => api.get('/orders/mine').then((r) => r.data.orders);
export const getMyOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data.order);
export const cancelOrder = (id, reason) => api.post(`/orders/${id}/cancel`, { reason }).then((r) => r.data.order);
export const trackOrder = (data) => api.post('/orders/track', data).then((r) => r.data.order);