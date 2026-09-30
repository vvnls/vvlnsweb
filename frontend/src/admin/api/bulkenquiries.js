import api from '../../api/axios';

export const adminListBulkEnquiries = (params) => api.get('/admin/bulk-enquiries', { params }).then((r) => r.data);
export const adminUpdateBulkEnquiry = (id, data) => api.patch(`/admin/bulk-enquiries/${id}`, data).then((r) => r.data.enquiry);