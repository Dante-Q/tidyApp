/**
 * Email Service
 * Handles sending verification emails using nodemailer
 */

import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const logoPath = path.join(__dirname, "tidy.png");

  const mailOptions = {
    from: process.env.EMAIL_FROM || "TidyApp <noreply-tidyapp@gmail.com>",
    to: email,
    subject: "Verify Your TidyApp Account 🌊",
    attachments: [
      {
        filename: "tidy-logo.png",
        path: logoPath,
        cid: "tidyLogo", // Content-ID for embedding in HTML
      },
    ],
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #ffffff;
              background: linear-gradient(135deg, #0a0f1e 0%, #1a2332 50%, #0f172a 100%);
              padding: 20px;
            }

            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid rgba(109, 213, 237, 0.2);
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }

            .header {
              background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
              padding: 40px 30px;
              text-align: center;
            }

            .logo-container {
              margin-bottom: 20px;
            }

            .logo {
              width: 80px;
              height: 80px;
              display: inline-block;
            }

            .brand-name {
              font-size: 32px;
              font-weight: 800;
              color: #ffffff;
              margin: 10px 0 0 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .tagline {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.9);
              font-weight: 500;
              margin-top: 8px;
            }

            .content {
              padding: 40px 30px;
              background: rgba(255, 255, 255, 0.02);
            }

            h2 {
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
              background: linear-gradient(135deg, #ffffff 0%, #6dd5ed 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            p {
              color: rgba(255, 255, 255, 0.8);
              margin-bottom: 20px;
              font-size: 16px;
            }

            .button-container {
              text-align: center;
              margin: 30px 0;
            }

            .verify-button {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s ease;
              box-shadow: 0 4px 12px rgba(33, 147, 176, 0.3);
            }

            .verify-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(33, 147, 176, 0.4);
            }

            .url-box {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 16px;
              word-break: break-all;
              font-size: 14px;
              color: #6dd5ed;
              font-family: 'Courier New', monospace;
              margin: 20px 0;
            }

            .highlight {
              color: #6dd5ed;
              font-weight: 600;
            }

            .warning {
              background: rgba(255, 193, 7, 0.1);
              border-left: 4px solid #ffc107;
              padding: 12px 16px;
              border-radius: 4px;
              margin: 20px 0;
            }

            .warning-text {
              color: #ffc107;
              font-size: 14px;
              font-weight: 500;
              margin: 0;
            }

            .footer {
              background: rgba(0, 0, 0, 0.2);
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding: 30px;
              text-align: center;
            }

            .footer-text {
              color: rgba(255, 255, 255, 0.5);
              font-size: 14px;
              margin-bottom: 10px;
            }

            .footer-links {
              margin-top: 15px;
            }

            .footer-link {
              color: #6dd5ed;
              text-decoration: none;
              font-size: 14px;
              margin: 0 10px;
            }

            .divider {
              color: rgba(255, 255, 255, 0.3);
              margin: 0 5px;
            }

            @media only screen and (max-width: 600px) {
              .email-container {
                border-radius: 0;
              }

              .header, .content, .footer {
                padding: 30px 20px;
              }

              .brand-name {
                font-size: 28px;
              }

              h2 {
                font-size: 20px;
              }

              .verify-button {
                padding: 14px 32px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo-container">
                <img src="cid:tidyLogo" alt="TidyApp Logo" class="logo" />
              </div>
              <h1 class="brand-name">TidyApp</h1>
              <p class="tagline">Your Ultimate Cape Town Beach Guide</p>
            </div>

            <div class="content">
              <h2>Welcome to Tidy! 🏄‍♂️</h2>

              <p>Thanks for joining the Tidy community! We're excited to help you catch the perfect wave and explore Cape Town's beautiful beaches.</p>

              <p>To get started, please verify your email address by clicking the button below:</p>

              <div class="button-container">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>

              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6);">Or copy and paste this link into your browser:</p>

              <div class="url-box">${verificationUrl}</div>

              <div class="warning">
                <p class="warning-text">⏱️ This verification link will expire in 24 hours</p>
              </div>

              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">Once verified, you'll have access to:</p>
              <ul style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-left: 20px; margin-bottom: 20px;">
                <li>Real-time surf reports and tide predictions</li>
                <li>Live wind conditions and beach cams</li>
                <li>Community forum and beach updates</li>
                <li>Personalized beach recommendations</li>
              </ul>

              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-top: 30px;">If you didn't create an account with TidyApp, you can safely ignore this email.</p>
            </div>

            <div class="footer">
              <p class="footer-text">&copy; ${new Date().getFullYear()} TidyApp. All rights reserved.</p>
              <p class="footer-text">Catch the perfect wave 🌊</p>
              <div class="footer-links">
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }" class="footer-link">Visit Website</a>
                <span class="divider">•</span>
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/about" class="footer-link">About Us</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Tidy! 🌊

Thanks for joining the Tidy community! We're excited to help you catch the perfect wave and explore Cape Town's beautiful beaches.

Please verify your email address by clicking the link below:
${verificationUrl}

This verification link will expire in 24 hours.

Once verified, you'll have access to:
• Real-time surf reports and tide predictions
• Live wind conditions and beach cams
• Community forum and beach updates
• Personalized beach recommendations

If you didn't create an account with TidyApp, you can safely ignore this email.

© ${new Date().getFullYear()} TidyApp. All rights reserved.
Catch the perfect wave 🏄‍♂️

Visit us at: ${process.env.FRONTEND_URL || "http://localhost:5173"}
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
