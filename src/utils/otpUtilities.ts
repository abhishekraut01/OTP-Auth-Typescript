import crypto from 'crypto'

const handleGenerateOtp = (): string => {
    const OTP_LENGTH = 6
    const min = 10 ** (OTP_LENGTH - 1)
    const max = 10 ** OTP_LENGTH - 1

    const OTP = crypto.randomInt(min, max + 1)
    return String(OTP)
}
