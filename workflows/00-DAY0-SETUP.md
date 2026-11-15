# Day 0: shared setup (do this first, together, ~30 min)

Repo: https://github.com/Ahnaak/cfwebsite (owner: Ahnaak). Arya must be added as a collaborator with **Write** access: Settings > Collaborators.

## 1. Get the redesign onto `main` (one person, once)
The redesigned `index.html`, `js/main.js`, `WORKFLOW.md` and `workflows/` are still uncommitted on one machine.
```bash
git add -A
git commit -m "Sponsor-focused redesign and team workflow docs"
git push origin main
```
Everyone else: `git clone https://github.com/Ahnaak/cfwebsite.git` (or `git pull`).

## 2. Both accounts
- [ ] Turn on 2FA on both GitHub accounts (Settings > Password and authentication).
- [ ] Git identity set: `git config user.name "..."` and `git config user.email "..."`.

## 3. Repo settings (Ahnaak, as owner)
- [ ] Settings > Branches > add rule for `main`: require a pull request, 1 approval, dismiss stale approvals, block force pushes.
- [ ] Settings > Code security: enable Dependabot alerts, secret scanning, push protection.
- [ ] Settings > Pages: Source = **GitHub Actions** (Arya's workflow deploys later).

## 4. Daily routine (both)
```bash
git checkout main && git pull
git checkout -b <your-name>/<topic>      # e.g. ahna/hero-content
# ...work, commit small...
git fetch origin && git rebase origin/main
git push -u origin <your-name>/<topic>
# open a PR on GitHub, request the other person as reviewer
```
Merge = **Squash and merge** after approval. Delete the branch after merging.

## 5. PR checklist (paste in every PR)
- [ ] Only touches files I own (see WORKFLOW.md)
- [ ] Checked at 360px and 1280px
- [ ] No secrets, keys or personal data added
- [ ] Placeholder/TODO items listed in the PR description if any remain

## 6. Sync points
- Tell each other when you merge. After any merge, the other person rebases.
- Weekly 20-minute call to review progress against the checklists.
- **Conflict hotspot:** `index.html`. Ahna edits the `<body>` sections; Arya edits only `<head>` and the form `action`. Keep those PRs small and merge them fast.
