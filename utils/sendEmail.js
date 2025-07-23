const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetCodeEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Password Reset Code",
    html: `
  <div style="max-width:480px;margin:auto;font-family:'Segoe UI',Arial,sans-serif;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;background:#fff;">
    <div style="background:#f7f7f7;padding:28px 0;text-align:center;">
      <span style="font-size:48px;display:inline-block;color:#e67e22;">&#128274;</span>
    </div>
    <div style="padding:32px 24px 24px 24px;">
      <h2 style="color:#1c1c1c;margin-bottom:18px;text-align:center;">Password Reset Request</h2>
      <p style="font-size:16px;color:#333;margin-bottom:22px;">
        Hello,<br>
        We received a request to reset your password for your Alurà account.
      </p>
      <div style="background:#f2f2f2;padding:18px 0;border-radius:6px;text-align:center;margin-bottom:24px;">
        <span style="font-size:18px;color:#1c1c1c;">Your password reset code is:</span><br>
        <span style="font-size:28px;font-weight:bold;color:#e67e22;letter-spacing:2px;">${code}</span>
      </div>
      <p style="font-size:15px;color:#555;margin-bottom:24px;">
        This code will expire in <strong>10 minutes</strong>.<br>
        If you did not request a password reset, please ignore this email.
      </p>
      <p style="font-size:14px;color:#999;margin-top:32px;text-align:right;">
        Thank you,<br>
        <strong>Alurà Team</strong>
      </p>
    </div>
  </div>
`,
  };

  return transporter.sendMail(mailOptions);
};
