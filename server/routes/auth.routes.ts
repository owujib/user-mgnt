import { Router } from 'express';

import AuthController from '../api/controllers/AuthController';
const router = Router();

router.post('/register', AuthController.register);

export default router;
