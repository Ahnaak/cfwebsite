// Builds the production site into dist/ (what gets deployed).
// Usage: npm run build
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const tailwindCli = join(root, "node_modules", "tailwindcss", "lib", "cli.js");

if (!existsSync(tailwindCli)) {
  console.error("Tailwind is not installed. Run `npm install` first.");
  process.exit(1);
}

// 1. Start clean
rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "css"), { recursive: true });

// 2. Build the minified stylesheet
const css = spawnSync(
  process.execPath,
  [tailwindCli, "-c", join(root, "tailwind.config.js"), "-i", join(root, "src", "input.css"), "-o", join(dist, "css", "styles.css"), "--minify"],
  { cwd: root, stdio: "inherit", env: { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: "1" } }
);
if (css.status !== 0) {
  console.error("CSS build failed.");
  process.exit(css.status ?? 1);
}

// 3. Copy the static files. Only what is listed here is published.
const copyIfExists = [
  "js", "images", "fonts", ".well-known",
  "robots.txt", "sitemap.xml", "CNAME", "_headers", "favicon.ico", "favicon.png", "favicon.svg",
];
for (const name of copyIfExists) {
  const from = join(root, name);
  if (existsSync(from)) cpSync(from, join(dist, name), { recursive: true });
}
for (const file of readdirSync(root)) {
  if (file.endsWith(".html")) cpSync(join(root, file), join(dist, file));
}

// 4. Tell GitHub Pages not to run Jekyll (it would hide _headers and .well-known)
writeFileSync(join(dist, ".nojekyll"), "");

console.log("Built site in dist/");
