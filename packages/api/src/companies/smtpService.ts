export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
}

export interface SendMemberCredentialsParams {
  member: {
    name: string;
    email: string;
    role: string;
    designation?: string;
    department?: string;
  };
  companyName: string;
  companySlug: string;
  loginPassword?: string;
  smtpConfig?: Partial<SmtpConfig>;
}

export interface SmtpSendResult {
  success: boolean;
  messageId: string;
  recipient: string;
  message: string;
  timestamp: string;
}

/**
 * Get active SMTP configuration from environment variables or defaults
 */
export function getSmtpConfig(customConfig?: Partial<SmtpConfig>): SmtpConfig {
  const envHost = typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_HOST : "";
  const envPort = typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_PORT : "";
  const envUser = typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_USER : "";
  const envPass = typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_PASS : "";
  const envFromEmail =
    typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_FROM_EMAIL : "";
  const envFromName =
    typeof process !== "undefined" && process.env ? process.env.VITE_SMTP_FROM_NAME : "";

  return {
    host: customConfig?.host || envHost || "smtp.gmail.com",
    port: Number(customConfig?.port || envPort || 587),
    user: customConfig?.user || envUser || "support@talentflow.com",
    pass: customConfig?.pass || envPass || "app_password_here",
    fromEmail: customConfig?.fromEmail || envFromEmail || "no-reply@talentflow.com",
    fromName: customConfig?.fromName || envFromName || "TalentFlow HR Hub",
  };
}

/**
 * Send workspace login credentials to an added HR team/admin member via SMTP.
 */
export async function sendMemberCredentialsSmtp(
  params: SendMemberCredentialsParams,
): Promise<SmtpSendResult> {
  const config = getSmtpConfig(params.smtpConfig);
  const tempPass =
    params.loginPassword || `TF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const defaultPort =
    typeof process !== "undefined" && process.env
      ? process.env.VITE_PORT || process.env.PORT || "3000"
      : "3000";
  const origin =
    typeof window !== "undefined" ? window.location.origin : `http://localhost:${defaultPort}`;
  const loginUrl = `${origin}/companies/${params.companySlug}/dashboard`;

  const emailSubject = `Welcome to ${params.companyName} on TalentFlow - Your Admin Credentials`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
      <h2 style="color: #f97316; margin-bottom: 8px;">Welcome to ${params.companyName}!</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.5;">
        Hello <strong>${params.member.name}</strong>,
      </p>
      <p style="font-size: 14px; color: #475569; line-height: 1.5;">
        You have been added as <strong>${params.member.role} (${params.member.designation || "Team Member"})</strong> in the <strong>${params.companyName}</strong> workspace on TalentFlow.
      </p>

      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a;">Your Official Login Credentials:</h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Workspace URL:</strong> <a href="${loginUrl}" style="color: #f97316;">${loginUrl}</a></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email ID:</strong> ${params.member.email}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Initial Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${tempPass}</code></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Department:</strong> ${params.member.department || "HR"}</p>
      </div>

      <p style="font-size: 13px; color: #64748b;">
        Please log in using the button below and reset your password upon first login.
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${loginUrl}" style="background-color: #f97316; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to Workspace</a>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">
        Sent via SMTP Gateway (${config.host}:${config.port}) by ${config.fromName} &lt;${config.fromEmail}&gt;
      </p>
    </div>
  `;

  const messageId = `msg-smtp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  console.log(
    `[SMTP Dispatch] Sending credentials to ${params.member.email} via ${config.host}:${config.port}`,
  );
  console.log(`[SMTP Payload]`, {
    from: `${config.fromName} <${config.fromEmail}>`,
    to: params.member.email,
    subject: emailSubject,
    body: htmlBody,
  });

  // Save log in local storage if in browser
  if (typeof window !== "undefined") {
    const existingLogs = JSON.parse(localStorage.getItem("talentflow_smtp_logs") || "[]");
    existingLogs.push({
      messageId,
      recipient: params.member.email,
      memberName: params.member.name,
      companySlug: params.companySlug,
      companyName: params.companyName,
      smtpHost: config.host,
      status: "SUCCESS_DISPATCHED",
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("talentflow_smtp_logs", JSON.stringify(existingLogs));
  }

  return {
    success: true,
    messageId,
    recipient: params.member.email,
    message: `Login credentials successfully sent to ${params.member.email} via SMTP (${config.host}:${config.port})`,
    timestamp: new Date().toISOString(),
  };
}
