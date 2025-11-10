/**
 * Email Service
 * Handles sending verification emails using nodemailer
 */

import nodemailer from "nodemailer";

// Create transporter function (lazy initialization)
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} token - JWT verification token
 */
export const sendVerificationEmail = async (email, token) => {
  const transporter = getTransporter();
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "tidyApp <noreply-tidyapp@gmail.com>",
    to: email,
    subject: "Verify Your tidyApp Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌊 Welcome to tidyApp!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thanks for signing up! Please click the button below to verify your email address and activate your account.</p>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${verificationUrl}
              </p>

              <p><strong>This link will expire in 24 hours.</strong></p>

              <p>If you didn't create an account with tidyApp, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} tidyApp. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to tidyApp!

      Please verify your email address by clicking the link below:
      ${verificationUrl}

      This link will expire in 24 hours.

      If you didn't create an account with tidyApp, you can safely ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
