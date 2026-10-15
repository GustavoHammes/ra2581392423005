import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubRepos } from "../server/github.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }
  const account = req.query.account ?? "personal";
  if (account !== "personal" && account !== "team")
    return res.status(400).json({ error: "Conta inválida." });
  try {
    const repos = await loadGitHubRepos(account, process.env.GITHUB_READ_TOKEN);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json(repos);
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ error: "GitHub temporariamente indisponível." });
  }
}
