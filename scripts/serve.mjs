// Tiny local web server for testing. Not for production.
// Usage: node scripts/serve.mjs <folder> [port] [basePath]
//   basePath lets us test the GitHub Pages sub-path, e.g. /cfwebsite/
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export function serve(folder = ".", port = 8000, basePath = "/") {
  const root = resolve(folder);
  const base = ("/" + basePath + "/").replace(/\/+/g, "/");
  const types = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  };
  // Tooling folders and config files are never served. Hidden files (.env, .git...) are blocked below.
  const blocked = ["node_modules", "scripts", "src", "package.json", "package-lock.json", "tailwind.config.js"];

  createServer((req, res) => {
    let path;
    try { path = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
    catch { res.writeHead(400).end("Bad request"); return; }

    if (base !== "/" && path === base.slice(0, -1)) { res.writeHead(301, { Location: base }).end(); return; }
    if (!path.startsWith(base)) { res.writeHead(404).end("Not found"); return; }

    let file = normalize(join(root, path.slice(base.length)));
    // Never serve anything outside the folder, or tooling folders
    const rel = file.slice(root.length + 1).split(sep);
    const hidden = rel.some((part) => part.startsWith(".") && part !== ".well-known");
    if ((file !== root && !file.startsWith(root + sep)) || blocked.includes(rel[0]) || hidden) { res.writeHead(404).end("Not found"); return; }

    try { if (statSync(file).isDirectory()) file = join(file, "index.html"); statSync(file); }
    catch { res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found"); return; }

    res.writeHead(200, { "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    createReadStream(file).pipe(res);
  }).listen(port, "127.0.0.1", () => {
    console.log(`Serving ${folder} at http://localhost:${port}${base}`);
  });
}

// Run directly from the command line
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , folder = ".", port = "8000", basePath = "/"] = process.argv;
  serve(folder, Number(port), basePath);
}
