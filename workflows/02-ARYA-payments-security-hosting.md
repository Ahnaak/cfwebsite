# Arya: payments, security, hosting

You own how the site is built, deployed, protected and paid for. Branch names: `arya/<topic>`.
Files: `<head>` of `index.html`, contact-form `action`, `js/`, `.github/`, `package.json`, Tailwind config, `_headers`, `CNAME`, legal pages, `SECURITY.md`.
Do not edit: body content, copy, images (Ahna). Ask first.

**Non-negotiables:** never handle card numbers on our site; never commit secrets; never mark a payment as received from the browser.

---

## Sprint 1: build, deploy, payments (days 1 to 5)

### PR 1: `arya/build-pipeline`  (do this first; it unblocks everything)
- [x] `npm init -y`, then `npm i -D tailwindcss@3` (pinned to 3.4.19).
- [x] Create `tailwind.config.js` (colour/font config moved out of the inline `<script>`), `src/input.css` (entry), `src/fonts.css`, and `src/components.css` (the `.wrap/.section/.h2/.btn/.card/.vcard` helpers, owned by Ahna).
- [x] Scripts: `npm run build` outputs minified CSS plus `index.html`, `js/`, `images/`, `fonts/` into `dist/`; `npm run dev` (watch + local server); `npm run preview` (serves `dist/` at `/cfwebsite/` like GitHub Pages).
- [x] Remove `<script src="https://cdn.tailwindcss.com">`, link the built CSS (`css/styles.css`, relative path).
- [x] Self-host the Plus Jakarta Sans font (variable woff2 in `fonts/`, OFL licence included); Google Fonts links removed.
- [x] `.gitignore`: `node_modules/`, `dist/`, `css/styles.css`, `.env`. `.gitattributes` normalises line endings.
- [ ] Follow-up for PR 5 (CSP): the `<img onerror="...">` attributes in the body are inline scripts and will be blocked by a strict CSP. Ask Ahna to remove them once the final images are in.
- **Done when:** `npm run build` produces a `dist/` that looks identical to the current page with no external requests except payment/form providers.
- **Tell Ahna** when merged; she rebases.

### PR 2: `arya/deploy-pages`
- [x] `.github/workflows/deploy.yml`: on push to `main`: checkout, setup-node, `npm ci`, `npm run build`, `npm run check`, upload `dist/` with `actions/upload-pages-artifact`, deploy with `actions/deploy-pages`. Actions pinned to commit SHAs.
- [x] Minimal permissions block (`contents: read`, `pages: write`, `id-token: write`); checkout does not keep credentials.
- [x] `scripts/check.mjs` (`npm run check`): fails on broken file links, root-absolute paths (break on `/cfwebsite/`), files loaded from other websites, `http://` and `javascript:` links; warns on inline JavaScript.
- [x] `.github/workflows/pr-check.yml`: builds, runs `npm audit` and `npm run check` on every pull request.
- [ ] Repo owner sets Settings > Pages > Source = **GitHub Actions** (needs admin).
- [ ] After merge: confirm it works at `https://ahnaak.github.io/cfwebsite/`.
- [ ] Repo owner adds "build-and-check" as a required status check in the `main` branch rule.

### PR 3: `arya/payments`  (blocking: needs the NGO's documents)
- [ ] Choose provider (Razorpay is common in India; Payment Pages/Links need no server). Requirements from the NGO: registration certificate, PAN, bank account, 80G/12A, authorised signatory ID.
- [ ] Create **test-mode** payment links for each tier plus a custom-amount page. Record the links in a `config/payments.json` (public links are not secrets; API keys and webhook secrets are).
- [ ] In `js/payments.js` map each `data-plan` to its link and open it with `rel="noopener noreferrer"`.
- [ ] Enable receipts/80G emails and failure/refund flows in the provider dashboard.
- [ ] Create `thank-you.html`: show a generic message only. It must **not** trust URL parameters to claim a payment succeeded.
- [ ] The provider's webhook is the only source of truth for "paid". If we need records, use a serverless function (Cloudflare Worker) that verifies the **signature** of the webhook. Secrets live in the host's secret store, never in the repo.
- **Done when:** a test payment completes in test mode and the receipt arrives.

### PR 4: `arya/contact-form`
- [x] Pick a form service: **Formspree free plan** (50 messages/month, built-in spam filter, free domain restriction, no third-party scripts on our page). Works the same on GitHub Pages and Vercel. Fallback if we outgrow it: Web3Forms free (250/month); only the form `action` changes.
- [x] Form `action` + `method="POST"`; every field has a `name`, length limits, email/phone validation.
- [x] Honeypot field `website` (off-screen, `aria-hidden`, `tabindex="-1"`, `autocomplete="off"`), checked in the browser and never sent.
- [x] ~~Turnstile/hCaptcha~~: skipped for now. Both add third-party scripts, and Formspree's free spam filter plus domain restriction cover us. Revisit if spam gets through.
- [x] `js/contact-form.js` submits with `fetch`: success/failure/offline/timeout messages, button disabled while sending, no double sends, provider errors shown as plain text, honest "not connected" message if the ID is missing.
- [x] No personal data in URLs or console logs; no cookies sent.
- [ ] **Connect:** create the Formspree form (NGO inbox), put its ID in the form `action`, send one test message, then turn on domain restriction for `ahnaak.github.io`.
- **Done when:** a message reaches the NGO inbox, spam bot posts are rejected.

---

## Sprint 2: security hardening (days 6 to 10)

### PR 5: `arya/csp-headers`
- [ ] Write a Content-Security-Policy that allows: `'self'` only, plus the payment provider and the form service (`connect-src https://formspree.io` and `form-action https://formspree.io`). No `unsafe-inline` or `unsafe-eval` (possible after PR 1).
- [ ] GitHub Pages: add as `<meta http-equiv="Content-Security-Policy">` in `<head>` (note: `frame-ancestors` doesn't work in a meta tag).
- [ ] Domain host: add `_headers` (Netlify/Cloudflare Pages) with:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy: ...`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `frame-ancestors 'none'` (clickjacking protection)
- [ ] Test in Chrome DevTools: no CSP violations in the console on every page.

### PR 6: `arya/legal-pages`
- [ ] `privacy.html` (what data the contact form and payment provider collect, retention, who to ask), `terms.html`, `refund-policy.html`. Payment providers require these and the shelter's children's data needs care.
- [ ] Use the same layout/styles as the main page (copy the head and header/footer). Ahna reviews wording for tone.
- [ ] Contact details and grievance officer name if required by the provider.

### PR 7: `arya/repo-security`
- [ ] `SECURITY.md` (how to report issues) and `.well-known/security.txt`.
- [ ] Dependabot config for npm and GitHub Actions (`.github/dependabot.yml`).
- [ ] Add a secret-scan step in CI (`gitleaks` action).
- [ ] `npm audit --omit=dev` must pass in CI.
- [ ] Add `rel="noopener noreferrer"` to all external links (coordinate with Ahna for the body links).

---

## Sprint 3: domain and go-live (days 11 to 14)

### Custom domain (when bought)
- [ ] Buy the domain with auto-renew and registrar lock on; put it in the NGO's name, not a personal account.
- [ ] Option A, GitHub Pages: add `CNAME` file containing the domain; DNS `A` records to GitHub's four IPs plus a `www` CNAME to `ahnaak.github.io`; Settings > Pages > enable **Enforce HTTPS**.
- [ ] Option B, Cloudflare in front (recommended for headers): add the domain to Cloudflare, proxy it, SSL mode **Full (strict)**, add the `_headers` rules as Transform Rules or deploy on Cloudflare Pages.
- [ ] Turn on DNSSEC; add SPF/DKIM/DMARC if the NGO sends email from the domain.
- [ ] Add the new domain to the payment provider's and form service's allowed domains; update `sitemap.xml` and `og:` URLs (tell Ahna).

### Go-live checks
- [ ] Switch the provider from test mode to **live**; do a small real payment (₹10-₹50) and refund it.
- [ ] https://securityheaders.com: aim for A or A+.
- [ ] https://www.ssllabs.com/ssltest: aim for A.
- [ ] Search the repo and history for leaked keys (`gitleaks detect`).
- [ ] No console errors, no mixed content, 404 page exists.
- [ ] Tag `v1.0`; document rollback (revert the PR, redeploy).

---

## Your handoffs to Ahna
| When | What Ahna needs from you |
|---|---|
| After PR 1 | Tell her to rebase; explain `npm run build` and `npm run dev` (add a watch script) |
| After PR 3 | Which tier names map to which payment links |
| After PR 6 | Final file names of legal pages for the footer |
| Any time | The list of allowed external domains (so she doesn't add blocked embeds) |

## Rules of thumb
- Review every one of Ahna's PRs for added scripts, external URLs, and anything that handles user data.
- If something needs a secret, it goes in GitHub Actions secrets or the host's environment variables. Never in code, never in chat.
