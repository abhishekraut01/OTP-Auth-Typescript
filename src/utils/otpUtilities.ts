import crypto from 'crypto'

const handleGenerateOtp = (): string => {
    const OTP_LENGTH = 6
    const min = 10 ** (OTP_LENGTH - 1)
    const max = 10 ** OTP_LENGTH - 1

    const OTP = crypto.randomInt(min, max + 1)
    return String(OTP)
}

const handleHashOTP = async (otp: string, salt?: string) => {
    const s = salt ?? crypto.randomBytes(16).toString('hex');

    const hash = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(otp, s, 100_000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });

    return {
        hash,
        salt: s
    }
}

