import api from './axios';

export const submitBulkEnquiry = (data) => api.post('/bulk-enquiries', data).then((r) => r.data);