import mongoose from 'mongoose';

const bulkEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  businessName: { type: String, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  productInterest: { type: String, required: true, trim: true, maxlength: 200 }, // e.g. "Amla powder, Ashwagandha"
  quantity: { type: String, required: true, trim: true, maxlength: 100 }, // free text: "50 kg/month", "500 units one-time"
  message: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  adminNote: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });

export default mongoose.model('BulkEnquiry', bulkEnquirySchema);