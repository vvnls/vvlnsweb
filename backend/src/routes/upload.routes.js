import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';

const router = Router();
router.use(protect, authorize('admin'));
router.post('/', upload.array('images', 8), uploadImages);
router.delete('/:publicId', deleteImage);
export default router;