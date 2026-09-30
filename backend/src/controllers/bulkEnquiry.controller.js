import BulkEnquiry from '../models/BulkEnquiry.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendBulkEnquiryNotification } from '../services/email.services.js';
import { paging } from '../utils/query.js';

export const createBulkEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await BulkEnquiry.create(req.body);
  sendBulkEnquiryNotification(enquiry).catch((e) => console.error('Email error:', e));
  res.status(201).json({ status: 'success', message: 'Thank you! Our team will get back to you with pricing and availability shortly.' });
});

// ---------- admin ----------
export const adminListBulkEnquiries = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [enquiries, total] = await Promise.all([
    BulkEnquiry.find(filter).sort('-createdAt').skip(skip).limit(limit),
    BulkEnquiry.countDocuments(filter),
  ]);
  res.json({ status: 'success', enquiries, page, pages: Math.ceil(total / limit), total });
});

export const adminUpdateBulkEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await BulkEnquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  res.json({ status: 'success', enquiry });
});