// Safety checks on the built site (dist/). Run after `npm run build`:  npm run check
// Fails (exit code 1) on problems that would break the live site or weaken security.
// Owner: Arya.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// Third-party domains the page may LOAD things from (scripts, styles, images, frames).
// Plain links (<a href>) to other sites are always fine. Add a domain here only after a security review,
// and add it to the Content-Security-Policy too (PR 5).
const allowedExternalHosts = [];

const errors = [];
const warnings = [];

if (!existsSync(join(dist, "index.html"))) {
  console.error("dist/index.html is missing. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const files = walk(dist);
const rel = (f) => relative(dist, f).replace(/\\/g, "/");

// Checks one referenced URL found in `file`.
function checkUrl(file, url, { loads }) {
  const where = `${rel(file)}: "${url}"`;
  const u = url.trim();
  if (!u || u.startsWith("#") || /^(mailto|tel|data|blob|javascript):/i.test(u)) {
    if (/^javascript:/i.test(u)) errors.push(`${where} uses a javascript: link. Use a normal link or a button with code in js/.`);
    return;
  }
  if (/^(https?:)?\/\//i.test(u)) {
    const host = new URL(u.startsWith("//") ? "https:" + u : u).hostname;
    if (u.startsWith("http:")) errors.push(`${where} uses insecure http://. Use https://.`);
    if (loads && !allowedExternalHosts.includes(host)) {
      errors.push(`${where} loads a file from another website (${host}). Self-host it, or get it approved and add it to allowedExternalHosts in scripts/check.mjs.`);
    }
    return;
  }
  if (u.startsWith("/")) {
    errors.push(`${where} starts with "/". It will break on GitHub Pages (/cfwebsite/). Use a relative path like "${u.replace(/^\/+/, "")}".`);
    return;
  }
  const clean = decodeURIComponent(u.split(/[?#]/)[0]);
  if (!clean) return;
  let target = resolve(dirname(file), clean);
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
  if (!target.startsWith(dist) || !existsSync(target)) {
    errors.push(`${where} points to a file that isn't in the built site. Check the spelling, or that the file is copied in scripts/build.mjs.`);
  }
}

for (const file of files) {
  if (file.endsWith(".html")) {
    const html = readFileSync(file, "utf8");
    for (const [, tag, attrs] of html.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*)>/g)) {
      const attr = {};
      for (const m of attrs.matchAll(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) attr[m[1].toLowerCase()] = m[3] ?? m[4];
      const t = tag.toLowerCase();
      if (attr.src) checkUrl(file, attr.src, { loads: true });
      if (attr.href) {
        const relAttr = (attr.rel || "").toLowerCase();
        const loads = t === "link" && relAttr !== "canonical" && relAttr !== "alternate";
        checkUrl(file, attr.href, { loads });
        if (t === "a" && attr.target === "_blank" && !/noopener/.test(relAttr)) {
          warnings.push(`${rel(file)}: link to "${attr.href}" opens a new tab without rel="noopener noreferrer".`);
        }
      }
      if (attr.action) checkUrl(file, attr.action, { loads: false });
      const handlers = Object.keys(attr).filter((a) => /^on[a-z]+$/.test(a));
      if (handlers.length) warnings.push(`${rel(file)}: <${t} ${handlers.join(" ")}="..."> is inline JavaScript; a strict security policy (PR 5) will block it.`);
    }
    if (html.includes("REPLACE_WITH")) {
      warnings.push(`${rel(file)}: still contains a REPLACE_WITH placeholder (e.g. the contact form isn't connected to Formspree yet).`);
    }
    for (const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (m[1].trim()) warnings.push(`${rel(file)}: inline <script> block; move it into a file in js/ before PR 5.`);
    }
  }
  if (file.endsWith(".css")) {
    const css = readFileSync(file, "utf8");
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) checkUrl(file, m[1], { loads: true });
  }
}

for (const w of warnings) console.warn("warning: " + w);
for (const e of errors) console.error("ERROR:   " + e);
if (errors.length) {
  console.error(`\n${errors.length} problem(s) found. Fix them before merging.`);
  process.exit(1);
}
console.log(`Checks passed (${files.length} files${warnings.length ? `, ${warnings.length} warning(s)` : ""}).`);
