# DenTemp — Redesign

A redesign concept for [den-temp.com](https://www.den-temp.com) — a dental
staffing marketplace connecting offices with hygienists, assistants, and
dentists.

**Aesthetic:** clean, feminine, modern, warm. Rose primary, cream backgrounds,
charcoal text, warm-gold accents. Serif display (Fraunces) + clean sans (Inter).

## Preview locally

No build step. Pick one:

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

Then open <http://localhost:8000>.

## Deploy

It's static HTML/CSS/JS — drop into any host:

- **Netlify / Vercel:** drag the folder onto the dashboard.
- **GitHub Pages:** push to a repo, enable Pages on the branch.
- **Custom hosting / WordPress shared host:** upload via FTP, point the
  domain.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, 3-col services, how-it-works, why, testimonials, pricing teaser, FAQ, contact form |
| `for-offices.html` | Office-side conversion page |
| `for-professionals.html` | Hygienist / assistant / dentist conversion page |
| `how-it-works.html` | 6-step flow with tabs by audience |
| `pricing.html` | 3 plans + pricing FAQ |
| `about.html` | Brand story + principles |
| `faq.html` | Full FAQ with FAQPage structured data |
| `contact.html` | Standalone contact form |

## Strategy doc

[`STRATEGY.md`](./STRATEGY.md) — answers every prompt in the interview
brief: audit, competitors, the 50 business questions, design + typography +
color rationale, copywriting & SEO, technical functionality (WordPress
booking buttons, migration, user import, the savings calculator, image
optimization, ADA compliance).
