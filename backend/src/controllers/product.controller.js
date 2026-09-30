import Product from '../models/Product.js';
import Category from '../models/Category.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uniqueSlug } from '../utils/slugify.js';
import { paging, escapeRegex } from '../utils/query.js';

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { minPrice: 1 },
  price_desc: { minPrice: -1 },
  name: { title: 1 },
};

const searchFilter = (q) => {
  const rx = new RegExp(escapeRegex(String(q).slice(0, 60)), 'i');
  return [{ title: rx }, { tags: rx }, { shortDescription: rx }];
};

async function categoryIdsMatching(q) {
  const rx = new RegExp(escapeRegex(String(q).slice(0, 60)), 'i');
  const cats = await Category.find({ name: rx }).select('_id');
  return cats.map((c) => c._id);
}
// ---------- public ----------
export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter = { isActive: true, deletedAt: null };

  if (req.query.category) {
    const cat = await Category.findOne({ slug: String(req.query.category), isActive: true });
    if (!cat) return res.json({ status: 'success', products: [], page, pages: 0, total: 0 });
    filter.category = cat._id;
  }
  if (req.query.q) {
    const catIds = await categoryIdsMatching(req.query.q);
    filter.$or = [...searchFilter(req.query.q), ...(catIds.length ? [{ category: { $in: catIds } }] : [])];
  }
  if (req.query.featured === 'true') filter.isFeatured = true;

  const lo = Number(req.query.minPrice);
  const hi = Number(req.query.maxPrice);
  if (lo >= 0 || hi >= 0) filter.minPrice = { ...(lo >= 0 && { $gte: lo }), ...(hi >= 0 && { $lte: hi }) };

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug')
      .sort(SORTS[req.query.sort] || SORTS.newest).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ status: 'success', products, page, pages: Math.ceil(total / limit), total });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true, deletedAt: null })
    .populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  res.json({ status: 'success', product });
});

// ---------- admin ----------
export const adminListProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter = { deletedAt: null };
  if (req.query.q) filter.$or = searchFilter(req.query.q);
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.status === 'active') filter.isActive = true;
  if (req.query.status === 'inactive') filter.isActive = false;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort('-createdAt').skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ status: 'success', products, page, pages: Math.ceil(total / limit), total });
});

export const adminGetProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, deletedAt: null }).populate('category', 'name slug');
  if (!product) throw new AppError('Product not found', 404);
  res.json({ status: 'success', product });
});

export const createProduct = asyncHandler(async (req, res) => {
  if (!(await Category.exists({ _id: req.body.category }))) throw new AppError('Category not found', 400);
  const slug = await uniqueSlug(Product, req.body.title);
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json({ status: 'success', product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, deletedAt: null });
  if (!product) throw new AppError('Product not found', 404);
  if (req.body.category && !(await Category.exists({ _id: req.body.category }))) {
    throw new AppError('Category not found', 400);
  }
  product.set(req.body); // slug is never changed here, so SEO URLs stay stable
  await product.save();
  res.json({ status: 'success', product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, deletedAt: null });
  if (!product) throw new AppError('Product not found', 404);
  product.deletedAt = new Date(); // soft delete keeps old orders valid
  product.isActive = false;
  await product.save();
  res.json({ status: 'success', message: 'Product deleted' });
});