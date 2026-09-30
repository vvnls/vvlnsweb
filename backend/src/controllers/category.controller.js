import Category from '../models/Category.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slugify.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder name');
  res.json({ status: 'success', categories });
});

export const adminListCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('sortOrder name');
  res.json({ status: 'success', categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const slug = await uniqueSlug(Category, req.body.name);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ status: 'success', category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  category.set(req.body); // slug stays the same so URLs don't break
  await category.save();
  res.json({ status: 'success', category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  if (await Product.exists({ category: category._id, deletedAt: null })) {
    throw new AppError('Move or delete the products in this category first', 409);
  }
  await category.deleteOne();
  res.json({ status: 'success', message: 'Category deleted' });
});