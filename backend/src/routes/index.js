import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import adminRoutes from './admin.routes.js';
import uploadRoutes from './upload.routes.js';
import orderRoutes from './order.routes.js';
import bulkEnquiryRoutes from './bulkEnquiry.routes.js';


const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// next steps will mount here:
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/orders', orderRoutes);
router.use('/bulk-enquiries', bulkEnquiryRoutes);


export default router;