import express from 'express';
import { sendScorecard } from '../controllers/emailController.js';

const router = express.Router();

router.post('/sendScorecard', sendScorecard);

export default router;
