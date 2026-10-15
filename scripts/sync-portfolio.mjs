import { copyFile } from 'node:fs/promises';

// Keep public/data.json as the admin panel's source of truth. Vite only imports
// modules from src; this generated copy provides content before the fetch ends.
await copyFile('public/data.json', 'src/data/portfolio-defaults.json');
