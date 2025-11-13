import { ApiError } from './apiError.js';

export type OTPCode =
  | 'EXPIRED'
  | 'INVALID'
  | 'TOO_MANY_ATTEMPTS'
  | 'RATE_LIMIT_REACHED';

export class OtpError extends ApiError {
  public code: OTPCode;

  constructor(code: OTPCode) {
    const status = code === 'INVALID' || code === 'EXPIRED' ? 401 : 429;
    super(status, code, [], '');
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'OTPError';
    this.code = code;
  }
}
