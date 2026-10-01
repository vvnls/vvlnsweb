import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

const pool = [
  ['Priya S.', 5, 'Packaging was neat and the herbs smelled fresh. Arrived in three days.'],
  ['Rahul M.', 5, 'Genuine quality and honest pricing. I now order all my herbs here.'],
  ['Anita K.', 4, 'They answered my questions on WhatsApp before I ordered. Good experience.'],
  ['Sunil P.', 5, 'Excellent quality, and free shipping is a great bonus.'],
  ['Aman K.', 4, 'Good product, packaging could be a bit sturdier for long transit.'],
  ['Divya R.', 5, 'Been using this for a month now, noticeably better results than store-bought.'],
  ['Karthik V.', 5, 'Fast delivery to Bengaluru, product exactly as described.'],
  ['Meera J.', 4, 'Fresh and well packed. Will order again.'],
  ['Naveen S.', 5, 'Great value for the price, and it smells authentic.'],
  ['Pooja T.', 3, 'Good product but delivery took a bit longer than expected.'],
  ['Arjun D.', 5, 'My go-to store for herbs now. Consistent quality every time.'],
  ['Lakshmi N.', 5, 'Loved it. Ordering a bigger pack next time.'],
  ['Rohit B.', 4, 'Solid quality, matches the description on the site.'],
  ['Sneha K.', 5, 'Very happy with the freshness and the quick response to my query.'],
  ['Vikram H.', 4, 'Good experience overall, will recommend to friends.'],
];

await connectDB();
const products = await Product.find({ deletedAt: null });
if (!products.length) {
  console.log('No products found.');
  process.exit(1);
}

await Review.deleteMany({});
for (let i = 0; i < pool.length; i++) {
  const [name, rating, comment] = pool[i];
  const product = products[i % products.length]; // spreads 15 reviews across all products
  await Review.create({ product: product._id, name, rating, comment });
}

console.log(`Seeded ${pool.length} reviews`);
await mongoose.disconnect();