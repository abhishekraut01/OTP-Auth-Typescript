import { z } from 'zod';

export const signupSchema = z.object({
  email: z.email('Invalid email format').trim().max(255, 'Email too long'),
  username: z.string().min(8).trim().max(255, 'Email too long'),
});

export const signinSchema = z.object({
  email: z.email('Invalid email format').trim().max(255, 'Email too long'),
});

export const VerifyOTPSignupSchema = z.object({
  username: z.string().min(8).trim().max(255, 'Email too long'),
  email: z.email('Invalid email format').trim().max(255, 'Email too long'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export const VerifyOTPSigninSchema = z.object({
  email: z
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .max(255, 'Email too long'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});
