import api from '../../api/axios';

export const adminListOrders = (params) => api.get('/admin/orders', { params }).then((r) => r.data);
export const adminGetOrder = (id) => api.get(`/admin/orders/${id}`).then((r) => r.data.order);
export const adminUpdateOrderStatus = (id, data) => api.patch(`/admin/orders/${id}/status`, data).then((r) => r.data.order);
export const adminRetryRefund = (id) => api.post(`/admin/orders/${id}/refund`).then((r) => r.data.order);
export const adminDownloadInvoice = async (id, invoiceNumber) => {
  const res = await api.get(`/admin/orders/${id}/invoice`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${(invoiceNumber || id).replace(/\//g, '-')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};