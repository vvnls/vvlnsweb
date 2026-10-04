import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { trackLimiter } from '../middleware/rateLimit.js';
import { createOrder, verifyPayment, listMyOrders, getMyOrder, cancelMyOrder, trackOrder } from '../controllers/order.controller.js';
import { createOrderSchema, verifyPaymentSchema, cancelOrderSchema, trackOrderSchema } from '../validators/order.validator.js';

const router = Router();

// public — no login needed
router.post('/track', trackLimiter, validate(trackOrderSchema), trackOrder);
router.post('/', optionalAuth, validate(createOrderSchema), createOrder);
router.post('/verify-payment', optionalAuth, validate(verifyPaymentSchema), verifyPayment);

// everything below still requires a logged-in account
router.use(protect);
router.get('/mine', listMyOrders);
router.post('/:id/cancel', validate(cancelOrderSchema), cancelMyOrder);
router.get('/:id', getMyOrder);

export default router;