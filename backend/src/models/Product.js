import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true, maxlength: 30 }, // "250 g"
  sku: { type: String, trim: true, maxlength: 40 },
  price: { type: Number, required: true, min: 0 }, // selling price in INR
  mrp: { type: Number, min: 0 },                   // original price, for "Sale!" badges
  stock: { type: Number, required: true, min: 0, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 5000 },
    images: [{ url: String, publicId: String }],
    variants: {
      type: [variantSchema],
      validate: [(v) => v.length > 0, 'A product needs at least one variant'],
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    hsnCode: { type: String, trim: true, maxlength: 20 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    seo: { metaTitle: String, metaDescription: String },
    minPrice: { type: Number, index: true }, // computed, used for sorting and filtering
    maxPrice: Number,
    deletedAt: { type: Date, default: null }, // soft delete
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre('save', function () {
  if (this.isModified('variants')) {
    const prices = this.variants.map((v) => v.price);
    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
  }
});

productSchema.virtual('inStock').get(function () {
  return this.variants.some((v) => v.stock > 0);
});

export default mongoose.model('Product', productSchema);