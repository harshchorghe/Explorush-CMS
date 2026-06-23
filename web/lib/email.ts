import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "Explorush <noreply@explorush.com>";

  console.log(`[EMAIL QUEUED] To: ${to} | Subject: ${subject}`);

  if (!host || !user || !pass) {
    console.warn(
      `[EMAIL NOTIFICATION MOCK] SMTP environment variables are missing. Logging email body instead:`
    );
    console.log(`----------------------------------------`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]*>/g, " ").trim()}`);
    console.log(`----------------------------------------`);
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL SENT] MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL ERROR] Failed to send email:", error);
    // Don't crash the server request if email fails, return success: false
    return { success: false, error };
  }
}
