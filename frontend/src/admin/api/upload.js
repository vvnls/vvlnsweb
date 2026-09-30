import api from '../../api/axios';

export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.images);
};

export const deleteImage = (publicId) => api.delete(`/upload/${publicId.replaceAll('/', '--')}`).then((r) => r.data);