import fs from "fs";
import path from "path";

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface PasswordResetTemplateParams {
  appName: string;
  resetUrl: string;
  expiresInMinutes: number;
}

function loadTemplate(templateName: string): string {
  const templatePath = path.join(__dirname, "templates", templateName);
  return fs.readFileSync(templatePath, "utf-8");
}

function replaceTemplateVariables(
  template: string,
  variables: Record<string, string | number>,
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`\${${key}}`, String(value));
  }

  return result;
}

export function passwordResetTemplate(
  params: PasswordResetTemplateParams,
): EmailTemplate {
  const { appName, resetUrl, expiresInMinutes } = params;

  const htmlTemplate = loadTemplate("password-reset.html");

  const html = replaceTemplateVariables(htmlTemplate, {
    appName,
    resetUrl,
    expiresInMinutes,
    uniqueId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  });

  const text = `
You requested a password reset for your ${appName} account.

Open this link to reset your password:
${resetUrl}

This link will expire in ${expiresInMinutes} minutes.

If you did not request this, you can safely ignore this email.
  `.trim();

  return {
    subject: `Reset your ${appName} password`,
    text,
    html,
  };
}