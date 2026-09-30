import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify } from '../utils/slugify.js';

const cats = ['Hair Care'];

// title, category, tags, [label, price, mrp]
const items = [
  ['Amla Powder', 'Hair Care', ['amla', 'hair'], [['100 g', 129, 149], ['250 g', 230, 299], ['500 g', 420, 549]]],
  ['Reetha Powder', 'Hair Care', ['reetha', 'hair'], [['100 g', 99], ['250 g', 190], ['500 g', 350]]],
  ['Shikakai Powder', 'Hair Care', ['shikakai', 'hair'], [['100 g', 110], ['250 g', 260]]],
  ['Bhringraj Powder', 'Hair Care', ['bhringraj', 'hair'], [['100 g', 130], ['250 g', 249]]],
  ['Aloe Vera Gel 200 ml', 'Skin Care', ['aloe', 'skin'], [['200 ml', 249]]],
  ['Multani Mitti', 'Skin Care', ['multani', 'face pack'], [['100 g', 90], ['500 g', 180]]],
  ['Moringa Leaf Powder', 'Super Foods', ['moringa'], [['100 g', 129], ['250 g', 229], ['500 g', 399]]],
  ['Ashwagandha Powder', 'Super Foods', ['ashwagandha'], [['100 g', 195, 249], ['250 g', 420]]],
  ['Green Cardamom', 'Spices', ['elaichi', 'cardamom'], [['50 g', 349], ['100 g', 675]]],
  ['Almonds', 'Dry Fruits', ['badam', 'almonds'], [['250 g', 260], ['500 g', 499], ['1 kg', 950]]],
  ['Triphala Powder', 'Digestive Care', ['triphala'], [['100 g', 99, 129], ['250 g', 199, 249]]],
  ['Jamun Seed Powder', 'Diabetic Care', ['jamun'], [['100 g', 129], ['250 g', 249]]],
  ['Green Tea Leaves', 'Weight Loss', ['green tea'], [['100 g', 195], ['250 g', 295]]],
];

await connectDB();
await Promise.all([Category.deleteMany({}), Product.deleteMany({})]); // only wipes categories and products
const catDocs = await Category.insertMany(cats.map((name, i) => ({ name, slug: slugify(name), sortOrder: i })));
const byName = Object.fromEntries(catDocs.map((c) => [c.name, c._id]));

for (const [title, cat, tags, vars] of items) {
  await Product.create({
    title,
    slug: slugify(title),
    category: byName[cat],
    tags,
    shortDescription: `Pure ${title.toLowerCase()}, carefully sorted and packed fresh.`,
    variants: vars.map(([label, price, mrp]) => ({ label, price, mrp: mrp ?? price, stock: 100 })),
  });
}

console.log(`Seeded ${catDocs.length} categories and ${items.length} products`);
await mongoose.disconnect();