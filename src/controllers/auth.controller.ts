import { Request, Response } from 'express';
import { AsyncHandler } from '../utils/asyncHandler';
import {
  signinSchema,
  signupSchema,
  VerifyOTPSigninSchema,
  VerifyOTPSignupSchema,
} from '../validations/auth.validations';
import { ApiError } from '../utils/apiError';
import { sendOTP, verifyOTPService } from '../services/email.service';
import { ApiResponse } from '../utils/apiResponse';
import { createSession } from '../services/session.service';
import prisma from '../db/prisma.js';

export const handleInitSignup = AsyncHandler(
  async (req: Request, res: Response) => {
    const { data, success, error } = signupSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(400, 'Invalid User Input Schema', error.issues);
    }

    const { username, email } = data;

    // Check if email or username already registered
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    // Send OTP
    await sendOTP(email);

    return res.status(200).json(new ApiResponse(200, 'OTP sent successfully'));
  }
);

export const handleInitSignin = AsyncHandler(
  async (req: Request, res: Response) => {
    const { success, data, error } = signinSchema.safeParse(req.body);

    if (!success) {
      throw new ApiError(400, 'Invalid input', error.issues);
    }

    const { email } = data;

    // User must exist for signin
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found. Please sign up first.');
    }

    await sendOTP(email);

    return res.status(200).json(new ApiResponse(200, 'OTP sent successfully'));
  }
);

export const handleSignup = AsyncHandler(
  async (req: Request, res: Response) => {
    const { success, data, error } = VerifyOTPSignupSchema.safeParse(req.body);

    if (!success) {
      throw new ApiError(400, 'Invalid input', error.issues);
    }

    const { username, email, otp } = data;

    // Verify OTP
    const isOtpValid = await verifyOTPService(email, otp);
    if (!isOtpValid) {
      throw new ApiError(401, 'Invalid or expired OTP');
    }

    // Create user in database
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
      },
    });

    // Create JWT-based session
    const session = await createSession(
      newUser.id,
      req.ip,
      req.headers['user-agent']
    );

    return res.status(201).json(
      new ApiResponse(201, 'Signup successful', {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
        tokens: session,
      })
    );
  }
);

export const handleSignin = AsyncHandler(
  async (req: Request, res: Response) => {
    const { success, data, error } = VerifyOTPSigninSchema.safeParse(req.body);

    if (!success) {
      throw new ApiError(400, 'Invalid input', error.issues);
    }

    const { email, otp } = data;

    const isOtpValid = await verifyOTPService(email, otp);
    if (!isOtpValid) {
      throw new ApiError(401, 'Invalid or expired OTP');
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, 'User not found. Please sign up first.');
    }

    // Create a new session and JWT tokens
    const session = await createSession(
      user.id,
      req.ip,
      req.headers['user-agent']
    );

    return res.status(200).json(
      new ApiResponse(200, 'Signin successful', {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        tokens: session,
      })
    );
  }
);
