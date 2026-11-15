# Team workflow: Ahna and Arya

**Detailed step-by-step plans:** [Day 0 setup](workflows/00-DAY0-SETUP.md) · [Ahna](workflows/01-AHNA-frontend-content.md) · [Arya](workflows/02-ARYA-payments-security-hosting.md)

Goal: a sponsor/donation website that can be hosted on **GitHub Pages or a custom domain** (both must work), with **payments handled securely**.

## Key decisions (so we don't redo them later)

1. **Keep the site static.** Plain HTML/CSS/JS built to a `dist/` folder. Static files host the same on GitHub Pages, Cloudflare Pages, Netlify or Vercel, so the choice of host never blocks us.
2. **Never touch card data ourselves.** Payments go through a hosted provider (e.g. Razorpay Payment Pages / Payment Links, or a UPI link). The card form lives on the provider's domain, not ours. This removes most PCI risk. No API secrets ever go in this repo.
3. **Use relative paths** (`images/x.jpg`, not `/images/x.jpg`) so the site works at `username.github.io/cfwebsite/` and at `www.ourdomain.org` without edits.
4. **Replace the Tailwind CDN script with a build step** (Tailwind CLI). The CDN version is for prototyping only; it blocks a strict Content-Security-Policy and is slower.
5. **Security headers**: GitHub Pages cannot set custom HTTP headers. For a real domain, put the site behind Cloudflare (free) or host on Cloudflare Pages / Netlify, which can set HSTS, CSP and the rest. Until then we ship a CSP `<meta>` tag as a fallback.
6. **Form submissions** go to a managed service (Formspree, Web3Forms) or a small serverless function. Never a self-written server.

## Branching rules

- `main` is protected: no direct pushes, 1 approving review (the other person), CI must pass.
- Branch names: `ahna/<topic>`, `arya/<topic>`.
- Small PRs (under ~300 lines), merged often. Rebase on `main` before opening a PR.
- Each person reviews the other's PR before merge. Security PRs (Arya) get a second careful read by Ahna.
- Commit messages: short, present tense ("Add sponsor tier cards").

## File ownership (prevents merge conflicts)

| Area | Owner |
|---|---|
| `index.html` body sections (hero, about, sponsor tiers, stories, testimonials, programs, footer) | **Ahna** |
| `images/`, `src/components.css` shared styles, responsive/accessibility fixes | **Ahna** |
| Content, copy, consent checks for photos/quotes | **Ahna** |
| `index.html` `<head>` (CSP, meta), contact-form `action`, `js/` (form + payments) | **Arya** |
| `donate.html`, `thank-you.html`, `privacy.html`, `terms.html`, `refund-policy.html` | **Arya** (copy reviewed by Ahna) |
| `.github/workflows/`, `_headers`, `CNAME`, `package.json`, `tailwind.config.js`, `src/input.css`, `src/fonts.css`, `fonts/`, `scripts/`, `SECURITY.md`, `security.txt` | **Arya** |

If you need to touch the other person's area, message first or open a PR into their branch.

## Ahna: front-end, content, design

**Phase 1: foundation (week 1)**
- [ ] Replace all placeholder stats, tier amounts, stories and testimonials with real, confirmed content.
- [ ] Get the shelter's written consent for every photo and child story; crop or cover children's faces.
- [ ] Add real logo, favicon, social share image (`og:image`).
- [ ] Add phone and email to the footer and the real social links.

**Phase 2: polish (week 2)**
- [ ] Mobile pass at 360px, 768px and 1280px; fix any overflow.
- [ ] Accessibility: heading order, alt text, colour contrast, keyboard focus, `prefers-reduced-motion`.
- [ ] Compress images (WebP, under ~200 KB each), add `width`/`height` to prevent layout shift.
- [ ] Lighthouse score 90+ on Performance, Accessibility, SEO.
- [ ] Transparency section for sponsors: where the money goes, impact, annual report/80G details if applicable.

## Arya: payments, security, hosting

**Phase 1: foundation (week 1)**
- [ ] Tailwind CLI build into `dist/`; remove the CDN script; self-host the font.
- [ ] GitHub Actions: build, then deploy to GitHub Pages. Confirm it works at the `github.io/<repo>/` path.
- [ ] Turn on branch protection, Dependabot, secret scanning, and 2FA for both accounts.
- [ ] Choose the payment provider (needs the NGO's registration, PAN, bank details and 80G/12A docs). Create the payment links/pages for each tier plus a custom amount.
- [ ] Wire the "Choose this" buttons to the hosted payment links, which must open over HTTPS on the provider's domain.

**Phase 2: hardening (week 2)**
- [ ] CSP: allow only our own origin plus the payment provider and form service. No `unsafe-inline` once the build is in place.
- [ ] Other headers via `_headers` (domain host) or Cloudflare: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`.
- [ ] Contact form: server-side validation by the form service, honeypot field, CAPTCHA (Turnstile/hCaptcha), rate limiting. No personal data in URLs.
- [ ] Add `rel="noopener noreferrer"` on external links; Subresource Integrity on any third-party script we keep.
- [ ] Confirm the payment success/failure page does not trust URL parameters. Mark a donation as paid only via the provider's signed webhook, never from the browser.
- [ ] Legal pages: privacy policy, terms, refund policy, contact details (the payment provider requires these).
- [ ] `security.txt` and `SECURITY.md` with a contact for reporting vulnerabilities.

## Domain vs GitHub Pages: both stay possible

| Step | GitHub Pages | Custom domain |
|---|---|---|
| Hosting | GitHub Actions deploy of `dist/` | Same `dist/` on Cloudflare Pages / Netlify, or keep GitHub Pages and add the domain |
| URL | `username.github.io/cfwebsite/` | `www.ourdomain.org` |
| Switching | Nothing to change in code (relative paths) | Add `CNAME` file and DNS records. In GitHub: Settings > Pages > Custom domain, enable "Enforce HTTPS" |
| Headers | CSP via `<meta>` only | Real HTTP headers through Cloudflare or the host |
| Payments | Same payment links | Add the new domain to the provider's allowed domains |

Recommendation: buy the domain, since payment providers and donors trust a branded domain far more than `github.io`. Point it at the same build, put Cloudflare in front, and keep GitHub as the source repo.

## Merging at the end

1. Both branches merged to `main` through PRs, with the CI deploy green on the Pages preview.
2. Joint checklist, tested on the live URL:
   - [ ] A test payment goes through in the provider's **test mode**, then the live mode with a small real amount, then is refunded.
   - [ ] Form submission arrives in the NGO inbox; spam is blocked.
   - [ ] Security headers score A on securityheaders.com; SSL Labs A.
   - [ ] No secrets in the repo (`git log -p | grep -i key`, plus GitHub secret scanning).
   - [ ] Lighthouse 90+; all links work; works at the github.io path and at the custom domain.
   - [ ] All placeholder text and `TODO` comments are removed.
3. Tag the release (`v1.0`), and keep a rollback plan: revert the PR and redeploy.
