import { Router } from 'express';

import TestController from '../api/controllers/TestController';
const router = Router();

router.post('/test', TestController.play);

export default router;
