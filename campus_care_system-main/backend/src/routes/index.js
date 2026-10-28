import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, optionalAuth, requireRoles } from '../middleware/auth.js';
import { uploadPhoto } from '../middleware/upload.js';
import * as auth from '../controllers/authController.js';
import * as complaints from '../controllers/complaintController.js';
import * as departments from '../controllers/departmentController.js';
import * as analytics from '../controllers/analyticsController.js';
import * as categories from '../controllers/categoryController.js';
import * as demo from '../controllers/demoController.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'campuscare-api', time: new Date().toISOString() });
});

router.post('/auth/register', authLimiter, auth.register);
router.post('/auth/login', authLimiter, auth.login);
router.post('/auth/logout', authenticate, auth.logout);
router.get('/auth/me', authenticate, auth.me);
router.patch('/auth/me', authenticate, auth.updateMe);

router.get('/departments', departments.list);
router.post('/departments', authenticate, requireRoles('admin'), departments.create);
router.patch('/departments/:id', authenticate, requireRoles('admin'), departments.update);

router.get('/categories', categories.list);

router.get('/complaints/track/:code', optionalAuth, complaints.track);
router.get('/complaints', authenticate, complaints.list);
router.post('/complaints', authenticate, uploadPhoto, complaints.create);
router.get('/complaints/:id/image', authenticate, complaints.getImage);
router.get('/complaints/:id', authenticate, complaints.getById);
router.patch('/complaints/:id/status', authenticate, requireRoles('staff', 'admin'), complaints.patchStatus);
router.patch('/complaints/:id/assign', authenticate, requireRoles('admin'), complaints.patchAssign);
router.patch('/complaints/:id/priority', authenticate, requireRoles('admin'), complaints.patchPriority);
router.post('/complaints/:id/feedback', authenticate, complaints.postFeedback);

router.get('/admin/analytics', authenticate, analytics.dashboard);
router.get('/dashboard/student', authenticate, requireRoles('student', 'faculty'), analytics.dashboard);
router.get('/dashboard/staff', authenticate, requireRoles('staff'), analytics.dashboard);
router.get('/dashboard/admin', authenticate, requireRoles('admin'), analytics.dashboard);

router.post('/admin/demo/reset', authenticate, requireRoles('admin'), demo.resetDemo);

export default router;
