import { Router } from 'express';

import AuthController from '../api/controllers/AuthController';
import AuthMiddleare from '../api/middlewares/AuthMiddleare';
import UserController from '../api/controllers/UserController';
const router = Router();

router.post(
  '/update',
  AuthMiddleare.VerifyToken,
  UserController.UpdateUserProfile,
);
router.get(
  '/list-users',
  AuthMiddleare.VerifyToken,
  AuthMiddleare.ProtectRouteFor('admin'),
  UserController.ListUsers,
);

export default router;
