import type { Plugin } from "vite";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import github from "../api/github";
import contact from "../api/contact";

// The same handlers run locally and in Vercel Functions.
export function localApi(): Plugin {
  type Handler = (
    req: VercelRequest,
    res: VercelResponse,
  ) => VercelResponse | Promise<VercelResponse>;
  const routes = new Map<string, Handler>([
    ["/api/github", github],
    ["/api/contact", contact],
  ]);
  return {
    name: "portfolio-local-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://localhost");
        const handler = routes.get(url.pathname);
        if (!handler) return next();
        const req = request as VercelRequest;
        const res = response as VercelResponse;
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: unknown) => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data));
          return res;
        };
        req.query = Object.fromEntries(url.searchParams);
        req.cookies = {};
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 4_500_000) {
              res.status(413).json({ error: "Arquivo muito grande." });
              return;
            }
            chunks.push(Buffer.from(chunk));
          }
          req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
          await handler(req, res);
        } catch {
          if (!res.headersSent)
            res.status(400).json({ error: "Não foi possível processar a solicitação." });
        }
      });
    },
  };
}
