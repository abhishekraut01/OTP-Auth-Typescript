import { ENV } from "../config/env"
import { otpEmailHTML } from "../utils/emailTemplate"
import { OtpError } from "../utils/otpError"
import { handleGenerateOtp, handleHashOTP, handleVerifyOTP } from "../utils/otpUtilities"
import { redis } from "../utils/redis"
import { sendEmail } from "../utils/sendEmail"

const handleOtpKey = (email: string) => {
    return `otp:${email}`
}

const handleOtpCountKey = (email: string) => {
    return `otpCount:${email}`
}

const otp_tll_seconds = ENV.OTP_TTL_SECONDS || 90
const allowed_send_attemps = ENV.OTP_MAX_ATTEMPTS || 15

export async function sendOTP(email: string) {
    const normalized = email.toLowerCase();
    const otpKey = handleOtpKey(normalized);
    const sendCountKey = handleOtpCountKey(normalized);

    //  Enforce daily send limit
    const currentCount = Number(await redis.get(sendCountKey)) || 0;
    if (currentCount >= allowed_send_attemps) {
        throw new OtpError('RATE_LIMIT_REACHED');
    }

    //  Generate secure random OTP (6 digits)
    const otp = handleGenerateOtp();
    const { hash, salt } = await handleHashOTP(otp);

    //  Prepare OTP payload for Redis
    const payload = JSON.stringify({
        hash,
        salt,
        attempts: 0,
    });

    //  Store OTP (hashed) with expiry
    await redis.set(otpKey, payload, 'EX', otp_tll_seconds);

    //  Increment send counter atomically and expire in 24h
    await redis
        .multi()
        .incr(sendCountKey)
        .expire(sendCountKey, 24 * 60 * 60)
        .exec();

    //  Send OTP email
    const html = otpEmailHTML(otp, email, otp_tll_seconds);

    await sendEmail({
        to: email,
        subject: 'Your DevSync Login Code',
        html,
    });

    return { ok: true };
}

export const verifyOTPService = async (email: string, otp: string) => {
    const normalized = email.toLowerCase();
    const key = handleOtpKey(normalized);

    // 1. Retrieve OTP data from Redis
    const raw = await redis.get(key);
    if (!raw) throw new OtpError('EXPIRED');

    const data = JSON.parse(raw) as {
        hash: string;
        salt: string;
        attempts: number;
    };

    // 2. Enforce max attempts rule (anti-bruteforce)
    if (data.attempts >= allowed_send_attemps) {
        await redis.del(key);
        await redis.set(`otp:blocked:${normalized}`, '1', 'EX', 300); // block 5 min
        throw new OtpError('TOO_MANY_ATTEMPTS');
    }

    // 3. Verify OTP cryptographically
    const isValid = handleVerifyOTP(otp, data.hash, data.salt);

    // 4. If invalid — increment attempt count safely
    if (!isValid) {
        data.attempts++;
        const ttl = await redis.ttl(key);

        if (ttl > 0) {
            await redis.setex(key, ttl, JSON.stringify(data)); // preserve expiry
        } else {
            await redis.del(key); // expired mid-verification
            throw new OtpError('EXPIRED');
        }

        throw new OtpError('INVALID');
    }

    await redis.del(key);

    return true;
};