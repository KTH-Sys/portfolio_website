# Kyaw Thi (Eric) Ha — Portfolio

A minimalist, light/monochrome editorial portfolio. Built from scratch with plain HTML, CSS
and JavaScript — no framework, no build step. Closely modeled on the
[eric-cole.framer.website](https://eric-cole.framer.website/) aesthetic.

## Design
- **Light / monochrome**: white bg, `#242424` ink, `#9e9e9e` muted, `#e0e0e0` gray blocks
- **Fonts**: Geist (sans) · Geist Mono (labels) · Inspiration (cursive script accent)
- **Motifs**: fragmented section titles, mono bracket labels (`[ … ]`), numbered works (001–005)

## Features
- 0–100% preloader, animated hero letter-grid, scroll reveals
- Dual-timezone clock — **Davis** + **Yangon** (a nod to the Burmese Students' Society)
- Work section with **List / Grid** toggle
- Custom blend cursor with "View / Say hi" states
- Contact form that composes a `mailto:` (no backend needed)
- Hide-on-scroll nav, mobile menu, respects `prefers-reduced-motion`

## Featured projects
SportsMom · Skaler · Barter · Davis House Price Prediction (MLSN) · pomibear!

## Structure
```
index.html        # markup + content
css/styles.css    # design system + layout
js/main.js        # interactions
```

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages
1. Push these files to a repo (e.g. `portfolio_website`).
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. Live at `https://<username>.github.io/<repo>/`.

## Editing
- **Content** lives in `index.html` — projects are `<li class="wk">` blocks inside `#works`.
- **Colors / fonts / spacing** are CSS variables at the top of `css/styles.css` (`:root`).
- The hero letter-grid phrase is the `phrase` string near the top of `js/main.js`.
- The contact form has no backend — it opens the visitor's mail client via `mailto:`.
  To collect submissions instead, point the `<form>` at a [Formspree](https://formspree.io) endpoint.

---
Email: ktiha@ucdavis.edu · GitHub: [@KTH-Sys](https://github.com/KTH-Sys) · LinkedIn: [kth10](https://www.linkedin.com/in/kth10)
