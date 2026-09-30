import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new AppError('No files uploaded', 400);
  const images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
  res.status(201).json({ status: 'success', images });
});

export const deleteImage = asyncHandler(async (req, res) => {
  await cloudinary.uploader.destroy(req.params.publicId.replace(/--/g, '/'));
  res.json({ status: 'success', message: 'Image deleted' });
});