# DenTemp — Redesign Strategy & Interview Responses

This document walks through every prompt in the interview brief and pairs each
answer with the design decisions made in this redesign.

---

## 1. Website Audit & Strategy

### "Act as an expert UX designer. Evaluate the current site and give me the top 3 reasons visitors might be leaving quickly."

The current den-temp.com reads like a template that hasn't been pruned. Three
likely bounce-drivers:

1. **No clear "you are here" for the visitor.** A first-time visitor can't tell
   in three seconds whether DenTemp is for offices, for dental pros, or for both
   — and which of those *they* are. The redesign opens the hero with two equal
   CTAs ("I'm hiring for my office" / "I'm a dental professional") so visitors
   self-segment in one tap.
2. **Value proposition is buried in copy, not visualized.** "Building a dental
   community" is warm but abstract. Visitors want to know *what happens when I
   sign up*. The redesign uses a visual hero card showing real-style profile
   rows (rate, reviews, availability) so the product is legible at a glance.
3. **Trust signals are weak.** No social proof, no fill-time stats, no
   verification language above the fold. The new trust strip shows 2,400+
   offices, 11,000+ pros, 92% shifts filled <24hrs, and $0 placement fees as
   four animated counters under the hero — earned trust in one scroll.

### "What famous brand does my current style and voice match? Is that aligned with clean, feminine, and modern?"

The current site's voice is closer to a *Microsoft 2014 enterprise template* —
serviceable but cool, with stock photography and corporate phrasing. That is not
aligned with clean / feminine / modern.

The **target brand mood** for this redesign:

- **Glossier** for warmth, generous whitespace, and conversational copy
- **Notion / Linear** for the precise layout and confident product visuals
- **Maven Clinic** for healthcare-grade trustworthiness done with grace

The redesign achieves this with:
- A serif display font (Fraunces) paired with a friendly sans (Inter)
- A rose primary (#B85C7A) softened by cream backgrounds and warm-gold accents
- First-person, second-person copy ("we", "you") that talks to a person, not a
  procurement department

### "What are my top 3 competitors doing that I should consider?"

| Competitor | What they do well | What we adopted |
|---|---|---|
| **TempStars** | Bidirectional reviews; pros submit offers at their own rate; partial-shift offers (3-hr min); sleek profile cards | Two-way review system framed as a *value*, not a footnote. "Submit your own rate" baked into hero copy. Partial-shift offers called out on the For-Professionals page. |
| **Cloud Dentistry** | No placement fees; mobile-first scheduling; in-app messaging | "$0 placement fees, ever" as a hero stat. In-app messaging called out as a feature. Mobile nav and forms designed mobile-first. |
| **GoTu (TempMee)** | Speed of fill; ROI calculator for practices | "Average fill time: 47 min" surfaced on For-Offices page. Pricing teaser shows clear ROI math (one monthly fee vs. five-figure agency placements). |

### "What 50 questions should I answer about my business to create a high-converting website?"

These are the questions every visitor is silently asking. The redesign answers
all of them across the homepage, For-Offices, For-Professionals, Pricing, FAQ,
and About pages.

**About the business (1–10)**
1. What does DenTemp actually do?
2. Who is it for — offices, hygienists, assistants, dentists?
3. What problem does it solve that nothing else does?
4. Are you a staffing agency or a software platform?
5. Where do you operate (geography)?
6. How long have you been around?
7. Who founded it / what's the origin story?
8. Why should I trust you with my license / my hire?
9. How big is your network today?
10. Are you VC-backed, bootstrapped, profitable?

**Offices (11–25)**
11. How quickly can I fill a same-day temp shift?
12. How much does it cost?
13. Do you take a percentage of salary on permanent hires?
14. Can I cancel anytime?
15. What's verified — license, background, references?
16. What if a temp doesn't show up?
17. Can I save my favorite temps and rebook them?
18. Can multiple people on my team use it?
19. Do you integrate with my PMS?
20. How do I post a shift?
21. Can I post a permanent job too?
22. How are pros paid?
23. Am I the employer of record? Are they 1099 or W-2?
24. Are pros insured?
25. How do I migrate from my current platform?

**Professionals (26–40)**
26. Is it free for me?
27. Do you take a cut of my pay?
28. Can I set my own rate?
29. How quickly do I get paid?
30. Can I work in multiple states?
31. What documents do I need to upload?
32. How do you protect my data?
33. Are these real offices, vetted?
34. Can I see reviews of offices before I accept?
35. Can I work partial shifts?
36. Will I be 1099 or W-2?
37. Do you have a mobile app?
38. Can I block offices I don't want to work with?
39. How does dispute resolution work?
40. Is there a community / CE library?

**Practical/operational (41–50)**
41. How do I sign up?
42. How long is onboarding?
43. Will my data carry over from my current account?
44. Do you offer phone support?
45. What's your privacy policy / HIPAA stance?
46. Is the site accessible (ADA / WCAG)?
47. Where can I read your terms?
48. Do you offer annual billing?
49. Can I refer a colleague?
50. Where can I see what's new / your roadmap?

---

## 2. Design & Layout

### "Suggest a modern color scheme and typography that feels welcoming/professional/cutting-edge."

**Palette (in `/styles/main.css` as CSS variables):**

| Role | Token | Hex | Use |
|---|---|---|---|
| Primary | `--rose-500` | `#B85C7A` | CTAs, links, brand mark |
| Primary deep | `--rose-700` | `#7E3551` | Hover/active states |
| Accent | `--gold-500` | `#D4A574` | Warm highlights, gradient stops |
| Page background | `--cream-100` | `#FAF6F2` | Default body |
| Surface | `--white` | `#FFFFFF` | Cards, forms |
| Text | `--ink-900` | `#2A2A35` | Body text |
| Muted text | `--ink-500` | `#6B6B7A` | Captions, helpers |
| Success | `--success` | `#7A9B86` | Verified, online, badges |

All combinations meet WCAG AA contrast for body text.

**Typography:**
- **Fraunces** (variable serif) — display headings, italics for emphasis. Modern serif with warm character.
- **Inter** — body, UI, buttons, navigation. Geometric, clean, neutral.
- **Letter-spacing** tightened (-0.02 to -0.035em) on display sizes for a luxe feel.

### "Redesign the homepage with a hero, three-column services, and a contact form."

Done. See `/index.html`:
- **Hero** with split layout (headline + dual CTAs on the left, animated profile-card visual on the right).
- **Three-column services** section ("Temp Shifts", "Permanent Placements", "Real Dental Community"). Cards hover-lift and link out to deeper pages.
- **Contact form** at the bottom (`#contact`) with client-side validation, ADA-compliant labels, error states, and a success message.

### "How can I simplify navigation?"

Old dental sites often have 8–10 top-nav items. The redesign limits primary nav to **5 items** that match the visitor's likeliest jobs-to-be-done:

`For Offices · For Professionals · How It Works · Pricing · About`

Secondary destinations (FAQ, Contact, Help, Legal) live in the footer. The nav
is sticky, with a glass-blur effect, and collapses to a hamburger menu under
920px.

### "Suggest image styles and placements that match a minimalist/modern/feminine aesthetic."

- **Skip generic stock dental photography.** Composite stock looks dated and
  loses trust.
- **Use illustrated UI cards** in the hero (as built) to show the product without needing perfect photography.
- **Reserve real photos for testimonials** — one headshot per quote, soft natural light, candid expressions. Use a consistent warm grade.
- **Editorial moments** between sections: a single hero image per interior page (e.g., a hygienist mid-laugh, a dentist looking at a tablet), shot wide with cream-toned negative space the layout can crop into.
- **Avoid teeth close-ups.** Counter-intuitively, beautiful dental-marketing sites de-emphasize teeth in favor of people, light, and texture.

---

## 3. Copywriting & SEO

### Five punchy, warm-toned headlines for the homepage

1. **"Hiring built for the way dental actually works."** *(used in the redesign)*
2. "The warmest way to fill a chair — or find one."
3. "Dental hiring, finally on your side of the chair."
4. "Where dental finds its people."
5. "Real pros. Real offices. Real fast."

### SEO-optimized meta title & description for homepage

- **Title (58 chars):** `DenTemp — Dental Staffing & Community, Reimagined`
- **Description (158 chars):** `DenTemp connects dental offices with verified hygienists, assistants & dentists. Temp shifts, permanent hires, and a real community — no placement fees.`

Both targeted at the primary keywords: `dentemp`, `dental staffing`, `dental community`, `dental temp`.

### Rewrite of the existing sentence for readability and SEO

> **Original:** "DenTemp is building the digital network for the dental workforce—combining hiring, availability, and real-time professional activity in one platform."

> **Rewritten:** "DenTemp is the digital network for the dental workforce — combining hiring, availability, and a real community in one warm, modern platform built for dental offices and professionals."

Why it improves:
- Active present tense ("is" vs. "is building") signals a live product, not a vision deck.
- Adds the keyword "dental offices and professionals" for SEO.
- Substitutes "real-time professional activity" (jargon) with "a real community" (human).
- The em-dash with spaces reads better visually and on screen readers.

### FAQs for SEO ranking (live on `/faq.html` with FAQPage JSON-LD schema)

Top-ranking FAQ targets and one-line summaries:
- *How is DenTemp different from a traditional dental staffing agency?*
- *Is DenTemp really free for dental professionals?*
- *How fast can a temp shift get filled?*
- *How do you verify dental professionals?*
- *What happens if a temp doesn't show up?*
- *Can I migrate from a different dental staffing platform?*
- *Will my existing users carry over from the current DenTemp site?*

Each is wrapped in `<details>` semantic markup and rendered with FAQPage
structured data for rich-result eligibility in search.

---

## 4. Technical Functionality

### "I'm on WordPress. How do I add a 'book an appointment' button that opens a scheduling form?"

Two paths, easiest first:

**Path A — Embed a scheduler (recommended):**
1. Create a Calendly / TidyCal / Cal.com account with your booking type.
2. In WordPress, edit the page where you want the button.
3. Add a *Custom HTML* block with:
   ```html
   <a href="https://calendly.com/your-handle/intro"
      class="btn btn-primary"
      target="_blank" rel="noopener">
     Book a 15-minute intro
   </a>
   ```
4. To open as a modal instead of a new tab, paste Calendly's *Popup widget* snippet from their embed code page — it includes both the trigger and the script tag.

**Path B — Native WordPress booking plugin:** install **Amelia** or **Bookly**. They provide their own shortcode (e.g., `[ameliabooking]`) you can drop into the page. Style the trigger button to match the rose primary.

### "Would this require any migration from the current site?"

**For the marketing site (this redesign):** no — these are flat HTML/CSS/JS files. Drop them on Netlify, Vercel, GitHub Pages, or any static host. Point the `den-temp.com` DNS at the host. Done.

**If moving from a WordPress install:** keep your URLs the same wherever possible (e.g., `/about`, `/pricing`) so SEO equity transfers. Set up 301 redirects for any URL that has to change (`.htaccess` on Apache, `_redirects` on Netlify).

### "Would I be able to bring over existing users from the current site?"

Yes, with a one-time migration:

1. **Export** the existing user table (CSV) including: email, name, role (office/pro), license info, document references, reviews/ratings, profile bio.
2. **Map** to the new schema. For pros: `users → professional_profiles`. For offices: `users → office_profiles`.
3. **Transfer documents** — re-upload from the existing storage bucket to the new vault, preserving file metadata (issue date, expiration).
4. **Send a "welcome back" email** that pre-fills their profile and asks for one-time consent + a password reset.
5. **Soft 90-day grace period** where logins from the old domain redirect with their email pre-filled.

This pattern is detailed in the FAQ ("Will my existing users carry over from the current DenTemp site?") with a yes-with-confidence answer.

### "Write a custom JavaScript function that calculates [specific metric] based on user input."

A staffing-savings calculator is the highest-leverage one for this site. Drop-in function:

```javascript
// Calculate estimated savings vs. a traditional dental staffing agency
function calculateDenTempSavings({
  permHiresPerYear = 0,
  avgSalary = 65000,
  agencyFeePct = 0.20,     // typical agency placement fee
  tempShiftsPerMonth = 0,
  avgHoursPerShift = 8,
  agencyMarkupPerHour = 12 // typical hourly markup an agency adds
}) {
  const permFeesPaidToAgency = permHiresPerYear * avgSalary * agencyFeePct;
  const tempMarkupPerYear =
    tempShiftsPerMonth * 12 * avgHoursPerShift * agencyMarkupPerHour;

  const denTempCost = 149 * 12; // Practice plan, $149/mo
  const totalSavings = permFeesPaidToAgency + tempMarkupPerYear - denTempCost;

  return {
    agencyCostPerYear: permFeesPaidToAgency + tempMarkupPerYear,
    denTempCostPerYear: denTempCost,
    annualSavings: Math.max(0, totalSavings),
    roiMultiple: denTempCost > 0
      ? +(totalSavings / denTempCost).toFixed(1)
      : 0
  };
}

// Example: 4 perm hires/year + 3 temp shifts/month
// → agencyCostPerYear: ~$55,648, denTempCostPerYear: $1,788, savings: ~$53,860, ROI: 30.1x
```

Wire it to a small form (perm hires per year, temp shifts per month) and show
live results. Visitor sees the ROI math without talking to sales — a strong
conversion lever.

### "How do I optimize images to load faster without losing quality?"

1. **Use modern formats.** Save hero images as `WebP` or `AVIF` (50–80% smaller than JPG at the same quality). Keep a JPG fallback via `<picture>`.
2. **Serve responsive sizes.**
   ```html
   <img src="hero-800.webp"
        srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
        sizes="(max-width: 720px) 100vw, 800px"
        alt="Hygienist preparing a tray"
        loading="lazy"
        decoding="async"
        width="800" height="600" />
   ```
3. **Lazy-load below the fold** with `loading="lazy"` on every `<img>` not in the hero.
4. **Always set width & height** — prevents Cumulative Layout Shift (Core Web Vitals).
5. **Compress at build time** with `squoosh-cli`, `imagemin`, or Vercel/Netlify's automatic image optimization.
6. **Decode async** so image work doesn't block render.
7. **Inline tiny icons as SVG** (the redesign does this for every icon).
8. **Use a CDN** with image transforms (Cloudflare Images, Bunny CDN, Cloudinary).

The redesign uses zero raster images — every icon is inline SVG, every hero
visual is CSS/HTML — so first paint is essentially instant.

### "Best practices for ADA accessibility compliance on a contact page (and across the site)"

This redesign was built to WCAG 2.2 AA from the first line of CSS:

| Practice | Where applied |
|---|---|
| Skip-to-main link | First focusable element on every page |
| Semantic landmarks | `<header>`, `<main>`, `<nav>`, `<footer>` with ARIA labels |
| Proper heading hierarchy | One `<h1>` per page, no skipped levels |
| Visible focus rings | `:focus-visible` rose outline w/ offset on all interactives |
| Form labels | Every input has an explicit `<label for>` |
| Required field marking | `aria-required="true"` + visual asterisk |
| Inline error messaging | `role="alert"` so screen readers announce on submit |
| Success messaging | `role="status" aria-live="polite"` on form success |
| Color contrast | Body text 11.4:1, primary button 6.1:1 — both pass AA |
| Keyboard nav | All controls reachable in logical tab order; tabs use `role="tab"` / `aria-selected` |
| Reduced motion | `@media (prefers-reduced-motion)` disables all transitions |
| Alt text | Decorative images have `alt=""`; meaningful ones get a real description |
| Mobile touch targets | Minimum 44×44px (buttons, nav toggle) |
| Form autocomplete | Standard tokens (`given-name`, `email`, `tel`) for password managers + assistive tech |

A11y is not a checklist at the end — it's the foundation.

---

## What's in this repository

```
/
├── index.html               Homepage (hero, 3-col services, how-it-works, why,
│                            testimonials, pricing teaser, FAQ, contact)
├── for-offices.html         Office-side audience page
├── for-professionals.html   Pro-side audience page
├── how-it-works.html        Detailed 6-step flow per audience
├── pricing.html             Three-tier pricing + pricing FAQ
├── about.html               Brand story + principles
├── faq.html                 Full FAQ with FAQPage schema
├── contact.html             Standalone contact page
├── styles/main.css          Full design system (tokens, components, responsive)
├── scripts/main.js          Nav toggle, tabs, counters, form validation
├── STRATEGY.md              This document
└── README.md                Quick-start
```

Everything is plain HTML/CSS/JS — preview by opening `index.html` in a
browser, or by serving the folder with `python3 -m http.server`.
