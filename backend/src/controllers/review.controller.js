import Review from '../models/Review.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, deletedAt: null }).select('_id');
  if (!product) throw new AppError('Product not found', 404);

  const reviews = await Review.find({ product: product._id, isApproved: true }).sort('-createdAt');
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  res.json({ status: 'success', reviews, average: Math.round(avg * 10) / 10, total: reviews.length });
});