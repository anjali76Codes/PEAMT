// user.routes.js
import express from 'express';
import { google, signin, signup, signout, getUserIdByEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.get('/user/email/:email', getUserIdByEmail); // New route for getting user ID by email

export default router;
