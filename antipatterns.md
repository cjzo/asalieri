# skills.md — Production-Grade UI Design (Anti-Patterns + Enforcement Rules)

**Principle:** hierarchy, clarity, intent. Remove before adding. No decorative elements without purpose; no decision without hierarchy; no duplication without abstraction.

---

## 1) Layout Stability (NON-NEGOTIABLE)

* **No layout shift:** never change width/height/padding/margin/font-weight on hover; pre-allocate space; use `transform/opacity`; prefer `outline/box-shadow` over borders.
* **No overflow bugs:** no horizontal scroll, clipping, or spill; use `overflow-hidden` only intentionally; test long/dynamic content.
* **No overlap:** avoid ad-hoc absolute/z-index; define stacking contexts; verify all breakpoints.
* **Deterministic sizing:** consistent spacing scale (4/8px); avoid arbitrary/mixed units.

## 2) Visual Hierarchy (CRITICAL)

* **Type scale:** ≥1.25 ratio; ≤5–6 sizes; hierarchy obvious in <1s.
* **Primary action:** exactly one dominant CTA per section; others are secondary/ghost.
* **No redundancy:** every line adds information.

## 3) Color System (STRICT)

* **No “AI goo”:** avoid similar hues stacked; use 70/20/10.
* **No gradient text;** text is solid.
* **Contrast:** ≥4.5:1 body, ≥3:1 large (no exceptions).
* **No pure #000/#FFF:** tint toward brand hue.
* **No default dark aesthetic:** choose intentionally.

## 4) Components (COMPOSITION)

* **No nested cards;** flatten with spacing.
* **No card overuse;** containers only when needed.
* **No side accent borders.**
* **Border vs radius:** no thick border on rounded shapes; remove one.
* **Icons:** no emoji; no icons in colored rounded squares; use only for actions/meaning.
* **No template grids:** avoid repeated identical icon+title+text; introduce hierarchy.

## 5) Typography (STRICT)

* **No flat hierarchy;** distinct sizes.
* **Avoid overused defaults** unless justified.
* **≥2 roles:** display + body.
* **Line length:** 65–75ch max; **line height:** 1.5–1.7.
* **No all-caps paragraphs;** labels only.
* **No monospace for aesthetics;** only for code/data.
* **No grey text oncolored background** it looks bad and has no contrast.

## 6) Spacing System

* **No uniform spacing:** tight groups + larger section gaps.
* **Padding:** 12–16px min inside containers.
* **Rhythm reflects hierarchy.**

## 7) Motion & Interaction

* **Purpose only;** no decorative animation.
* **Easing:** no bounce/elastic; use exponential easing (e.g.   ease-out).
* **Perf-safe:** only `transform/opacity`; never width/height/margin.
* **Consistency:** predictable hover/active/focus.

## 8) Responsiveness (PROD)

* **No feature removal on mobile;** adapt instead.
* **Test breakpoints:** small/medium/large.
* **Touch targets:** ≥44×44px.

## 9) Data & Content

* **No fake charts;** if data matters, give space.
* **Prioritize readable, meaningful data.**

## 10) Accessibility (NON-OPTIONAL)

* **WCAG AA contrast;** semantic headings (no skips).
* **Keyboard nav;** visible, consistent focus states.

## 11) Hard-Fail Anti-Patterns

* Gradient text; icon-in-rounded-square; nested cards; side accent border; layout shift on hover; overflow bugs; multiple primary buttons; redundant copy; emoji UI; purposeless glassmorphism.

## 12) Validation Checklist

* No layout shift; no overflow; hierarchy clear <1s; one primary CTA/section; text readable at a glance; no unnecessary elements.

**Outcome:** stable, predictable, legible, intentional UI. Anything else is noise.
