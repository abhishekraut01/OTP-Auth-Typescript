// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { ENV } from '../config/env';

class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {} // prevent direct construction

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: ENV.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return PrismaSingleton.instance;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? PrismaSingleton.getInstance();

if (ENV.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
