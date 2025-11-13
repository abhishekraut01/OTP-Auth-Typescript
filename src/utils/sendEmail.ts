import { ENV } from '../config/env';
import { ApiError } from './apiError';
import { resend } from './resend';

interface SendEmailInput {
  to: string;
  from?: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: SendEmailInput) => {
  const { to, from, subject, html } = options;

  try {
    const emailFrom = from || ENV.EMAIL_FROM;
    if (!emailFrom) {
      throw new ApiError(500, 'EMAIL_FROM environment variable not set');
    }

    const result = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
    });

    // Handle expected Resend API-level errors
    if (result.error) {
      console.error('Resend API returned error:', result.error);

      throw new ApiError(
        result.error.statusCode ?? 502,
        result.error.message ?? 'Failed to send email via Resend'
      );
    }

    console.log(`Email sent successfully to ${to}`);
    return result.data;
  } catch (err: any) {
    // Handle network/runtime errors
    console.error('Resend sendEmail exception:', err);

    // fallback to safe status/message extraction
    const status = err?.error?.statusCode || err?.statusCode || 500;
    const message =
      err?.error?.message || err?.message || 'Internal email service error';

    throw new ApiError(status, message);
  }
};
