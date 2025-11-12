import crypto from 'crypto'

export const handleGenerateOtp = (): string => {
    const OTP_LENGTH = 6
    const min = 10 ** (OTP_LENGTH - 1)
    const max = 10 ** OTP_LENGTH - 1

    const OTP = crypto.randomInt(min, max + 1)
    return String(OTP)
}

export const handleHashOTP = async (otp: string, salt?: string) => {
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

export async function handleVerifyOTP(otp: string, hash: string, salt: string) {
    const testHash = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(otp, salt, 100_000, 64, 'sha512', (err, derivedKey) => {
            if (err) return reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });

    // Use timing-safe comparison
    const valid = crypto.timingSafeEqual(
        Buffer.from(testHash, 'hex'),
        Buffer.from(hash, 'hex')
    );
    return valid;
}