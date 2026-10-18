# Darcy Van Pelt — portfolio

Single-page portfolio. Plain HTML, CSS, and JavaScript. No framework, no build step.

```
index.html      all content lives here (edit text, projects, links directly)
sigspatial/     the QR-code landing page for the SIGSPATIAL 2026 poster and talk (links out to this site and elsewhere)
robots.txt      allows crawling so the noindex tag on index.html is seen
styles.css      theme + layout; change --primary at the top to recolor the whole site
script.js       nav highlighting, mobile menu, typewriter, skills tabs, contact form
assets/
  projects/     project card screenshots
  og-image.jpg  link-preview card
  closure-diff.webp  Research section figure
  favicon.svg
```

## Preview locally

```
python -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly from disk also works.)

## Two pages, one deploy

- `/` is the full portfolio for internships, scholarships and applications. It carries `<meta name="robots" content="noindex">`,
  so search engines drop it from results. Anyone with the link can still open it, and anyone can pass the link on.
  A noindex tag is not a password; if the address must stay private from a particular reader, do not give it to anyone who might share it.
- `/sigspatial/` is the landing page for the poster QR code. It links to the portfolio, LinkedIn, code, chapter and ORCID.
  It is also noindex: the QR code and the typed address work, but a search for the name does not surface either page.

## Hosting choice

GitHub Pages (below) needs a PUBLIC repo on a free account, and a public repo is itself searchable on GitHub and Google,
even with noindex on the page. If keeping the source out of search matters, deploy from a PRIVATE repo instead:
Vercel, Netlify and Cloudflare Pages all do this free for a personal site and give an address like `darcyvanpelt.vercel.app`.
The files need no changes either way.

## Where it lives (as of Oct 18 2026)

Live at https://darcyvanpelt.pages.dev/ on Cloudflare Pages, deployed by direct upload from this folder (not Git-connected).
Source is the PRIVATE repo github.com/darcy0408/portfolio. To publish a change: commit, push, then

```
npx wrangler@4 pages deploy . --project-name darcyvanpelt --branch main
```

The older GitHub Pages instructions below are kept for reference.

## Deploy to GitHub Pages (free, ~2 minutes)

1. Create a public repo named `darcy0408.github.io` on GitHub.
2. In this folder:
   ```
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/darcy0408/darcy0408.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. Site is live at <https://darcy0408.github.io> within a minute or two.

Custom domain (optional): buy a domain, add it under **Settings → Pages → Custom domain**, and point the
domain's DNS at GitHub Pages per their docs. GitHub will create a `CNAME` file in the repo for you.

## Editing

- **Colors:** `--primary` (purple) and `--secondary` (blue) at the top of `styles.css`. Buttons, glows, pills, and the gradients all derive from them. The pixel cats use `--cat-body`, `--cat-eye`, and `--cat-nose`.
- **Cats:** any element with a `data-cat` attribute gets the pixel cat drawn into it by `script.js`.
- **Projects:** each card is an `<article class="project-card">` in `index.html`. Copy one, edit the title, blurb, pills, and the two links.
  To show a screenshot instead of the two stats, put an `<img>` inside `.project-card-image`.
- **Portrait:** `assets/darcy-avatar.webp` (with a `.jpg` fallback). Replace both files to change the hero image.
- **Contact form:** by default it opens the visitor's mail app. To have messages land in your inbox instead:
  1. Sign up free at <https://formspree.io> and create a form (it gives you a URL like `https://formspree.io/f/abcdwxyz`).
  2. Paste that URL into `data-endpoint=""` on the `<form id="contact-form">` tag in `index.html`.
  3. Submit one test message from the live site and confirm the email Formspree sends you.
- **Link preview:** `assets/og-image.jpg` is what LinkedIn, Slack, and email show when you paste the link.
  The `og:` and `twitter:` tags in `<head>` use absolute `https://darcy0408.github.io/` URLs; update them if the address changes.
- **Research numbers:** the 61–76% and 12/12 figures follow `portland-traffic-abm/RESULTS_LEDGER.md` (C6, SP2, SP3).
  Check the ledger before changing the wording. 61–76% is the drop on the *closed* street, not what moves to detours.
- **When the proceedings publish:** replace "Forthcoming" on the chapter with the real link, and add the SIGSPATIAL DOI once it resolves.
- **Resume:** removed from this copy (the one-page resume carries output counts and an availability line). To add it back, drop a plain-facts `assets/resume.pdf` in place and restore the Resume button and modal from `C:\dev\portfolio\index.html`.
