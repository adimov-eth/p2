Below is a crisp **consistency audit** of the HTML you shared, followed by a **low‑overhead migration plan** (no Next.js) that lets you keep your existing Tailwind-powered markup, but centralize all facts (price, rounds, emails, policy text) in one place so they stay in sync across every page.

---

## 1) Consistency audit (what’s inconsistent, where, and how to fix)

**Your final product brief (target):**
**Prime** @ **primethailand.golf**. One plan only: **THB 700,000 / year**, **2 seats**, **150 rounds / year**. Thai corporate C‑level audience.

Below I call out any place the files disagree with that spec or with each other, and what to change.

### Price & plans

* **Multiple tiered prices appear (not single plan)**: “Founders’ Circle 750k / Early Adopter 850k / Standard 950k” in *Pricing & Incentives* and the *Sales Presentation*. Update or remove these sections to reflect the single 700k plan.  
* **Different “Standard” price in “Pricing & Terms”**: shows **฿949,000** and a 12‑month term. Replace with **฿700,000** and keep the 12‑month term if that remains correct. (This appears in two near‑identical “Pricing & Terms” files.)  

### Rounds / usage

* **Rounds are 144 in most places** (At‑a‑Glance cards, Terms, SOP/UAT, Agreement). Change **144 → 150** across:
  – Thai “Booklet” V4 / V3 At‑a‑Glance (“144 รอบการเล่นต่อปี”).  
  – Both “Pricing & Terms” pages (“144 rounds of golf annually”).  
  – UAT dashboard test cases (“X / 144 Rounds Used” and related tests). 
  – E‑Signature Agreement (Section 1.a “one hundred and forty‑four (144) rounds”). 
* **156 rounds shown for “Founders”** (12 bonus). Remove this promo or revise to match 150 total for the single plan. 

### Seats & guest policy

* **2 named users; guest math consistent**: Booklets show “2+6” (2 members, up to 6 guests with both present); “Pricing & Terms” aligns (3 guests per user; 6 if both present). Keep as‑is if this remains policy.   

### Cancellation, booking, inclusions

* **48‑hour cancellation**: Consistently stated in Terms, Booklets and Concierge Manual (and enforced as 1 round penalty). Keep as a single source value when templating.   
* **All‑inclusive components** (green fee, caddy, cart) appear in “Pricing & Terms” and broader messaging—preserve. 

### Domain, emails, brand naming

* **Domain & emails inconsistent**: many files use **[concierge@primegolf.co](mailto:concierge@primegolf.co)** (and **[privacy@primegolf.co](mailto:privacy@primegolf.co)** placeholder) rather than **@primethailand.golf**. Update footer text, CTAs, privacy contacts, and Concierge Manual channel addresses.     
* **“Founders’ Circle” references**: Launch plan and Sales deck center on this concept; retire or reframe as a one‑time event if you’re standardizing pricing.  

### Internal vs public artifacts

* **Internal documents have public‑looking UIs** (Concierge Manual “Internal Use Only”; UAT; Launch Checklist; Onboarding SOP). When migrating, publish these behind auth or to a private subdomain.    

> **Summary of critical edits to align with your single plan:**
> **Price → THB 700,000** (all pages), **Rounds → 150**, **Users → 2**, **Guest policy unchanged**, **48‑hour rule unchanged**, **emails/domains → @primethailand.golf**, remove “tiers/Founders” copy, and update internal docs to private hosting.

---

## 2) Low‑overhead migration plan (keep your HTML, centralize facts, avoid Next.js)

**Goal:** make the site editable by non‑engineers, ensure all facts (price/rounds/emails/terms) are single‑sourced, and ship fast with minimal tooling.

### Option A (recommended): **Eleventy (11ty) + Nunjucks templates + Tailwind CDN**

Why this fits:

* Zero runtime JS framework; keeps your existing HTML almost unchanged.
* Lets you create a **single JSON data file** for price/rounds/emails and reuse everywhere.
* Build once, deploy anywhere (Cloudflare Pages/Netlify).
* You can keep your current `<script src="https://cdn.tailwindcss.com"></script>` usage to avoid a CSS build pipeline initially.

**Proposed structure**

```
/site
  /.eleventy.js
  /_data/site.json          <- single source of truth (price, rounds, emails, domain, policy dates)
  /_includes/
    layout.njk              <- base <html> shell with head, fonts, Tailwind CDN
    header.njk, footer.njk  <- shared partials
    glance-cards.njk        <- (80+, {{site.membership.rounds}} etc.)
  /pages/
    index.njk               <- marketing landing (TH/EN variants if needed)
    pricing-terms.njk
    merchandise.njk
    sales-presentation.njk
    privacy.njk
  /internal/                <- gated on a different subdomain or Basic Auth
    concierge-manual.njk
    uat.njk
    onboarding-sop.njk
    launch-checklist.njk
  /legal/
    agreement.njk
  /assets/ (logo, favicons)
```

**`_data/site.json` (example)**

```json
{
  "brand": { "name": "Prime", "company": "Prime Corporate Golf Club" },
  "domain": "primethailand.golf",
  "contact": {
    "concierge_email": "concierge@primethailand.golf",
    "sales_email": "sales@primethailand.golf",
    "privacy_email": "privacy@primethailand.golf",
    "phone": "(02) 123-4567"
  },
  "membership": {
    "price_thb": 700000,
    "rounds_per_year": 150,
    "users": 2,
    "guest_per_user": 3,
    "guest_max_if_both_users": 6,
    "cancellation_hours": 48
  },
  "legal": { "privacy_last_updated": "October 20, 2025" }
}
```

**Converting a page** (illustrative edits only):

* *Pricing & Terms*: replace hard‑coded numbers/text with variables:

```html
<p><strong>฿{{ site.membership.price_thb | toLocaleString }}</strong> (VAT excluded). This is a fixed annual fee for a 12‑month term.</p>
<p><strong>{{ site.membership.rounds_per_year }} rounds</strong> annually. Includes green fee, caddy, and cart. One 18‑hole round per day, per player.</p>
<p>Each membership includes <strong>{{ site.membership.users }} primary users</strong>. Guest policy: up to {{ site.membership.guest_per_user }} guests per user (max {{ site.membership.guest_max_if_both_users }} when both present).</p>
<p>Cancellation: {{ site.membership.cancellation_hours }} hours notice, otherwise 1 round deducted.</p>
```

This single substitution updates **both** “Pricing & Terms” files to the 700k/150‑round spec in one change.  

* *Booklet At‑a‑Glance*: swap the “144” card for `{{ site.membership.rounds_per_year }}` and ensure all mentions of 144 become the variable.  

* *UAT Dashboard*: update test names/expected values from “144” to `{{ site.membership.rounds_per_year }}` (and scenario wording). 

* *Agreement*: replace “one hundred and forty‑four (144)” with a template that renders both the word and the number (or simplify to numerals) from the data file. 

* *Privacy Policy*: swap emails/domains and last‑updated date from `site.json`. 

* *Sales Presentation / Incentives*: remove the tiered cards and show a single “Investment” card bound to `site.membership.price_thb`.  

**Auth & separation of public vs internal**

* Publish **public** pages at `https://primethailand.golf/…`.
* Publish **internal** pages (Concierge Manual, UAT, SOP, Launch Checklist) at `https://ops.primethailand.golf/…` with Cloudflare Access or Netlify Basic Auth.    

**Build & deploy**

```bash
# one-time
npm init -y
npm i @11ty/eleventy

# package.json scripts
"scripts": { "build": "eleventy", "serve": "eleventy --serve" }

# local dev
npm run serve  # http://localhost:8080

# deploy
# - Netlify/Cloudflare Pages: point to `site/` with build command `npm run build` and output `_site/`
```

**Guardrails to keep facts consistent**
Add a tiny CI check that fails the build if stray hard‑coded values remain (e.g., “144”, “950,000”, “primegolf.co”):

```bash
# simple grep (add to CI before build)
! grep -R --exclude-dir=_site -E '(^|[^0-9])144([^0-9]|$)' .
! grep -R --exclude-dir=_site -E '950,?000' .
! grep -R --exclude-dir=_site 'primegolf\.co' .
```

### Option B: **Hugo** (Go‑based SSG)

* Also minimal overhead, very fast builds, native multilingual. Templates are Go HTML. Similar data‑file approach (`data/site.json`). Choose Hugo if your team prefers binaries/no Node toolchain.

### Option C: **Astro (content‑only)**

* Also light, but more features than you need. Use only if you want partial hydration for a few interactive widgets later. For your static marketing stack, Eleventy is simpler.

---

## 3) Page‑by‑page change list you can hand to someone

**High priority (must change to match 700k / 150 rounds):**

* **Pricing & Terms** (two copies): price **฿700,000**, rounds **150**, emails to `@primethailand.golf`.  
* **Booklet(s)** (V4/V3): At‑a‑Glance “144 → 150”, keep “2+6”. Update contact CTAs to `concierge@primethailand.golf`. Consider keeping only **V4** and archiving **V3**.  
* **UAT Dashboard**: update copy and expected results from “144” to “150”. 
* **E‑Signature Agreement**: “(144)” → “(150)”, update fee clause to “THB 700,000”, and contact details/domain. 
* **Sales Presentation** & **Pricing & Incentives**: remove tiered cards (750k/850k/950k) and “Founders” 156‑round copy; show single 700k plan.  
* **Privacy Policy**: replace placeholder contacts with `privacy@primethailand.golf` and correct postal/phone info; keep PDPA framing and last‑updated date current. 

**Medium priority (cleanups / polish):**

* **Concierge Manual**: update LINE OA ID/email/phone to final values; the 48‑hour policy remains correct. Keep “Internal Use Only". 
* **Welcome Package**: update email/phone text to new domain; content otherwise aligns. 
* **Launch Plan**: if you’re not doing a “Founders’ Circle” promo, retitle event (e.g., “Prime Invitational for C‑Suite”) and strip pricing mentions. 

---

## 4) What this solves & tradeoffs (evidence‑based)

**Problems solved**

* **Single source of truth** for price/rounds/emails ⇒ eliminates drift (we found 949k/950k/750k/850k and 144/156 variants in different files).    
* **Fast migration** because Eleventy lets you **paste your existing HTML** and wrap with small Nunjucks substitutions—no component rewrite, no hydration.
* **Clear public/private split** (e.g., Concierge Manual, UAT) to avoid exposing internal processes.  

**Tradeoffs**

* Keeping Tailwind via CDN is the simplest path; a later step could compile Tailwind for performance, but it’s optional initially.
* If you need headless CMS later (for team edits), Eleventy plays well with Netlify CMS/Decap or CloudCannon; not required on day one.

---

## 5) Actionable next steps

1. **Create repo & scaffold Eleventy** with `_data/site.json` using the values in your brief (700k / 150 / 2 / emails @primethailand.golf).
2. **Copy each HTML page** into `/pages/*.njk`, set `layout: layout.njk`, and replace hard‑coded numbers/emails with `{{ site.* }}` variables (start with Pricing & Terms, Booklet, UAT, Agreement, Sales/ Incentives).      
3. **Remove tiered pricing sections** and “Founders” bonuses; replace with a single “Investment” block bound to `site.membership.price_thb`.  
4. **Split internal pages** to an `ops.` subdomain with basic auth.  
5. **Add CI grep checks** to prevent regressions (“144”, “950,000”, “primegolf.co”).
6. **Point DNS** for **primethailand.golf** to your static host; deploy.

If you want, I can convert one representative page (e.g., **Pricing & Terms**) into an Eleventy template with the tokens shown above so your team sees exactly how fast the changes go.




Below is a **deep layout audit** of your HTML set and a **concrete Astro plan** to unify everything into a proper website—single source of truth for content, consistent layouts, shared components, and an opinionated styleguide. I’ll explicitly call out where the current files disagree and how we’ll reconcile that into one clean implementation.

---

## 1) What you already have (and what’s inconsistent)

**Clear strengths (keep):**

* A premium **dark brand system** (navy/gold/Kanit) repeated across most files—cards, section titles, timelines, dashboards. This appears in the Launch Plan, Concierge Manual, Onboarding SOP, UAT, Outreach, Launch Checklist, E‑Signature, and more.       
* Marketing pages (booklets and sales deck) already codify “At a Glance” (80+ courses / 144 rounds / 2+6 users+guests), benefit sections, carousel, and a strong hero pattern.   
* Operational detail is well documented: Concierge SLAs, booking/cancellation workflow, onboarding timeline, UAT coverage for digital features (NFC card, portal/usage tracking, digital invites).   

**Inconsistencies we must fix:**

* **Typography & layout systems:**
  Most pages use **Kanit + dark**; your **Pricing & Terms** pages switch to **Inter + light corporate layout** (duplicated files). We’ll keep both themes but drive them from the same tokens and layouts.  
* **Pricing / quota conflicts:**
  Pricing & Incentives + Sales Presentation show tiered pricing (750k/850k/950k) and 156 bonus rounds for founders; E‑Signature, Terms, and booklets show 144 rounds / multiple tiers; your new direction is **single plan: 700k THB, 2 seats, 150 rounds**—we’ll unify the whole site to the new plan and keep an “(previous content)” stash internally.    
* **Policy duplication:**
  Two near-identical **Pricing & Terms** pages (light Inter layout) must be canonicalized.  
* **Content structure drift:**
  Internal tools (Launch Plan / Launch Checklist / Outreach / UAT) live as stand-alone pages with bespoke layout micro‑patterns (progress bars, timelines, table styling); we’ll move them onto a **unified Dashboard layout** with shared components.    
* **Legal copy divergence:**
  E‑Signature Agreement, Terms, and Privacy are not aligned with the new “single plan” + updated quantities. We’ll update legal sections and keep audit trail of prior drafts. (Privacy has a firm PDPA frame and date: Oct 20, 2025.)   

---

## 2) Target information architecture (Astro)

```
src/
├─ layouts/
│  ├─ BaseLayout.astro            # HTML head, SEO, base shell
│  ├─ ThemeDark.astro             # Premium site shell (nav/footer)
│  ├─ ThemeLight.astro            # Corporate/legal shell
│  └─ Dashboard.astro             # Internal tools shell (sidebar)
│
├─ components/
│  ├─ nav/SiteNav.astro           # Shared primary nav
│  ├─ nav/DashboardNav.astro      # Internal sidebar (UAT, Outreach, etc.)
│  ├─ ui/SectionTitle.astro       # Gold underline section header
│  ├─ ui/Card.astro               # Card shell (variants)
│  ├─ ui/Button.astro             # CTA, Secondary
│  ├─ ui/Accordion.astro          # Terms accordions (from Pricing & Terms)
│  ├─ ui/Timeline.astro           # Timeline (Launch Plan, Onboarding)
│  ├─ ui/ProgressBar.astro        # Launch Checklist/UAT bars
│  ├─ ui/Carousel.astro           # Booklet carousel
│  ├─ tables/StyledTable.astro    # Legal/policy tables
│  └─ hero/Hero.astro             # Home/Marketing hero
│
├─ content/                       # Astro Content Collections
│  ├─ pages/                      # MD/MDX content for simple pages
│  ├─ policies/                   # privacy, terms (single source)
│  └─ internal/                   # playbooks, UAT plans, outreach notes
│
├─ data/
│  ├─ site.ts                     # name, domain, meta, contact
│  ├─ membership.ts               # one canonical plan (700k/150r/2 seats)
│  └─ courses.ts                  # top 80+ (seeded list)
│
├─ pages/
│  ├─ index.astro                 # Home (dark theme)
│  ├─ pricing.astro               # Single plan (light or dark; pick one)
│  ├─ about.astro
│  ├─ contact.astro
│  ├─ corporate/
│  │  ├─ terms.astro              # Canonical Terms (light)
│  │  └─ privacy.astro            # PDPA policy (light)
│  ├─ member/
│  │  ├─ welcome-package.astro    # From the Welcome Pack page
│  │  └─ booklet.astro            # Consolidated “booklet” content
│  └─ internal/                   # no login yet; robots noindex
│     ├─ launch-plan.astro
│     ├─ launch-checklist.astro
│     ├─ outreach.astro
│     └─ uat.astro
│
└─ styles/
   ├─ tokens.css                  # CSS variables + Tailwind mapping
   ├─ theme-dark.css              # dark adjustments
   └─ theme-light.css             # light adjustments
```

* **Why two themes, not three?** You have a strong dark brand plus a credible “corporate/legal” light look. We’ll **drop ad‑hoc page-level styles** and keep **Dark + Light** as first-class themes; the “dashboard” is just dark with a sidebar shell. (Dark across Launch Plan / Concierge / Onboarding / UAT / Outreach / E‑Signature matches the current feel.      )
* **Single plan:** All pricing/terms copy renders from `data/membership.ts` to avoid drift.

---

## 3) Styleguide (design tokens → Tailwind → components)

> **Goal:** One source of truth for color/typography/space; theme toggled per layout.

### 3.1 Tokens (CSS variables)

```css
/* src/styles/tokens.css */
:root {
  --brand-navy-900: #0D1A2D;
  --brand-navy-800: #112240;
  --brand-gold:     #C9B079;
  --text-light:     #E0E0E0;
  --text-muted:     #a0aec0;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --shadow-1: 0 4px 15px rgba(0,0,0,.2);
  --shadow-2: 0 12px 30px rgba(0,0,0,.4);

  --ease: cubic-bezier(.2,.8,.2,1);
  --dur-fast: 150ms;
  --dur: 250ms;
}
.theme-dark {
  --bg: var(--brand-navy-900);
  --surface: var(--brand-navy-800);
  --text: var(--text-light);
  --accent: var(--brand-gold);
}
.theme-light {
  --bg: #f8f9fa;
  --surface: #ffffff;
  --text: #1a1a1a;
  --muted: #495057;
  --accent: var(--brand-gold);
}
```

### 3.2 Tailwind config (map to tokens)

```js
// tailwind.config.cjs
module.exports = {
  content: ["./src/**/*.{astro,ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        bg:      "var(--bg)",
        surface: "var(--surface)",
        accent:  "var(--accent)",
        brand: {
          navy:  { 900: "#0D1A2D", 800: "#112240" },
          gold:  "#C9B079",
        },
        text: {
          DEFAULT: "var(--text)",
          muted:   "var(--muted, #a0aec0)",
        }
      },
      boxShadow: {
        brand1: "var(--shadow-1)",
        brand2: "var(--shadow-2)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      fontFamily: {
        kanit: ["Kanit", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

### 3.3 Typography scale & usage

* **Headings (H1–H6):** Kanit 700/600, tight letter spacing for dark hero sections (carried from booklet/sales deck).  
* **Body:** Kanit regular by default for Thai/EN; Inter allowed in Light theme legal pages for readability **only in those templates** (Pricing & Terms / Privacy).   
* **Section titles:** Gold text + thin gold bottom border (you use this everywhere). Wrap it as `<SectionTitle>` component. 

### 3.4 Canonical UI components (mapped from your HTML)

| Component                 | Pulled from                     | Notes                                                                             |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `SectionTitle`            | Launch Plan / Booklets          | Gold header, uppercase, border bottom.                                            |
| `Card`                    | Booklets / Pricing / Dashboards | Dark surface + border + hover lift. Variants: default/featured/outline.           |
| `Timeline`                | Launch Plan / Onboarding        | Vertical (Launch Plan) + horizontal dotted (Onboarding). Props to switch style.   |
| `Accordion`               | Pricing & Terms                 | Title row + chevron + content; used for Terms, FAQs.                              |
| `ProgressBar`             | UAT / Launch Checklist          | % fill + caption; share one implementation.                                       |
| `Carousel`                | Booklets                        | Dots + arrows; accessible buttons.                                                |
| `StyledTable`             | Privacy                         | Reuse header row color scheme; responsive overflow.                               |
| `SignaturePad` (optional) | Agreement                       | Keep as demo; for production use a provider later.                                |

---

## 4) Layout blueprints

### 4.1 Base + Theme layouts

```astro
---
// src/layouts/BaseLayout.astro
const { title, description, theme = 'dark' } = Astro.props;
const themeClass = theme === 'light' ? 'theme-light' : 'theme-dark';
---
<html lang="en" class={themeClass}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title ? `${title} – Prime Corporate Golf Club` : 'Prime Corporate Golf Club'}</title>
    <meta name="description" content={description} />
  </head>
  <body class="bg-bg text-text font-kanit">
    <slot />
  </body>
</html>
```

```astro
---
// src/layouts/ThemeDark.astro
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/nav/SiteNav.astro';
const { title, description } = Astro.props;
---
<BaseLayout {title} {description} theme="dark">
  <SiteNav />
  <main class="container mx-auto px-4 py-12">
    <slot />
  </main>
  <footer class="text-center text-text/60 py-12">© {new Date().getFullYear()} Prime Corporate Golf Club</footer>
</BaseLayout>
```

```astro
---
// src/layouts/ThemeLight.astro
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/nav/SiteNav.astro';
---
<BaseLayout theme="light">
  <SiteNav variant="light" />
  <main class="prose max-w-4xl mx-auto px-4 py-12 font-inter">
    <slot />
  </main>
  <footer class="text-center text-slate-500 py-12">© {new Date().getFullYear()} Prime Corporate Golf Club</footer>
</BaseLayout>
```

```astro
---
// src/layouts/Dashboard.astro
import BaseLayout from './BaseLayout.astro';
import DashboardNav from '../components/nav/DashboardNav.astro';
---
<BaseLayout theme="dark">
  <div class="flex min-h-screen">
    <DashboardNav />
    <main class="flex-1 p-6 md:p-10">
      <slot />
    </main>
  </div>
</BaseLayout>
```

* **Privacy policy** should render with `ThemeLight` (it currently uses a light table and Inter). 
* **Pricing & Terms** canonical page uses `ThemeLight` accordion. 

---

## 5) Single source of truth (pricing/terms/quantities)

**Decision:** All copy pulls from `data/membership.ts`. This eliminates the current 144/949k/tiers vs 700k/150 rounds mismatch.

```ts
// src/data/membership.ts
export const plan = {
  name: "Prime Corporate Golf Membership",
  priceTHB: 700_000, // + VAT
  roundsPerYear: 150,
  seats: 2,
  guestsPerSeat: 3,       // 2 users → up to 6 guests together
  transferFeeTHB: 5_000,
  cancellationWindowHrs: 48
};
```

Any page that needs numbers imports `plan`. That updates **booklets** (“At a Glance”), **pricing**, **agreement**, and **terms** in one place, replacing old copies that show 144/949k/tiers.    

---

## 6) Page-by-page migration plan (no login yet)

**Public**

* **Home `/` (Dark):** Merge your marketing booklet hero + “At a Glance” + benefits + digital experience sections; keep Thai copy as-is for now (you already have Thai).  
* **Pricing `/pricing` (Light or Dark—pick one and be consistent):** Present the **single 700k** plan, “what’s included,” and the **accordion terms** (Guest policy, booking, cancellation, liability). Replace all tiered pricing remnants. 
* **Privacy `/corporate/privacy` (Light):** Port the PDPA policy (Last updated Oct 20, 2025), trim any references to defunct tiers. 
* **Terms `/corporate/terms` (Light):** Canonicalize the two copies into one; keep the existing structure and numbers mapped to `data/membership.ts`.  
* **Contact `/contact` (Dark):** Include concierge email/phone and simple form.

**Member (static content for PoC)**

* **Welcome Package `/member/welcome-package` (Dark):** Port the NFC card spec + Getting Started steps + flagship list. 
* **Booklet `/member/booklet` (Dark):** Consolidate the V3/V4 booklet into a single page, powered by `plan` data and shared components (Carousel, SectionTitle).  

**Internal (no login yet, but add `noindex`)**

* **Launch Plan `/internal/launch-plan`** with `Timeline`. 
* **Launch Checklist `/internal/launch-checklist`** with `ProgressBar` and checkboxes. 
* **Outreach `/internal/outreach`** (cards by industry + EEC focus). 
* **UAT `/internal/uat`** (test matrices for NFC/Portal/Invites + progress). 
* **Agreement (optional) `/internal/agreement-demo`** to keep the signature pad as a demo; for production signatures, integrate a provider later. 

---

## 7) Content model

Use **Astro Content Collections** for simple, repeatable content:

* `content/policies/*.mdx` → privacy, terms (rendered by `ThemeLight`).
* `content/internal/*.mdx` → concierge playbook excerpts, SOPs, checklists; cite/inline elements as needed. (Concierge SLAs—phone 3 rings, email 15 min, LINE 5 min—are explicitly defined; keep them as authoritative content blocks.) 
* `data/courses.ts` → Start with **Top 10** from the Welcome Pack and expand (later, import a full 80+ list). 

---

## 8) Patterns and accessibility baked in

* **Focus states**: high-contrast outlines for keyboard users.
* **Alt text**: your marketing pages already use meaningful alt text—keep and standardize. 
* **Tables**: `StyledTable` with `overflow-x-auto` wrapper (privacy page sets the precedent). 
* **Carousels**: Buttons labelled, dots labeled with “Go to slide N.” (already in booklet JS) 

---

## 9) SEO & domain setup

* **Meta + OpenGraph** unified in `BaseLayout`.
* **Sitemap/robots**: `/internal/*` marked `noindex,nofollow`.
* **Domain**: set canonical to `https://primethailand.golf`.
* **Analytics**: lightweight (GA4 or Plausible) via a single Astro partial.

---

## 10) What changes **because of the new single plan**

> Replace everywhere: **700,000 THB (+VAT), 2 seats, 150 rounds/year, 3 guests per seat (max 6 with both users), 48h cancellation, 5,000 THB user transfer.**

This updates:

* Pricing page (replace 949,000 and tiered tables).  
* Sales deck + incentives (remove 750k/850k/950k tiers and 156 bonus rounds).  
* Booklets (change “144” to “150” in At a Glance).  
* Agreement (144 → 150; preserve other clauses; keep PDPA alignment with Privacy).  

---

## 11) Implementation checklist (low overhead, PoC-friendly)

1. **Init Astro + Tailwind**; add `tokens.css`, `theme-dark.css`, `theme-light.css`.
2. **Layouts**: build Base/ThemeDark/ThemeLight/Dashboard.
3. **Components**: SectionTitle, Card, Button, Accordion, Timeline, ProgressBar, Carousel, StyledTable.

   * Map each from the closest existing HTML (to minimize rework). E.g., re-use the accordion structure from the light Terms page. 
4. **Data**: `data/membership.ts` with the new plan; replace all inline numbers.
5. **Pages**: migrate **Home**, **Pricing**, **Terms**, **Privacy**, **Welcome Package**, **Booklet**, and **Internal tools** (with `noindex`).
6. **Content Collections**: move legal and SOP text blocks out of templates into MDX for future edits (concierge SLAs, onboarding steps).  
7. **Clean duplicates**: keep one **Pricing & Terms** page as canonical; remove the twin.  
8. **QA pass**:

   * Visual parity with current dark cards/section titles (Launch Plan / Booklets).  
   * Accessibility checks on Accordion/Carousel/Progress bars.
   * **Copy audit** that every numeric appears via `plan` imports (no more drift).
9. **Deploy** to `primethailand.golf`; add `sitemap.xml` and `robots.txt`.

---

## 12) Sample page implementations

**Pricing (single plan)**

```astro
---
// src/pages/pricing.astro
import ThemeLight from "@/layouts/ThemeLight.astro";
import Accordion from "@/components/ui/Accordion.astro";
import { plan } from "@/data/membership";
const price = new Intl.NumberFormat("th-TH").format(plan.priceTHB);
---
<ThemeLight title="Pricing">
  <h1 class="text-3xl font-semibold mb-6">Prime Corporate Golf Membership</h1>
  <div class="bg-white shadow-sm rounded-lg border p-6 mb-8">
    <p class="text-lg"><strong>Annual Fee:</strong> ฿{price} (+VAT)</p>
    <ul class="mt-4 list-disc pl-6 text-slate-700">
      <li><strong>{plan.roundsPerYear}</strong> rounds/year (green fee, caddy, cart included)</li>
      <li><strong>{plan.seats}</strong> registered users</li>
      <li>Up to <strong>{plan.guestsPerSeat}</strong> guests per user (max 6 when both present)</li>
      <li>User change fee <strong>฿{new Intl.NumberFormat("th-TH").format(plan.transferFeeTHB)}</strong></li>
    </ul>
  </div>

  <Accordion items={[
    {
      title: "Membership Details",
      content: `
Membership is valid 12 months from activation. Two named users per corporation. User changes allowed for a fee; replacement must be same corporation.
      `
    },
    {
      title: "Usage & Guest Policy",
      content: `
Annual quota: ${plan.roundsPerYear}. Limit one 18-hole round/day per person.
Members must accompany guests at all times. One user may host up to ${plan.guestsPerSeat} guests; with both users present, up to 6 guests.
      `
    },
    {
      title: "Booking & Cancellation",
      content: `
All tee times via Personal Concierge. Cancel/change ≥ ${plan.cancellationWindowHrs} hours prior to avoid deduction. Late cancel/no-show deducts 1 round per player booked.
      `
    },
    {
      title: "Conduct & Liability",
      content: `
Course rules/etiquette apply. Prime is not liable for injuries or property damage at partner courses.
      `
    }
  ]}/>
</ThemeLight>
```

**Internal UAT (Dashboard)**

```astro
---
// src/pages/internal/uat.astro
import Dashboard from "@/layouts/Dashboard.astro";
import ProgressBar from "@/components/ui/ProgressBar.astro";
---
<Dashboard title="UAT">
  <h1 class="text-2xl font-semibold text-accent mb-6">Prime LINE Mini‑App UAT</h1>
  <ProgressBar value={0} total={9} />
  <!-- NFC, Portal/Tracking, Digital Invites tables replicate your current matrix -->
</Dashboard>
```

(Replicates the NFC/Portal/Invites scenarios and progress UX you have now.) 

---

## 13) Content and policy alignment notes

* **Privacy:** Keep PDPA framing and “Last Updated: 20 Oct 2025.” Ensure new single-plan references don’t contradict. 
* **Concierge SLAs:** Retain phone/email/LINE response SLAs in the internal playbook; surface a simplified version on the public Contact page. 
* **Agreement:** Update “144”→“150” and ensure guest/transfer/cancellation clauses match the Pricing/Terms page. Keep print styles.  

---

## 14) Risks & mitigations

* **Copy drift** (numbers change in one place, not others) → **centralize** in `data/membership.ts`.
* **Theme divergence** (dark vs light) → **two official themes only**, everything else is a variant.
* **Internal pages publicly visible** (no auth yet) → **add `noindex`** and keep them off primary navigation; expose only via direct link.

---

## 15) Actionable next steps

1. **Create the Astro project** with Tailwind, add tokens & theme styles.
2. **Build the four layouts**; wire `SiteNav`/`DashboardNav`.
3. **Implement core UI components** (SectionTitle, Card, Accordion, Timeline, ProgressBar, Carousel, StyledTable).
4. **Add `data/membership.ts`** with the **700k / 150 rounds / 2 seats** plan; refactor all pages to read from it.
5. **Migrate public pages**: Home → Pricing → Terms → Privacy → Welcome Package → Booklet (single consolidated page).
6. **Migrate internal pages** into Dashboard layout; add `noindex`.
7. **Canonicalize** duplicated **Pricing & Terms** to one route and delete the twin.  
8. **QA** for a11y and mobile; confirm every numerical fact matches `plan`.
9. **Point DNS to deploy** at `primethailand.golf`, ship.

---

### Why this solves your “layout inconsistency” problem

We’re **keeping your visual identity** (cards, gold section titles, dark premium shell) and **codifying it into tokens + two layouts + a component library**. The minor layout drift across pages disappears once every section type (Hero, SectionTitle, Cards, Timelines, Accordions, Tables, Progress) has **one canonical component**—and all numbers come from **one file**.

If you want, I can sketch the exact Astro files (as stubs) for the initial commit so your team can fill content immediately.
