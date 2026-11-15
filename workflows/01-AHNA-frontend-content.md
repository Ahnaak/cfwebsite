# Ahna: front end, content, design

You own what visitors see and read. Branch names: `ahna/<topic>`. Files: `index.html` body sections, `images/`, `src/components.css` (shared styles), copy.
Run the site with `npm install` once, then `npm run dev` (see README.md). Don't edit `css/styles.css`; it is generated.
Do not edit: `<head>` security tags, `js/` payment/form code, `.github/`, legal pages (Arya). Ask first.

---

## Sprint 1: real content and a sponsor-ready page (days 1 to 5)

### PR 1: `ahna/real-content`  (blocking: needs info from the NGO)
- [ ] Collect from the NGO and confirm in writing: real stats (boys supported, volunteers, hours), years active, exact programs.
- [ ] Replace the placeholder stats in the "What is Maho?" section (`35+ / 35+ / 80+`).
- [ ] Write the real story cards (6) and testimonials (3+). Each needs a written OK from the person quoted and, for children, from the shelter.
- [ ] Remove every `TODO` comment once its content is real.
- **Done when:** no placeholder text remains; a list of consents is saved in a shared folder (not in the repo).

### PR 2: `ahna/sponsor-tiers`
- [ ] Agree the tiers and amounts with the NGO (current ₹1,500 / ₹12,000 / ₹50,000 are samples).
- [ ] For each tier write one plain sentence of what it pays for (specific: "books for one boy for a term").
- [ ] Add a "Custom amount" card.
- [ ] Add a "Where your money goes" block (e.g. percentage split) only with figures the NGO confirms.
- [ ] Keep each tier button as `<a href="#contact" data-plan="...">`. Arya will swap these for payment links, so do not rename `data-plan`.
- **Done when:** every number on the page is confirmed by the NGO.

### PR 3: `ahna/media`
- [ ] Final hero photo (`images/hero.jpg`): one image, faces covered or cropped, consent confirmed.
- [ ] Final logo, `favicon.png`, and a 1200x630 `og-image.jpg`.
- [ ] Convert photos to WebP, under 200 KB each; keep a `.jpg` fallback if needed.
- [ ] Add `width` and `height` attributes on every `<img>`; `loading="lazy"` below the fold.
- [ ] Write real alt text describing the scene, never naming a child.
- **Done when:** page weight under ~1 MB total, no layout jump while loading.

### PR 4: `ahna/footer-contact`
- [ ] Add the NGO phone and email to the footer ("Get in touch").
- [ ] Add real social links (replace `href="#"`).
- [ ] Add footer links to Privacy, Terms and Refund pages (Arya creates the files; link to `privacy.html`, `terms.html`, `refund-policy.html`).

---

## Sprint 2: quality and trust (days 6 to 10)

### PR 5: `ahna/responsive`
- [ ] Test at 360, 390, 768, 1024, 1280 and 1920px; fix overflow and cramped text.
- [ ] Mobile menu: opens, closes on link click, closable with Escape.
- [ ] Make sure the "Sponsor now" button is easy to tap (44px minimum).

### PR 6: `ahna/accessibility`
- [ ] One `<h1>`, headings in order, landmarks (`header`, `main`, `footer`).
- [ ] Text contrast at least 4.5:1 (check violet on black, yellow button text).
- [ ] Visible focus ring on every link, button and field; test using only Tab.
- [ ] Add a "Skip to content" link.
- [ ] Respect `prefers-reduced-motion` (smooth-scroll off).
- [ ] Form labels linked to inputs; error messages announced.

### PR 7: `ahna/trust-section`
- [ ] "Our transparency" block: registration details, 80G/12A status if applicable, annual report link, partner/volunteer logos (only with permission).
- [ ] Short "How sponsorship works" in 3 steps (choose, pay securely, receive updates).
- [ ] FAQ: Is it tax deductible? Will I get a receipt? Can I cancel/refund? How is my data used? (Arya reviews the answers for accuracy.)

### PR 8: `ahna/seo-polish`
- [ ] Unique `<title>` and meta description (body-adjacent only; send head changes to Arya).
- [ ] Add `sitemap.xml` and `robots.txt` (use relative-safe URLs; update once the domain is final).
- [ ] Lighthouse (Chrome DevTools) at 90+ for Performance, Accessibility, Best Practices, SEO; paste the scores in the PR.

---

## Your handoffs to Arya
| When | What Arya needs from you |
|---|---|
| After PR 2 | Final tier names and amounts (Arya creates matching payment links) |
| After PR 4 | Confirm footer links so Arya's legal pages have matching file names |
| Any time | New external domains you embed (fonts, videos, maps). Arya must allow them in the CSP, so avoid adding any |

## Rules of thumb
- No new third-party scripts or embeds without asking Arya (security).
- Never put children's full names, faces or any identifying details on the site.
- Every claim on the site (numbers, impact) must be verifiable by the NGO.
