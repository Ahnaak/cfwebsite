# U&I x Maho website

Sponsor/donation website for U&I x Maho. Static site styled with Tailwind CSS. Team plan: [WORKFLOW.md](WORKFLOW.md).

## First-time setup
1. Install [Node.js](https://nodejs.org) version 20 or newer (the "LTS" download).
2. In this folder run:
   ```
   npm install
   ```

## Everyday commands
| Command | What it does |
|---|---|
| `npm run dev` | Starts the site at http://localhost:8000 and rebuilds the styles every time you save. Use this while working. Stop it with Ctrl+C. |
| `npm run build` | Makes the final website in the `dist/` folder. This is what gets published. |
| `npm run preview` | Builds, then serves `dist/` at http://localhost:8000/cfwebsite/, the same address shape as GitHub Pages. Use it to check nothing breaks before a PR. |
| `npm run check` | After a build, checks for broken file links, paths that would break on GitHub Pages, files loaded from other websites, and insecure links. The same check runs automatically on every PR. |

## How publishing works
- Every pull request is built and checked automatically (`.github/workflows/pr-check.yml`). A red cross on the PR means something is broken: open the "Details" link to see what.
- Every merge into `main` publishes the site to GitHub Pages automatically (`.github/workflows/deploy.yml`). Nothing needs uploading by hand.
- One-time setup by the repo owner: **Settings > Pages > Source = GitHub Actions**.

## Where things live
| Path | What | Owner |
|---|---|---|
| `index.html` `<body>` | Page content and layout | Ahna |
| `src/components.css` | Shared building blocks (`.btn`, `.card`, `.section`...) | Ahna |
| `images/` | Photos and logo | Ahna |
| `index.html` `<head>`, `js/` | Security tags, form and payment code | Arya |
| `tailwind.config.js` | Colours and font (the design system) | Arya, changes agreed with Ahna |
| `src/input.css`, `src/fonts.css`, `fonts/`, `scripts/`, `package.json` | Build setup and self-hosted font | Arya |
| `.github/workflows/` | Automatic checks and publishing | Arya |

Notes:
- `css/styles.css` and `dist/` are generated. Don't edit them, and don't commit them (git ignores them).
- Use only **relative paths** (`images/hero.jpg`, not `/images/hero.jpg`) so the site works on GitHub Pages and on a custom domain.
- Don't add scripts, fonts or embeds from other websites. Everything is self-hosted for security.

## Add pictures
Put files in `images/` with these names, or change the `src` in `index.html`:
`logo.png` (optional), `hero.webp`, `session-2.webp`, `session-3.webp` (about 1000px wide, under 200 KB each, so the page loads fast)

## Before publishing
- Stats, sponsor amounts and stories are placeholders. Replace them with confirmed facts.
- Testimonial cards are placeholders. Use real quotes with permission, and get the shelter's consent for anything from a child.
- Only use photos of boys with consent from the shelter. Keep every child's face covered or cropped out.
- The question form does not send data anywhere yet. Sponsor buttons link to the form until payment links are added.
