# Security policy

This is the website of U&I x Maho, a volunteer-run centre supporting boys in residential care in Bengaluru.
We take the safety of our donors, volunteers and the children we work with seriously. Thank you for helping.

## Reporting a problem

**Please report privately. Do not open a public issue.**

- **Security bugs** (for example a way to inject code, steal data, or misuse the contact form):
  use GitHub's private reporting. Go to the **Security** tab of this repository → **Report a vulnerability**.
- **Child-safety concerns** (for example a photo where a child can be identified, or personal details of a child):
  report the same way, or contact the NGO directly. We will take the content down first and investigate after.

Please include what you found, where (page or file), and how to reproduce it. Screenshots help.

## What to expect

- We are a small volunteer team. We aim to acknowledge reports within **3 days** and to fix serious issues as fast as we can.
- We will tell you when it is fixed and, if you like, credit you.
- We don't offer paid bug bounties.

## Please don't

- Access, change or delete data that isn't yours, or contact people whose data you find.
- Run automated scans that flood the site or the contact form, or test spam against the form.
- Attempt real payments or use real payment details for testing.

Testing in good faith within these rules is welcome, and we won't take action against you for it.

## How the site is built (useful context)

- A static website, published from this repository to GitHub Pages. There is no database and no login.
- **Card and bank details are never entered on this site.** Donations are handled on the payment provider's own hosted pages.
- Contact-form messages go to our form provider (Formspree), which emails them to the team.
- Every pull request is checked automatically (build, dependency audit, link safety and secret scanning), and dependencies are kept up to date by Dependabot.
