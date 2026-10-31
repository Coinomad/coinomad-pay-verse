# Coinomad Website — Redesign Design Brief (DRAFT v0.1)

**Date:** 05 Sep 2026
**Author:** Hermes (design brief for Jeffery's review)
**Status:** DRAFT — design is the focus; nothing is built yet
**Pairs with:** `ui-ux-pro-max` skill (rules enforced directly from `references/quick-reference.md`; `search.py` not shipped in this install)

---

## 0. TL;DR — The Direction

Rebuild coinomad.xyz around a single story: **"Stablecoin Settlement & Infrastructure — built in Africa, live in 7 markets, rails everywhere."**

Two inspirations were reverse-engineered (both are stablecoin/dev-tool adjacent, so the mapping is genuine, not cosmetic):

| What we borrow | From | How it maps to Coinomad |
|---|---|---|
| **Product-first storytelling** (Payin / Payout / Orchestrate cards) | Noah | Commerce · Infrastructure · OTC |
| **Hero animation** (animated rails + floating product cards) | Noah | stablecoin moving across 7 fiat rails |
| **"Shrink-to-pill" navbar** on scroll | Noah | floating capsule nav over deep-green hero |
| **Premium typography** (Space Grotesk display, tight tracking) | Noah | Space Grotesk + Inter (upgrade from DM Sans) |
| **Dark, moody developer energy** (emerald-on-black, terminal motifs) | Dino | deep-green `#0f2318` dark hero + API section |
| **Editorial serif contrast** (Instrument Serif headlines) | Dino | optional serif accent for blog pull-quotes |
| **Custom SVG illustration system** (not stock, not video) | Noah (27 SVGs) | bespoke SVG per product pillar |

**The key unlock:** neither site uses GSAP/Lottie/WebGL. The "carefully and artistically crafted" feel comes from **typography + bespoke SVG illustration + disciplined scroll-driven motion** — not from a heavy animation engine. That is cheaper to build, faster to load, and easier to keep consistent.

---

## 1. Design Principles (the "why")

1. **Money moves, so the design moves.** Motion only ever expresses a cause→effect (coin → rail → settlement). No decorative-only animation (ui-ux-pro-max rule `motion-meaning`).
2. **One story per viewport.** One H1, one primary CTA, one hero product per section (`heading-hierarchy`, `primary-action`).
3. **Premium = restraint + contrast.** Deep-green dark sections as editorial anchors against clean light sections. Yellow is the *signal* color, used sparingly — not wallpaper.
4. **Art over decoration.** Every illustration explains a product; every number is tabular; every shadow is on a scale. No glow/halo (Jeffery's hard rule).
5. **Trust is the subtext.** CBN Sandbox badge, 7 markets, 13+ networks — surfaced as quiet, confident facts, not loud claims.

---

## 2. Brand System (evolved, not invented)

### 2.1 Color tokens (semantic — no raw hex in components)

| Token | Value | Role |
|---|---|---|
| `--c-bg` | `#F8F8F8` | light section background |
| `--c-bg-soft` | `#F0FDF4` | green-50 tint for tinted cards |
| `--c-surface` | `#FFFFFF` | cards on light |
| `--c-ink` | `#0f2318` | primary text + **dark section bg** (deep green = "noah black" equivalent) |
| `--c-ink-soft` | `#28443F` | secondary text on light |
| `--c-ink-deep` | `#0A1710` | darkest panel (hero/API footer) |
| `--c-accent` | `#FACC15` | **signal yellow** — CTAs, key highlights, the "coin" |
| `--c-accent-bright` | `#FFE600` | yellow hover / active |
| `--c-green` | `#16A34A` | **live/success + dev accent** (Dino's `#3ecf8e` analog) |
| `--c-teal` | `#2F524C` | secondary tint, borders, rails |
| `--c-muted` | `#6B7A72` | muted text on light (4.5:1 vs `#F8F8F8`) |
| `--c-border` | `#E3E8E4` | hairline borders |

**Contrast rule (mandatory):** yellow `#FACC15` is a *background* accent only — never yellow text on white. Yellow buttons carry `--c-ink` text (contrast ≈ 9:1). Green `#16A34A` text only on white/dark, never on yellow. (`color-accessible-pairs`, `color-not-only` — success always carries an icon/check, not color alone.)

### 2.2 Typography

| Role | Face | Notes |
|---|---|---|
| Display (H1–H3, big numbers) | **Space Grotesk** | geometric, techy, matches fintech premium (Noah's choice) |
| Body / UI | **Inter** | clean, highly legible, variable weights |
| Mono (codes, $ figures, APIs) | **JetBrains Mono** | terminal motif (Dino) |
| Editorial accent (optional) | **Instrument Serif** | blog pull-quotes, "the problem" stat section — serif contrast |

- Display scale: H1 `56px/0.95/-3px` desktop → `36px` mobile; H2 `40px/1.0/-1.5px`; H3 `28px/1.05/-0.5px`. Weight **400–500** (Space Grotesk reads premium at light weights — Noah runs 400 at 58px).
- Body: `16px/1.6` minimum (mobile 16px, no auto-zoom trigger). Weight 400.
- **Tabular numerals for every $ / ₦ / rate / percentage** (`number-tabular`). This kills the "recieved" wobble class of bugs.

### 2.3 Shape, elevation, spacing

- **Radius scale:** card `24px` (xl `40px` for hero feature cards), button/pill `999px`, input `12px`.
- **Shadow scale (neutral, no glow):** `s1 0 10px 40px rgba(15,35,24,.05)` · `s2 0 24px 80px rgba(15,35,24,.08)` · `s3 0 31px 80px rgba(15,35,24,.14)`. All shadows are green-tinted (not gray) for brand cohesion.
- **Spacing:** 4px base grid (`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`). Marketing = low density (spacious), dashboard = high (out of scope here).
- **Container:** `max-width 1200px` desktop, `24px` gutters mobile.

---

## 3. Information Architecture (sitemap)

```
/            Home          — hero (animated rails) → trust bar → 3 pillars → corridors → OTC → why → dev teaser → CTA
/collect     Commerce      — merchant wallet · payment links · widget · virtual accounts · US collections
/settle      OTC & Liquidity — non-custodial desk · auto-settle to bank · 7 markets · per-client addresses
/build       Developers    — Enterprise API v2 · 24 endpoints · auth (cn_v1_) · docs link · live code sample
/blog        Blog          — category tabs → featured → recent list → newsletter
/company     Company       — real story (CBN Sandbox Cohort 2, SB2026001140, RC 9303270) · team · regulatory
/contact     Contact       — book a call · jeffery@coinomad.xyz · social
/faq         FAQ           — moved out of "about" (currently buried)
```

**Nav (desktop):** Collect · Settle · Build (Developers) · Blog · Company | `[Book a demo]` (primary CTA).
**Nav (mobile):** drawer, bottom-sheet style, same order.
**Footer:** 7 markets both-ways (NGN USD EUR GBP CAD MXN BRL) + GHS live + KES/ZAR dormant + 30+ countries FX; full 13+ network list; letterhead tagline "STABLECOIN SETTLEMENT & INFRASTRUCTURE"; coinomad.xyz only.

**Positioning fix (critical, from Aug review):** title/meta drops the 🐴 emoji and "African Businesses" narrowing → **"Coinomad — Stablecoin Settlement & Infrastructure"**. FAQ no longer says "businesses and individuals" (business-only). About page deduplicated into a real company story (keep the $205B / $92.1B / 5–8% FX problem framing — it's strong).

---

## 4. Section-by-Section (Home) — the money pages

### 4.1 Hero — "the Noah animation"
**Structure (dark deep-green `#0f2318` → `#0A1710` gradient):**
1. **Staggered headline reveal** — "Move money across borders. Settle in seconds." word-by-word, `clip-path` / `translateY(24px)→0`, 30–50ms stagger, 400ms ease-out. (`stagger-sequence`, `spring-physics`.)
2. **Animated SVG "rails"** — a bespoke illustration: stablecoin (yellow circle/coin) traveling along 7 curved rails to 7 market nodes (NGN · USD · EUR · GBP · CAD · MXN · BRL), drawn in on load via `stroke-dashoffset` animation + a coin dot traveling `offset-path` along each rail. This is the "artfully crafted API/product showcase" — **it literally shows the product** (7-market settlement), not an abstract swirl.
3. **Floating product cards** — 3 small cards (Payment Link · Virtual Account · API) with a gentle `float` + subtle parallax on mouse move (`parallax-subtle`), corner radius 16px, `s2` shadow.
4. **Primary CTA** — `[Book a demo]` (yellow, ink text) + secondary `[Read the docs]` (ghost, white).
5. **Trust bar** — CBN Sandbox Cohort 2 (SB2026001140) · "13+ networks" · "7 markets, both directions" · RC 9303270.

### 4.2 Three Pillars — "the Noah product cards"
Three large, color-blocked cards (Noah's blue/pink/brown technique, mapped to brand):
- **Collect (Commerce)** — accept stablecoins via wallet, payment link, widget. Illustration: incoming coins → wallet.
- **Settle (OTC & Liquidity)** — non-custodial desk, auto-settle to client bank, 7 fiat rails. Illustration: coin → rail → bank.
- **Build (Infrastructure)** — Enterprise API v2, virtual accounts, US collections, 24 endpoints. Illustration: code → endpoint → workflow.

Each card: icon + H3 + 2-line value prop + "More about X →" link (Noah's exact microcopy pattern). Dark card (Build) + two tinted cards (green-50 / teal tint). No glow — clean edges, `s2` shadow.

### 4.3 Corridors — "One Business. Seven Markets."
Reuse the existing iGaming corridor visual (`~/Desktop/Hermes/coinomad-igaming-infographic/`). Tabular rate table: 7 currencies, both directions, live rails. This is the single most trust-building section for OTC/TradFi buyers — give it full width.

### 4.4 OTC teaser → links to /settle
Non-custodial escrow · auto-settle to client bank · per-client addresses. (Currently the site under-sells this — it's a differentiator, lead with it.)

### 4.5 Why Coinomad (proof)
Testimonial-style pull quotes (serif accent) + the $205B / $92.1B / 5–8% FX problem framing. Regulatory trust as a quiet badge, not a banner.

### 4.6 Developer teaser → links to /build
Live terminal/code sample (JetBrains Mono, dark card, Dino's "// SHIP" energy): a `curl` create-customer + settle example with a "COPY" button. This is the "show the API" moment Noah nails with "Developer-First, by Design."

### 4.7 CTA + Footer
"Start building on the stablecoin stack." → Book a demo. Newsletter ("the Coinomad pulse").

---

## 5. Animation & Motion System

**Engine decision:** Framer Motion (or pure CSS scroll-driven + IntersectionObserver). No GSAP unless a specific pin/split-text is needed — the inspirations don't use it, and it keeps the bundle lean (`bundle-splitting`).

**Motion tokens (unify everything — `motion-consistency`):**
| Token | Value |
|---|---|
| `--dur-micro` | 150–200ms (hovers, states) |
| `--dur-enter` | 300–400ms (reveals) |
| `--dur-exit` | 200–250ms (exit ≈ 60–70% of enter — `exit-faster-than-enter`) |
| `--ease-enter` | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out) |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` (ease-in) |
| `--stagger` | 30–50ms per item |

**Rules:**
- Transform/opacity only. Never animate `width`/`height`/`top`/`left` (`transform-performance`).
- **Every animation respects `prefers-reduced-motion`** — disable rails/parallax/float, keep content readable (`reduced-motion`).
- Max 1–2 animated elements per viewport (`excessive-motion`).
- **Hero:** load-in rail draw + coin travel + staggered headline (once).
- **Scroll reveals:** fade-up 300ms on IntersectionObserver, staggered cards.
- **Number counters** in stats: count-up with tabular numerals, respect reduced-motion.

### 5.1 Navbar — "shrink-to-pill" (the feature you called out)
Spec (scroll-driven, no JS animation library needed):
1. **Top state (scrollY = 0):** transparent over dark hero, full-width, logo white + links white, no background.
2. **Scroll past ~80px:** nav **morphs into a centered floating capsule** — `max-width 720px`, `margin auto`, `border-radius 999px`, background `rgba(255,255,255,0.9)` + `backdrop-filter: blur(12px)`, `1px` hairline border, `s2` shadow, height reduced ~64px → ~52px. Logo + links flip from white → ink. **This is a single transform transition (scale/width via max-width, opacity, color swap), 250ms ease.**
3. **Implementation note:** reserve no layout space — nav is `position: fixed`, and the hero is padded for it (`fixed-element-offset`). Use `IntersectionObserver`/scroll listener with `requestAnimationFrame` throttle (`debounce-throttle`).

---

## 6. Illustration System (the "high-quality illustrations" request)

This is the highest-leverage investment. Noah ships 27 SVGs; Coinomad needs a **consistent, bespoke set** — not stock photos, not random icons.

**System spec (every illustration shares these):**
- **Medium:** inline SVG (crisp at any DPI, animatable, zero weight vs video).
- **Style:** geometric + line-drawn "rails" motif — 1.5px stroke, rounded caps/joins, color-blocked fills (ink / teal / green-50), yellow only for the "coin/asset" element.
- **Palette discipline:** 3 colors max per illustration (ink + teal + one accent). No gradients except subtle tonal fills.
- **Corner language:** same 12–16px radius as UI cards — illustrations echo the card system.
- **Animation:** draw-in on scroll (`stroke-dashoffset`) + one traveling "coin" dot per rail. Respects reduced-motion.

**Required illustration set (v1):**
1. Hero rails (7 markets) — the centerpiece.
2. **Collect** — coins → wallet.
3. **Settle** — coin → rail → bank building.
4. **Build** — code block → endpoint → workflow nodes.
5. Blog featured image system (a small set of reusable editorial marks).
6. Empty states / subtle section dividers.

**Style budget:** commission/author ~6–10 bespoke SVGs. Everything else is composed from a shared icon set (Lucide, 1.5px stroke — `icon-style-consistent`, `no-emoji-icons`).

---

## 7. Blog Design ("I love Noah's blog page too")

Mirror Noah's blog IA, in brand:

1. **Hero:** "Inside the Rails" + one-line positioning ("Perspectives on stablecoin settlement, infrastructure, and regulation in Africa.").
2. **Category filter tabs** (pill tabs, not dropdown): All · Product · Regulatory · Partners · Knowledge Base · News. (`nav-state-active` on current.)
3. **Featured section:** 2 large cards (category label chip + Space Grotesk title + 1-line excerpt + illustration mark).
4. **Most recent:** dated list (tabular dates), title, category chip, excerpt.
5. **Partnerships sub-block** (mirrors Noah's "Our Trusted Partners").
6. **Newsletter CTA** + disclaimer footnote.
7. **Article template:** Space Grotesk H1, 65–75ch measure (`line-length`), serif pull-quotes (Instrument Serif), code blocks in JetBrains Mono on ink cards, `<figure>` illustrations, prev/next, reading time + category + date.

---

## 8. ui-ux-pro-max — Structured Guidelines (how we run the skill)

`search.py` is **not** in this install, so we enforce rules directly from `references/quick-reference.md`. If the script is ever added, the invocation would be:

```bash
python .../scripts/search.py "fintech stablecoin payments infrastructure B2B premium minimal" \
  --design-system -p "Coinomad" --variance 6 --motion 8 --density 5
# supplement:
#   --domain typography "geometric display modern fintech"
#   --domain color "finance premium green"
#   --domain landing "hero social-proof product"
#   --domain ux "animation accessibility reduced-motion"
#   --domain gsap "scroll reveal stagger pin"
```

**Rule enforcement checklist (the ones that bite this project):**
- **P1 Accessibility:** `heading-hierarchy` (fix the double-H1), `color-contrast` (yellow-on-white fails → yellow is bg-only), `focus-states`, `alt-text` (every illustration has a text fallback), `reduced-motion`.
- **P3 Performance:** `bundle-splitting` (route-level), `image-dimension` (CLS < 0.1), `font-loading` (swap + preload display font), `critical-css`.
- **P4 Style:** `consistency`, `no-emoji-icons` (kill the 🐴 in title), `primary-action` (one CTA per view), `elevation-consistent` (use the shadow scale, not random).
- **P5 Layout:** `mobile-first`, `breakpoint-consistency` (375/768/1024/1440), `no horizontal scroll`, `fixed-element-offset` (nav), `container-width`.
- **P6 Typography/Color:** `font-pairing`, `font-scale`, `number-tabular`, `color-semantic`, `line-height 1.5+`, `line-length 65–75ch`.
- **P7 Animation:** `motion-meaning`, `transform-performance`, `duration-timing 150–400ms`, `stagger-sequence`, `spring-physics`, `exit-faster-than-enter`, `parallax-subtle`, `reduced-motion`, `motion-consistency`.
- **P9 Navigation:** `nav-state-active`, `deep-linking`, `persistent-nav`, `navigation-consistency`.
- **P10 (light):** `data-table` (corridor table gets a real table, not divs), `number-formatting`, `legend-visible` if any chart.

**Jeffery's standing design rules (non-negotiable, override defaults):**
- ❌ No glow / halo / outline effects on cards, buttons, or logos (reads as "ugly light-blue outlines").
- ❌ No slide-in panels; prefer card-based selection over dropdowns.
- ✅ Gradient *fills* + neutral shadows for emphasis are fine.
- ✅ Clean edges, tinted backgrounds.

---

## 9. Build Notes (for later — do NOT build yet)

- Keep everything in `coinomad-pay-verse` (Vite + React + shadcn/ui + Tailwind + TS), marketing sections untouched from app routes.
- Add: route-level code splitting, a `design-tokens.css` with the semantic vars above, a shared `Illustration`/`Rails` component, a `useScrollNav` hook for the pill nav.
- New routes need `vercel.json` SPA rewrite coverage (already configured).
- **Visual QA gate:** before "done," screenshot each page at 375 / 768 / 1440 and run the pro-rules checklist (dark-mode contrast, safe areas, focus rings).

---

## 10. Decisions

1. ✅ **LOCKED (05 Sep):** light-first with dark deep-green `#0f2318` hero + dark API/blog sections (best of Noah's clean + Dino's mood). — SUPERSEDED by 4 (spike testing)
2. ✅ **Superseded:** Space Grotesk/Inter → Instrument Sans/Serif pairing (see 5)
3. ✅ **Default:** yellow = brand signal/CTA; green = dev/success. — under review in black & green spike
4. ⏳ **In test — spike 002 (`design/spike-002-black-green.html`):** full black & green direction — green-tinted black `#0A0F0C`, `#22C55E`/`#4ADE80` accents, no yellow.
5. ✅ **Font pairing (Enta-inspired, 05 Sep):** Instrument Sans 700 tight-tracking display + Instrument Serif italic accent words + JetBrains Mono for numerals/code. Loaded from Google Fonts.
6. ✅ **Positioning note (Jeffery, 05 Sep):** "we do more than just APIs." Brand must encompass: **e-commerce** (payment links + widgets), **finance teams & small funds** (crypto-native and TradFi) doing cross-border collect/settle, AND developers consuming the API. Site copy leads with money-movement outcomes per audience, never "API company" framing alone.
7. ✅ **OJO skill applied:** `app-ui-ux-best-practices` (github.com/touchine-ojo/OJO-Design-Skills, vetted clean, installed `~/.hermes/skills/`) — register dials: mid-energy/polished/sparse/medium-heavy/serious-modern; green-tinted darks (never pure black or purple); solid hairline-bordered cards (no glass stacks); honest copy (no round fake metrics — `$48,276.40` style); counter-hue discipline to avoid one-note.
8. ⏳ **Next:** pick a direction between spike 001 (light + dark sections) and spike 002 (black & green), then full 7-page build.
