import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
  const password = req.body?.password;
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof password !== "string" || !expected)
    return res.status(401).json({ error: "Acesso não autorizado." });
  const receivedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  )
    return res.status(401).json({ error: "Acesso não autorizado." });
  return res.status(200).json({ success: true });
}
