import type { VercelRequest, VercelResponse } from '@vercel/node';

const REPO_OWNER = 'GustavoHammes';
const REPO_NAME  = 'ra2581392423005';
const BRANCH     = 'main';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password, fileName, folder, base64Content } = req.body as {
    password: string;
    fileName: string;       // e.g. "nlw-agents.pdf"
    folder: string;         // "certificates" | "projects"
    base64Content: string;  // base64 string of the file (sem o prefixo data:...)
  };

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN não configurado.' });

  // Sanitize filename — spaces → hyphens, lowercase, remove special chars
  const safeName = fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '');

  const allowedFolders = ['certificates', 'projects'];
  if (!allowedFolders.includes(folder)) {
    return res.status(400).json({ error: 'Pasta inválida.' });
  }

  const filePath = `public/${folder}/${safeName}`;
  const apiUrl   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
  const headers  = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    // Check if file already exists (to get SHA for overwrite)
    let sha: string | undefined;
    const checkRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (checkRes.ok) {
      const existing = await checkRes.json() as { sha: string };
      sha = existing.sha;
    }

    // Commit file to GitHub
    const body: Record<string, string> = {
      message: `chore: upload ${folder}/${safeName} via admin panel`,
      content: base64Content,
      branch: BRANCH,
    };
    if (sha) body.sha = sha; // required for update

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      throw new Error(`GitHub PUT falhou: ${putRes.status} ${await putRes.text()}`);
    }

    // Return the public URL path for use in data.json
    const publicPath = `/${folder}/${safeName}`;
    return res.status(200).json({ success: true, path: publicPath });

  } catch (err) {
    console.error('uploadFile error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
