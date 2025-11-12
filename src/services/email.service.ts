import { ENV } from "../config/env"
import { OtpError } from "../utils/otpError"
import { redis } from "../utils/redis"

const handleOtpKey = (email: string) => {
    return `otp:${email}`
}

const handleOtpCountKey = (email: string) => {
    return `otpCount:${email}`
}

const otp_tll_seconds = ENV.OTP_TTL_SECONDS
const allowed_send_attemps = ENV.OTP_MAX_ATTEMPTS

export const sendOTP = (email: string) => {
    const normalized = email.toLowerCase()
    const otpCountKey = handleOtpCountKey(normalized)
    const sendCount = Number(redis.get(otpCountKey))

    //check if sendcount is less than allowed limit
    if (sendCount <= allowed_send_attemps) {
        throw new OtpError("RATE_LIMIT_REACHED")
    }

    
}