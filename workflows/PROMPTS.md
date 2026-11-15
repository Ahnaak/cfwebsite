# Copy-paste prompts for Claude Code

Open the project folder in Claude Code, paste the right prompt, and send. To continue later, paste the short "Next step" prompt at the bottom.

---

## PROMPT FOR AHNA (content, design, what visitors see)

```
I am Ahna. I am on a 2-person team building a sponsor/donation website for an NGO (U&I x Maho, which supports boys in a shelter in Bengaluru). My teammate is Arya. I do NOT know web development, so explain everything in plain English, avoid jargon, and tell me exactly what to click or type.

FIRST, read these files in this repo: WORKFLOW.md, workflows/00-DAY0-SETUP.md, workflows/01-AHNA-frontend-content.md, and index.html.

MY ROLE: the front end and content: what visitors see and read. I only edit the <body> sections of index.html, images/, css/, and the copy. I must NOT edit the <head> security tags, anything in js/ about payments or the form, .github/, or the legal pages. Those belong to Arya. If a task needs those, tell me to ask Arya and write a short message I can send her.

HOW TO WORK WITH ME:
1. Start by checking git is set up (git status, current branch, remote). Fix or explain anything that is wrong. Then make sure I'm on a fresh branch named ahna/<topic> from the latest main. NEVER work directly on main.
2. Work through my checklist ONE PR at a time, in order, starting with the first unfinished one. Before each PR, say in 3 lines: what we'll do, what you need from me, and what the result will look like.
3. When you need real information (stats, quotes, amounts, photos) ask me for it. NEVER invent facts, numbers, testimonials or names. If I don't have it yet, keep the clearly marked placeholder and add it to a "Waiting on the NGO" list.
4. After each change, run the site locally and show it to me (start the preview server, take screenshots at phone width 375px and desktop 1280px). Check it looks right and fix problems before telling me it's done.
5. Child safety rules, always: never show a child's face, full name, or identifying details. Only use photos I confirm have the shelter's written consent. Warn me if a photo looks like it shows a face.
6. Don't add any new third-party scripts, embeds, fonts or external links without asking me first, because Arya has to approve them for security.
7. When a PR's work is finished: commit with a clear message, push the branch, and open the pull request on GitHub with a short description plus the checklist from workflows/00-DAY0-SETUP.md section 5. Tell me to ask Arya to review it. Ask me for a yes BEFORE you commit or push, and before anything that cannot be undone.
8. Never merge to main yourself. Arya reviews and merges.
9. At the end of each step give me: what changed (plain English), what's still waiting on me, and the exact next step. Keep a running checklist.

Begin now with Day 0 checks, then PR 1 from my workflow file.
```

---

## PROMPT FOR ARYA (payments, security, hosting)

```
I am Arya. I am on a 2-person team building a sponsor/donation website for an NGO (U&I x Maho, which supports boys in a shelter in Bengaluru). My teammate is Ahna. I do NOT know web development, so explain everything in plain English, avoid jargon, and tell me exactly what to click or type. This site will take real payments, so security matters more than speed.

FIRST, read these files in this repo: WORKFLOW.md, workflows/00-DAY0-SETUP.md, workflows/02-ARYA-payments-security-hosting.md, and index.html.

MY ROLE: how the site is built, protected, deployed and paid for. I edit the <head> of index.html, the contact-form action, js/, .github/, package.json, Tailwind config, _headers, CNAME, the legal pages, and SECURITY.md. I must NOT edit page content, copy or images. Those belong to Ahna. If a task needs those, tell me to ask Ahna and write a short message I can send her.

NON-NEGOTIABLE SECURITY RULES (never break these, even if I ask):
- Card details are never entered on our site. Payments use a hosted provider page (like Razorpay Payment Links), so the card form is on the provider's website.
- No API keys, secrets, passwords or webhook secrets in the repo, in code, or in chat. They go in GitHub Actions secrets or the host's settings. If I paste a secret to you, tell me to rotate it.
- A donation is only "paid" when the provider's signed webhook says so, never because someone reached a thank-you page.
- You must not make real payments or enter any payment credentials. Test-mode setup in the provider dashboard is done by ME in the browser; you guide me step by step.
- Don't edit security settings in the repo or hosting account yourself. Tell me what to click and why.

HOW TO WORK WITH ME:
1. Start by checking git is set up (git status, branch, remote). Make sure I'm on a fresh branch named arya/<topic> from the latest main. NEVER work directly on main.
2. Work through my checklist ONE PR at a time, in order. Start with PR 1 (build pipeline), because it unblocks Ahna. Before each PR, say in 3 lines: what we'll do, what you need from me, and what "done" looks like.
3. The site must stay a static site that works BOTH on GitHub Pages (a /cfwebsite/ sub-path) and on a custom domain. Use relative paths only. After each change run the build and test it locally, and test it served from a sub-path.
4. Verify, don't assume: run npm run build, open the page in the preview browser, check the console for errors and for blocked content (CSP violations), and show me screenshots. Only say something works after you've checked it.
5. Ask me for any account steps (GitHub settings, payment provider signup, domain purchase) and give click-by-click instructions. When I need documents from the NGO (registration, PAN, bank details, 80G/12A), list exactly what to request.
6. Review mindset: whenever Ahna's PR adds a script, embed, external URL or touches user data, flag it to me.
7. When a PR's work is finished: commit with a clear message, push the branch, and open the pull request with the checklist from workflows/00-DAY0-SETUP.md section 5. Ask me for a yes BEFORE you commit or push, and before anything that cannot be undone. Never merge to main yourself; Ahna reviews and merges.
8. At the end of each step give me: what changed (plain English), what's still waiting on me or the NGO, and the exact next step.

Begin now with Day 0 checks, then PR 1 (build pipeline) from my workflow file.
```

---

## SHORT "NEXT STEP" PROMPT (paste when you come back to a session)

```
Continue where we left off. Read workflows/ and git log to see what's done, tell me in plain English which PR we're on and what's left, then continue with the next unfinished item following all the same rules as before.
```

## WHEN SOMETHING BREAKS

```
Something went wrong: <paste the error or describe what you see>. Explain in plain English what it means, fix it safely (don't delete my work, don't force-push), and tell me what you changed.
```

## WHEN REVIEWING THE OTHER PERSON'S PR

```
Review the pull request <paste PR link or number>. Check it only touches the files its author owns (see WORKFLOW.md), look for secrets, new external scripts or links, anything that handles personal data, anything that breaks on phone width or on the GitHub Pages sub-path. Give me a plain-English verdict: safe to merge, or what to ask them to change.
```
