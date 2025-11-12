import { Redis } from "ioredis";
import { ENV } from "../config/env";

if (!ENV.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is required')
}

class RedisSingleton {
    private static redisInstance: Redis

    private constructor() {
        //we made constructor private to prevent creating instance directly with class
    }

    public static getInstance(): Redis {
        if (!RedisSingleton.redisInstance) {
            RedisSingleton.redisInstance = new Redis(process.env.REDIS_URL!);

            RedisSingleton.redisInstance.on('connect', () => console.log('Redis connected'));
            RedisSingleton.redisInstance.on('ready', () => console.log('Redis ready'));
            RedisSingleton.redisInstance.on('error', (err) => console.error('Redis error', err));
            RedisSingleton.redisInstance.on('close', () => console.log('Redis connection closed'));
        }

        return RedisSingleton.redisInstance;
    }

    public static async shutdown() {
        if (RedisSingleton.redisInstance) {
            await RedisSingleton.redisInstance.quit();
            console.log('Redis disconnected');
        }
    }
}

export const redis = RedisSingleton.getInstance();

// graceful shutdown
process.on('SIGINT', () => RedisSingleton.shutdown());
process.on('SIGTERM', () => RedisSingleton.shutdown());