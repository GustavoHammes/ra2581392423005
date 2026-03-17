import type { VercelRequest, VercelResponse } from '@vercel/node';

const REPO_OWNER = 'GustavoHammes';
const REPO_NAME = 'ra2581392423005';
const FILE_PATH = 'public/data.json';
const BRANCH = 'main';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin password
  const { password, data } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN não configurado no Vercel.' });
  }

  if (!data || !data.projects || !data.certificates) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  try {
    const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    // 1. Get current file SHA (required for update)
    const getRes = await fetch(`${apiBase}?ref=${BRANCH}`, { headers });
    if (!getRes.ok) {
      throw new Error(`GitHub GET falhou: ${getRes.status} ${await getRes.text()}`);
    }
    const fileInfo = await getRes.json() as { sha: string };
    const sha = fileInfo.sha;

    // 2. Encode new content as base64
    const newContent = JSON.stringify(data, null, 2);
    const encoded = Buffer.from(newContent).toString('base64');

    // 3. Push updated file
    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'chore: update portfolio data via admin panel',
        content: encoded,
        sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      throw new Error(`GitHub PUT falhou: ${putRes.status} ${await putRes.text()}`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('saveData error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
