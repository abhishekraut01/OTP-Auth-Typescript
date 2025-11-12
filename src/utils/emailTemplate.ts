export function escapeHTML(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!
  );
}

export function otpEmailHTML(
  otp: string,
  email: string,
  validitySeconds = 90
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevSync OTP Code</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px; border:1px solid #f3f4f6; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.04); padding:32px;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom:20px; text-align:center;">
              <span style="font-size:24px; font-weight:600; color:#3D2C8D;">DevSync</span>
              <div style="font-size:14px; color:#6b7280; margin-top:4px;">Verification Code</div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding-bottom:16px;">
              <p style="font-size:15px; line-height:1.6; margin:0;">
                Hi there,<br />
                Use the code below to verify your email <span style="font-weight:500; color:#111827;">${escapeHTML(email)}</span>.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:16px 0;">
              <div style="display:inline-block; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:14px 22px;">
                <span style="font-size:28px; font-weight:600; letter-spacing:8px; color:#3D2C8D; font-family:'SF Mono',Monaco,'Courier New',monospace;">
                  ${escapeHTML(otp)}
                </span>
              </div>
              <div style="margin-top:8px; font-size:12px; color:#6b7280;">
                Valid for ${validitySeconds} seconds
              </div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
                Never share this code with anyone. DevSync will <strong>never</strong> ask for your code over email or phone.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px; border-top:1px solid #e5e7eb; text-align:center;">
              <p style="font-size:13px; color:#9ca3af; margin:8px 0;">© ${new Date().getFullYear()} DevSync</p>
              <div>
                <a href="https://www.devsync.in" style="color:#3D2C8D; text-decoration:none; font-size:13px; margin:0 8px;">Website</a> |
                <a href="mailto:devsynccareers@gmail.com" style="color:#3D2C8D; text-decoration:none; font-size:13px; margin:0 8px;">Support</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
