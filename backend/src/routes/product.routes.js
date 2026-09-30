import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/product.controller.js';
import { getProductReviews } from '../controllers/review.controller.js';


const router = Router();
router.get('/', listProducts);
router.get('/:slug', getProduct);
router.get('/:slug/reviews', getProductReviews);

export default router;