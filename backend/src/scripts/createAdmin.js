import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const [, , name, email, password] = process.argv;
if (!name || !email || !password) {
  console.log('Usage: npm run create-admin -- "Full Name" email@example.com StrongPass123');
  process.exit(1);
}

await connectDB();
const existing = await User.findOne({ email: email.toLowerCase() });
if (existing) {
  existing.role = 'admin';
  await existing.save({ validateBeforeSave: false });
  console.log(`Promoted ${email} to admin`);
} else {
  await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin created: ${email}`);
}
await mongoose.disconnect();