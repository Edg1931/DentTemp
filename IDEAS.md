# DenTemp — Outside-the-Box Ideas

A working list of differentiators that would make DenTemp obviously better
than the rest of the dental staffing landscape. Organized by audience.

The three marked **★ Built in** are already wired into the redesign's
"Post a Shift" modal so you can see them in motion.

---

## For Offices

### ★ Built in — Show-Up Bonus
Attach a small premium ($25 / $50 / $100) to a shift to incentivize fast fills.
The bonus appears as a bright badge on the shift card and in the community feed.

- **Why it works.** Same-day staffing is a panic moment. A $25 bonus on a $58/hr
  shift costs you $25 and saves you a four-hour scramble.
- **Behavioral evidence.** Doordash "peak pay" and Uber "boost" follow the same
  pattern — small surge premiums dramatically increase fill rates.
- **Where it lives.** Already visible: dashboard table row, jobs board card,
  community feed card all surface the bonus.

### ★ Built in — Sub-on-Call Roster
Pros you've worked with and saved can be the *only* people notified for a given
shift. One-tap dispatch like Uber's favorite drivers.

- **Why it works.** The hardest temp callouts are the ones where you don't know
  who's walking in. With Sub-on-Call you're rebooking a known quantity in 60s.
- **Where it lives.** "Sub-on-Call only" toggle in the post-shift modal. When
  enabled, the shift doesn't broadcast publicly — it goes to your private list.

### ★ Built in — Office Vibes Tags
Peer-generated tags ("calm pace", "patient-first", "great front desk") that pros
use to self-select. Tags surface on the shift card and on the office profile.

- **Why it works.** Self-selection is free quality control. Pros who *want* a
  fast-paced production office go to those; pros who want a calm 60-minute
  hygiene practice go elsewhere. Both sides get better matches.

### Voice-to-Shift Posting
Office manager taps a mic icon and says: "Hygienist tomorrow 8 to 5, $60,
X-ray cert." AI drafts the post; admin confirms and ships.

- **Why it works.** Office managers are the busiest humans in dental. Voice
  posting takes shift creation from 90 seconds to 10.
- **Build cost.** Low. OpenAI Whisper API + a structured-output prompt. Easy
  add-on once you have the schema.

### Compliance Vault → Board Audit Report
Auto-generated quarterly PDF listing every temp who worked at your office, with
license number, expiration, certs verified at time of shift. One-click download.

- **Why it works.** State board audits are the silent terror of every office
  manager. Most offices keep this in a Google Drive folder, badly. Making the
  report a single button turns dread into delight.
- **Stickiness.** Once they trust DenTemp for audit compliance, they don't
  leave.

### Predictive Coverage Map
ML on your past 6 months of staffing predicts which weeks/days you'll most
likely need temp coverage and pre-drafts shifts you can ship with one tap.

- **Why it works.** Hygienist out for surgery in March? Most offices realize
  the staffing gap in late February. We'd surface it in January.

### Patient Prep SMS
When a temp is confirmed, the patient gets a short, friendly SMS: "Hi Sarah!
Maya is filling in for your regular hygienist today — she's been an RDH for
8 years. Looking forward to seeing you at 2pm."

- **Why it works.** Patient anxiety about "a stranger" is real. A 30-word
  intro converts that anxiety into curiosity. Offices that opt in see higher
  show-up rates and better Yelp reviews.

### Group Bookings
"Saturday clinic day" — book 3 RDHs and 2 DAs for one event with a single
form. Coordinates them in a shared chat thread.

- **Why it works.** Mobile clinics, community events, and DSO "blitz" days are
  growing. Nobody serves them well today.

---

## For Professionals

### Smart Rate Coach
"RDHs with your reviews and experience in Austin charge $62–$68/hr. You're
defaulting at $58. Bump to $62 and you'd still be in the top 30% of accepted
offers."

- **Why it works.** Most pros are leaving money on the table because they
  don't have the comp data. We do.
- **Network effect.** As more shifts run through DenTemp, the rate coach gets
  sharper. Pros are paid more → they stick around → more data → better coach.

### Skill-Gap Radar
Shows which 1-2 certifications would unlock the most shifts in your zip code.
"Nitrous certification would unlock 38% more shifts in Austin. Average
DenTemp pro earns back the cert cost in 1.4 weeks."

- **Why it works.** Career development you can act on Monday morning. We become
  the place pros come *not* just for shifts but for growth.

### Burnout Guard
Tracks consecutive workdays. After day 5, the app gently suggests time off — or
nudges your default rate up for day 6+.

- **Why it works.** Burnout = no-shows = lost trust = the whole platform suffers.
  This is a long-term retention move dressed up as self-care.

### Tax Kit
Automatic 1099s, GPS-based mileage tracking that runs only on shift days,
deduction recommendations, and an export to TurboTax / Stride.

- **Why it works.** "What do I do at tax time" is the #1 reason pros quit temp
  work. We make the worst week of the year easy.

### Peer Prep
Before you accept a shift at a new office, you can spin up a 5-minute video
chat with another pro who has worked there. Anonymous if you want.

- **Why it works.** Reviews tell you *what* an office was like. Peer prep tells
  you *how to thrive there*. ("They like a 4-minute prophy, and Doctor likes
  to be called 'Doc Mike' not 'Dr. Hutchins.'")

### Travel Mode
Going to Nashville for a wedding? Flip on travel mode for the week. We pre-
verify your out-of-state license and surface shifts at the destination.

- **Why it works.** Unlocks a whole new market — pros who already travel can
  monetize that trip. And from the office side, the available pool for any
  given week grows organically.

### Health Insurance Pool
A real benefits angle for 1099 dental pros: a group health plan you can buy
into. Better rates than the individual market because we're aggregating risk
across thousands of pros.

- **Why it works.** Health insurance is the single thing 1099 pros bring up
  unprompted. We don't have to be the underwriter — we partner with one. We
  just need the volume.

### Earnings Quest
"You're $480 from your November target. Here are 3 shifts in your radius that
would close the gap. Tap to send offers to all three."

- **Why it works.** Self-employment without goals is anxious. With goals, it's
  agency. Light gamification beats the agency loop forever.

---

## Community & network effects

### Adopt a New Grad
Offices can sponsor a new-grad hygienist's first 5 shifts — covering their
cert renewal, BLS, or scrubs — in exchange for first right of refusal on a
permanent role.

- **Why it works.** Solves a real pipeline problem (new grads can't land that
  first job) with real money. It also makes a great press story and ESG line
  item for DSOs.

### Open Salary Data
Anonymous, aggregate, quarterly: "Median RDH temp rate in Austin TX, Q3:
$58/hr (±$6). Hourly rate has risen 4% YoY." Public. Free to read.

- **Why it works.** Transparency creates trust. The platform that's first and
  loudest with real data becomes the *brand* of dental compensation.

### Office Hours
A weekly live AMA where a top-rated office and a top-rated pro answer
questions from newbies. Builds community, surfaces best practices, gives
both sides a stage.

### Shadow Day
For permanent hires, a paid trial day so both sides can test fit before
signing on. Pre-built workflow in the platform.

### CE Library tied to shifts
Earn small amounts of state-board CE credit by completing shifts and
post-shift reflections. Requires state-board partnerships, but the ROI for
both sides is huge.

---

## How to pick what to build next

If we were prioritizing **shipping order** purely by impact ÷ effort:

| Idea | Impact | Effort | Build now? |
|---|---|---|---|
| Show-up bonus | High | Low | ★ Done |
| Sub-on-Call roster | High | Low-Med | ★ Done |
| Office Vibes tags | Medium | Low | ★ Done |
| Voice-to-Shift posting | High | Medium | Yes |
| Compliance audit PDF | High | Medium | Yes |
| Patient Prep SMS | Medium | Low | Yes (just needs Twilio) |
| Smart Rate Coach | Very High | Medium | Yes (needs data) |
| Skill-Gap Radar | High | Medium | Yes (needs data) |
| Burnout Guard | Medium | Low | Yes |
| Tax Kit | High | High | Later (partner with Stride / 1099) |
| Travel Mode | Medium | Medium | Later |
| Health Insurance Pool | Very High | Very High | Q3 roadmap |
| Open Salary Data | High | Medium | Q2 once we have volume |
| Adopt a New Grad | Medium | Low | Q2 — PR moment |
| Peer Prep | Medium | Medium | Later |

The three already built (★) are deliberately the *visible* differentiators — when
a hiring manager opens the post-shift modal, the show-up bonus and Sub-on-Call
roster are right there. Those are the screenshots that go into the sales deck.
