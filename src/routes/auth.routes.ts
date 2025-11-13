import { Router } from 'express';
import {
  handleInitSignin,
  handleInitSignup,
  handleSignin,
  handleSignup,
} from '../controllers/auth.controller.js';
import { perHourLimiter } from '../utils/rateLimiter.js';

const router: Router = Router();

// auth.routes.ts
router.post('/signup/initiate', handleInitSignup);
router.post('/signup/verify', perHourLimiter, handleSignup);
router.post('/signin/initiate', handleInitSignin);
router.post('/signin/verify', perHourLimiter, handleSignin);

export default router;
