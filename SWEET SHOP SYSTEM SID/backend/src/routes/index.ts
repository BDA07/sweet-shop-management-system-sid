import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { SweetController } from '../controllers/sweetController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateSweet, validateAuth } from '../middleware/validation';

export const router = Router();

// Auth routes
router.post('/auth/register', validateAuth, AuthController.register);
router.post('/auth/login', validateAuth, AuthController.login);

// Sweet routes
router.post('/sweets', authenticate, requireAdmin, validateSweet, SweetController.createSweet);
router.get('/sweets', SweetController.getAllSweets);
router.get('/sweets/search', SweetController.searchSweets);
router.put('/sweets/:id', authenticate, requireAdmin, SweetController.updateSweet);
router.delete('/sweets/:id', authenticate, requireAdmin, SweetController.deleteSweet);
router.post('/sweets/:id/purchase', authenticate, SweetController.purchaseSweet);
router.post('/sweets/:id/restock', authenticate, requireAdmin, SweetController.restockSweet);