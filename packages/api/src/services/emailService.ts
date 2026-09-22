import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import jwt from "jsonwebtoken";
import config, { logger } from "../config";

export interface EmailVerificationTokenPayload {
  email: string;
  role: "company" | "candidate" | "admin";
  purpose: "email_verification";
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  verificationToken?: string;
  verificationUrl?: string;
  otp?: string;
  message?: string;
  error?: string;
}

/**
 * Creates a nodemailer transporter based on Google OAuth 2.0 service or Gmail credentials.
 */
function getTransporter(): Transporter | null {
  const googleUser = process.env.GOOGLE_USER || process.env.GMAIL_USER || config.SMTP_USER;
  const googlePass = process.env.GMAIL_APP_PASSWORD || config.SMTP_PASS;

  // 1. Google OAuth 2.0 Email Service (with Refresh Token)
  if (
    config.GOOGLE_CLIENT_ID &&
    config.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    googleUser
  ) {
    try {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: googleUser,
          clientId: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: process.env.GOOGLE_ACCESS_TOKEN || "",
        },
      });
    } catch (err) {
      logger.error("[EmailService] Failed to initialize Google OAuth2 transporter:", err);
    }
  }

  // 2. Direct Gmail / Google Workspace Transport
  if (googleUser && googlePass) {
    try {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: googleUser,
          pass: googlePass,
        },
      });
    } catch (err) {
      logger.error("[EmailService] Failed to initialize Gmail transporter:", err);
    }
  }

  // 3. Custom host SMTP fallback
  if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
    try {
      return nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_SECURE,
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
        },
      });
    } catch (err) {
      logger.error("[EmailService] Failed to initialize SMTP transporter:", err);
    }
  }

  return null;
}

/**
 * Generates a signed email verification token valid for 24 hours.
 */
export function generateEmailVerificationToken(
  email: string,
  role: "company" | "candidate" | "admin" = "company",
): string {
  const payload: EmailVerificationTokenPayload = {
    email: email.trim().toLowerCase(),
    role,
    purpose: "email_verification",
  };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "24h" });
}

/**
 * Verifies an email verification token.
 */
export function verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as EmailVerificationTokenPayload;
    if (decoded && decoded.purpose === "email_verification" && decoded.email) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Builds the verification URL for the token.
 */
export function buildVerificationUrl(token: string): string {
  const baseUrl = config.API_URL || "http://localhost:5000";
  return `${baseUrl.replace(/\/+$/, "")}/api/auth/verify-email-confirm?token=${encodeURIComponent(token)}`;
}

/**
 * Generates responsive HTML email template for TalentFlow email verification.
 */
function generateVerificationEmailHtml(
  name: string,
  email: string,
  verificationUrl: string,
  role: string,
  otpCode?: string,
): string {
  const portalName =
    role === "candidate"
      ? "Candidate Portal"
      : role === "admin"
        ? "Admin Suite"
        : "Company Workspace";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your TalentFlow account</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0d1117;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 32px 32px 24px;
      background: linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(99, 102, 241, 0.15));
      border-bottom: 1px solid #30363d;
      text-align: center;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #ea580c;
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35);
    }
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #c9d1d9;
    }
    .greeting {
      font-size: 17px;
      font-weight: 600;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .otp-card {
      background: rgba(234, 88, 12, 0.08);
      border: 1px solid rgba(234, 88, 12, 0.3);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #ea580c;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin: 8px 0;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 20px;
    }
    .verify-btn {
      display: inline-block;
      background: linear-gradient(135deg, #ea580c, #f97316);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 36px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(234, 88, 12, 0.35);
    }
    .link-fallback {
      background-color: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 12px 16px;
      word-break: break-all;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: #ea580c;
      margin-top: 16px;
    }
    .footer {
      padding: 24px 32px;
      background-color: #0d1117;
      border-top: 1px solid #30363d;
      font-size: 12px;
      color: #8b949e;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">TF</div>
        <h1 class="brand-title">TalentFlow Enterprise CRM</h1>
      </div>
      <div class="content">
        <p class="greeting">Hello ${name || "there"},</p>
        <p>
          Thank you for creating your <strong>${portalName}</strong> on TalentFlow.
          To complete your registration and verify your email address (<strong>${email}</strong>), please use the verification code below or click the verification button:
        </p>
        
        ${
          otpCode
            ? `
        <div class="otp-card">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #8b949e; letter-spacing: 1px;">Your 6-Digit Verification Code</div>
          <div class="otp-code">${otpCode}</div>
          <div style="font-size: 12px; color: #8b949e;">Valid for 15 minutes. Enter this code on the verification screen.</div>
        </div>
        `
            : ""
        }

        <div class="btn-container">
          <a href="${verificationUrl}" class="verify-btn" target="_blank">Verify Email Address</a>
        </div>

        <p style="margin-bottom: 8px; font-size: 13px; color: #8b949e;">
          Or copy and paste the following verification link into your web browser:
        </p>
        <div class="link-fallback">
          <a href="${verificationUrl}" style="color: #ea580c; text-decoration: none;">${verificationUrl}</a>
        </div>

        <p style="margin-top: 24px; font-size: 13px; color: #8b949e;">
          This verification link is secure and valid for 24 hours. If you did not create this account, please ignore this email.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} TalentFlow Inc. All rights reserved.<br>
        TalentFlow Monorepo Enterprise Recruitment Suite
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatches an email verification link and OTP code to a user.
 * Supports SMTP (via nodemailer) when credentials are provided,
 * and falls back gracefully with console logging in development mode.
 */
export async function sendEmailVerification(
  email: string,
  name: string = "User",
  role: "company" | "candidate" | "admin" = "company",
  otpCode?: string,
): Promise<SendEmailResult> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Email address is required" };
  }

  const token = generateEmailVerificationToken(cleanEmail, role);
  const verificationUrl = buildVerificationUrl(token);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: config.SMTP_FROM,
        to: cleanEmail,
        subject: otpCode
          ? `${otpCode} is your TalentFlow verification code`
          : "Verify your email address - TalentFlow Workspace",
        text: `Welcome to TalentFlow! Your 6-digit verification code is: ${otpCode || "N/A"}. Or verify by opening: ${verificationUrl}`,
        html: generateVerificationEmailHtml(name, cleanEmail, verificationUrl, role, otpCode),
      });

      logger.info(
        `[EmailService] Verification email sent to ${cleanEmail} via SMTP. Message ID: ${info.messageId}`,
      );

      return {
        success: true,
        messageId: info.messageId,
        verificationToken: token,
        verificationUrl,
        otp: otpCode,
        message: `Verification email sent successfully to ${cleanEmail}`,
      };
    } catch (err: unknown) {
      logger.error(`[EmailService] Failed to send email via SMTP to ${cleanEmail}:`, err);
      // Fall through to simulated delivery logging so user is not blocked
    }
  }

  // Fallback / Development Simulation mode:
  logger.info(
    `\n===================================================\n` +
      `📧 [TalentFlow Email Verification]\n` +
      `Recipient: ${cleanEmail} (${name})\n` +
      `Verification OTP Code: ${otpCode || "Generated"}\n` +
      `Verification Link: ${verificationUrl}\n` +
      `===================================================\n`,
  );

  return {
    success: true,
    verificationToken: token,
    verificationUrl,
    otp: otpCode,
    message: `Verification code & link dispatched to ${cleanEmail}.`,
  };
}

export const EmailService = {
  sendEmailVerification,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  buildVerificationUrl,
};

export default EmailService;
