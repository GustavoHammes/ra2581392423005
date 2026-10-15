import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body ?? {};
  if (body.website) return res.status(200).json({ success: true });
  const { name: rawName, email: rawEmail, message: rawMessage } = body;
  if (
    typeof rawName !== "string" ||
    typeof rawEmail !== "string" ||
    typeof rawMessage !== "string"
  ) {
    return res.status(400).json({ error: "Campos obrigatórios faltando." });
  }
  const cleanName = rawName.trim();
  const email = rawEmail.trim();
  const cleanMessage = rawMessage.trim();
  if (
    cleanName.length < 2 ||
    cleanName.length > 100 ||
    cleanMessage.length < 10 ||
    cleanMessage.length > 5000 ||
    email.length > 254 ||
    /[\r\n]/.test(cleanName)
  )
    return res.status(400).json({ error: "Confira os campos e tente novamente." });
  const name = escapeHtml(cleanName);
  const message = escapeHtml(cleanMessage);

  // Validação básica de email
  const emailRegex = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido." });
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS)
    return res.status(503).json({
      error: "O formulário está indisponível. Envie sua mensagem para daffa1632@gmail.com.",
    });

  try {
    // Configuração do Gmail (use App Password, não a senha normal)
    // Configurações ficam nas variáveis de ambiente do Vercel
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Seu Gmail: seuemail@gmail.com
        pass: process.env.GMAIL_APP_PASS, // Google App Password (não a senha normal)
      },
    });

    await transporter.sendMail({
      from: `"Portfólio GH" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Recebe no próprio email
      replyTo: email,
      subject: `[Portfólio] Nova mensagem de ${cleanName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            Nova mensagem do portfólio
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 80px;">Nome:</td>
              <td style="padding: 8px 0; color: #222;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #fff; border-radius: 6px; border-left: 4px solid #4f46e5;">
            <p style="font-weight: bold; color: #555; margin: 0 0 8px;">Mensagem:</p>
            <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #999;">
            Enviado via portfólio em ${new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      `,
    });

    // Envia confirmação para quem entrou em contato
    await transporter.sendMail({
      from: `"Gustavo Hammes" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Recebi sua mensagem, ${name.split(" ")[0]}! ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <h2 style="color: #1a1a2e;">Olá, ${name.split(" ")[0]}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Recebi sua mensagem e entrarei em contato em breve. Obrigado por entrar em contato!
          </p>
          <p style="color: #333; line-height: 1.6;">
            Atenciosamente,<br/>
            <strong>Gustavo Hammes</strong>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Falha ao enviar mensagem. Tente novamente." });
  }
}
