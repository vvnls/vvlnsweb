import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as products from '../controllers/product.controller.js';
import * as categories from '../controllers/category.controller.js';
import * as users from '../controllers/user.controller.js';
import * as orders from '../controllers/order.controller.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';
import * as bulkEnquiries from '../controllers/bulkEnquiry.controller.js';
import { updateBulkEnquirySchema } from '../validators/bulkEnquiry.validator.js';

const router = Router();
router.use(protect, authorize('admin')); // everything below is admin-only

router.route('/products')
  .get(products.adminListProducts)
  .post(validate(createProductSchema), products.createProduct);
router.route('/products/:id')
  .get(products.adminGetProduct)
  .patch(validate(updateProductSchema), products.updateProduct)
  .delete(products.deleteProduct);

router.route('/categories')
  .get(categories.adminListCategories)
  .post(validate(createCategorySchema), categories.createCategory);
router.route('/categories/:id')
  .patch(validate(updateCategorySchema), categories.updateCategory)
  .delete(categories.deleteCategory);

router.route('/users')
  .get(users.listUsers)
  .post(validate(createUserSchema), users.createUser);
router.route('/users/:id')
  .get(users.getUser)
  .patch(validate(updateUserSchema), users.updateUser)
  .delete(users.deleteUser);

router.get('/orders', orders.adminListOrders);
router.get('/orders/:id', orders.adminGetOrder);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), orders.adminUpdateOrderStatus);

router.get('/bulk-enquiries', bulkEnquiries.adminListBulkEnquiries);
router.patch('/bulk-enquiries/:id', validate(updateBulkEnquirySchema), bulkEnquiries.adminUpdateBulkEnquiry);

router.get('/orders/:id/invoice', orders.adminDownloadInvoice);

export default router;