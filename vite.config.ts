import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { localApi } from "./server/dev-api";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const name of ["GITHUB_READ_TOKEN", "GMAIL_USER", "GMAIL_APP_PASS"]) {
    if (env[name]) process.env[name] = env[name];
  }
  return { plugins: [react(), localApi()] };
});
