import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { enquiryLimiter } from '../middleware/rateLimit.js';
import { createBulkEnquiry } from '../controllers/bulkEnquiry.controller.js';
import { createBulkEnquirySchema } from '../validators/bulkEnquiry.validator.js';

const router = Router();
router.post('/', enquiryLimiter, validate(createBulkEnquirySchema), createBulkEnquiry);
export default router;