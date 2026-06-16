import nodemailer from "nodemailer";
import { passwordResetTemplate } from "./EmailTemplates";

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  public async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
  ): Promise<void> {
    const expiresInMinutes = Number(
      process.env.PASSWORD_RESET_EXPIRY_MINUTES ?? 15,
    );

    const template = passwordResetTemplate({
      appName: "AcademiaConnect",
      resetUrl,
      expiresInMinutes,
    });

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }
}