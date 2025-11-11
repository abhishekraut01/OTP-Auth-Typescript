import { Router } from 'express';
import {
  handleInitSignin,
  handleInitSignup,
  handleSignin,
  handleSignup,
} from '../controllers/auth.controller.js';

const router: Router = Router();

// auth.routes.ts
router.post('/signup/initiate', handleInitSignup);
router.post('/signup/verify', handleSignup);
router.post('/signin/initiate', handleInitSignin);
router.post('/signin/verify', handleSignin);

export default router;
