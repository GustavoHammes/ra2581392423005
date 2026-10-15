import { copyFile } from "node:fs/promises";

// Edit public/data.json. Vite imports the generated copy from src so the full
// project selection is available immediately, without a second browser request.
await copyFile("public/data.json", "src/data/portfolio-defaults.json");
