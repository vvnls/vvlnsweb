import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { trackLimiter } from '../middleware/rateLimit.js';
import { createOrder, verifyPayment, listMyOrders, getMyOrder, cancelMyOrder, trackOrder } from '../controllers/order.controller.js';
import { createOrderSchema, verifyPaymentSchema, cancelOrderSchema, trackOrderSchema } from '../validators/order.validator.js';

const router = Router();

// public, so it must sit above protect
router.post('/track', trackLimiter, validate(trackOrderSchema), trackOrder);

router.use(protect);
router.post('/', validate(createOrderSchema), createOrder);
router.post('/verify-payment', validate(verifyPaymentSchema), verifyPayment);
router.get('/mine', listMyOrders);
router.post('/:id/cancel', validate(cancelOrderSchema), cancelMyOrder);
router.get('/:id', getMyOrder);
export default router;