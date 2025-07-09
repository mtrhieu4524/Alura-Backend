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
      <p>Hello,</p>
      <p>Your password reset code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
