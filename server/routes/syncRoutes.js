import express from 'express';
import { syncSubmissions } from '../controllers/syncController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, syncSubmissions);

export default router;
