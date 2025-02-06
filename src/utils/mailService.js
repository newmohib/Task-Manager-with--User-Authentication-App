const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,SMTP_SECURE} = require("../config");

// Nodemailer SMTP Transport Configuration
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE, // false for STARTTLS, true for SSL
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const forgotPasswordEmailTemplate = (userName, resetLink) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email. This link will expire in <strong>5 hours</strong>.</p>
        <p>Thank you,</p>
        <p><strong>Your App Team</strong></p>
      </div>
    `;
};

// Route to Send Email
const sendEmail = async (params) => {
  let { to, subject, text, html } = params;
  if (!html) {
    html = forgotPasswordEmailTemplate(params.userName, params.resetLink);
  }
  try {
    const mailOptions = {
      from: `"Your App" <${SMTP_USER}>`, // Sender email
      to, // Recipient email
      subject,
      text,
      html, // Optional: HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return { isSuccess: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Email send error:", error);
    return { isSuccess: false, error: "Failed to send email" };
  }
};

module.exports = { sendEmail, forgotPasswordEmailTemplate };
