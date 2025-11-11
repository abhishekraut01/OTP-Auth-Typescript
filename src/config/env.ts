import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  OTP_TTL_SECONDS: number;
  OTP_MAX_ATTEMPTS: number;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  REDIS_URL: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]?.trim();
  if (!value && fallback === undefined) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value || fallback!;
}

export const ENV: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000')),
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  ACCESS_TOKEN_EXPIRY: getEnvVar('ACCESS_TOKEN_EXPIRY', '15m'),
  REFRESH_TOKEN_EXPIRY: getEnvVar('REFRESH_TOKEN_EXPIRY', '7d'),
  OTP_TTL_SECONDS: parseInt(getEnvVar('OTP_TTL_SECONDS', '120')),
  OTP_MAX_ATTEMPTS: parseInt(getEnvVar('OTP_MAX_ATTEMPTS', '5')),
  RESEND_API_KEY: getEnvVar('RESEND_API_KEY'),
  EMAIL_FROM: getEnvVar('EMAIL_FROM', 'devArena <team@company.in>'),
  REDIS_URL: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
};
