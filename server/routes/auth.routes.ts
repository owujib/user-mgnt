import { Router } from 'express';

import AuthController from '../api/controllers/AuthController';
import AuthMiddleare from '../api/middlewares/AuthMiddleare';
const router = Router();

router.post('/register', AuthController.Register);
router.post('/login', AuthController.Login);
router.post('/forgot-password/:email', AuthController.ForgotPassword);
router.post('/reset-password', AuthController.ResetPassword);
router.post(
  '/update-password',
  AuthMiddleare.VerifyToken,
  AuthController.UpdatePassword,
);

export default router;
