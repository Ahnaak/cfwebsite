// Development mode: rebuilds the CSS whenever you save a file, and serves the site.
// Usage: npm run dev   then open http://localhost:8000
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tailwindCli = join(root, "node_modules", "tailwindcss", "lib", "cli.js");
if (!existsSync(tailwindCli)) {
  console.error("Tailwind is not installed. Run `npm install` first.");
  process.exit(1);
}

// css/styles.css is generated (and git-ignored). stdin is kept open so Tailwind keeps watching.
const tw = spawn(
  process.execPath,
  [tailwindCli, "-i", "src/input.css", "-o", "css/styles.css", "--watch"],
  { cwd: root, stdio: ["pipe", "inherit", "inherit"], env: { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: "1" } }
);
tw.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => { tw.kill(); process.exit(0); });

serve(root, 8000, "/");
