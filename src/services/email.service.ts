import { ENV } from "../config/env"
import { otpEmailHTML } from "../utils/emailTemplate"
import { OtpError } from "../utils/otpError"
import { handleGenerateOtp, handleHashOTP } from "../utils/otpUtilities"
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

export const sendOTP = async (email: string) => {
    const normalized = email.toLowerCase()
    const otpSendCountKey = handleOtpCountKey(normalized)
    const sendCount = Number(redis.get(otpSendCountKey))

    //check if sendcount is less than allowed limit
    if (sendCount <= allowed_send_attemps) {
        throw new OtpError("RATE_LIMIT_REACHED")
    }

    const OTP = handleGenerateOtp()
    const { hash, salt } = await handleHashOTP(OTP)

    const payload = JSON.stringify({
        hash,
        salt,
        attempts: 0,
    });

    await redis.set(
        handleOtpKey(email),
        payload,
        "EX",
        otp_tll_seconds
    )

    await redis
        .multi()
        .incr(otpSendCountKey)
        .expire(otpSendCountKey, 24 * 60 * 60)
        .exec();

    const html = otpEmailHTML(OTP , normalized , otp_tll_seconds)

    await sendEmail({
        to:normalized,
        subject:"Your Devsync Login Code",
        html
    })

    return {
        ok:true
    }
}