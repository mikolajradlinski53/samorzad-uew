# Feature Landscape: Samorząd Studentów UEW

**Domain:** Polish university student council website (samorząd studencki)
**Researched:** 2026-05-13
**Stack constraint:** Pure HTML/CSS/JS, Netlify hosting, no CMS, no backend

---

## Table Stakes

Features students expect. Missing = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Homepage hero with mission statement | Every org website has one; first impression = legitimacy | Low | Already exists; needs visual polish |
| News / Aktualności section | Students expect current updates, announcements, and event recaps | Low | Card grid exists; missing: real content, per-article pages |
| Events / Wydarzenia listing | Students need to find upcoming events with dates | Low | Card grid with date badges exists; missing: past/upcoming split |
| Board members / Zarząd page | Students want to know who leads the council; accountability | Low | Exists with 2 groups (Zarząd + Rada); missing: real photos, emails |
| Organizational structure (komisje) | Polish law requires transparency of samorząd structure; students look for which komisja handles their issue | Medium | Partial — zarzad.html has a text paragraph; needs a dedicated komisje section with per-komisja cards |
| Contact form that actually sends | Students need to reach the council; broken form = trust killer | Medium | Critical bug in current code — shows success without sending; fix = add `data-netlify="true"` + AJAX fetch |
| Contact details visible without form | Email, room number, office hours; students want direct options | Low | Already in index.html contact section; needs real social media links |
| Strefa Studenta resource hub | Polish students expect samorząd to explain: scholarships, student rights, ombudsman, regulations | Medium | Exists as strefa-studenta.html; content is thin/placeholder |
| Scholarship types (stypendia) | Top search intent: stypendium socjalne, rektora, dla niepełnosprawnych, zapomoga | Low | Exists as cards in strefa-studenta.html; needs deadlines and direct USOS/dziekanat links |
| Student Rights / Prawa Studenta | Regulatory obligation; students facing academic issues look here first | Low | Exists as section in strefa-studenta.html; content is placeholder prose |
| Documents / Uchwały download section | Samorząd passes formal resolutions (uchwały); required by statute to be public; students download regulatory docs | Medium | Does NOT exist yet; marked Active in PROJECT.md |
| Responsive mobile design | ~70% of students browse on mobile; non-responsive = unusable | Low | Exists but has known issues; needs nav, touch, typography fixes |
| PL/EN language toggle | UEW has international students (Erasmus+); bilingual is expected | Low | Exists; has typewriter sync bug to fix |
| 404 error page | Without it, broken links show a blank/default Netlify page | Low | Does not exist; missing from codebase |
| Social media links | Facebook/Instagram are primary student communication channels in Poland | Low | Placeholder links exist; need real URLs |

---

## Differentiators

Features not expected by default, but that make the site stand out versus a basic institutional page.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Komisje / Thematic commissions section | Most samorząd sites bury komisje in a text list; visual cards with chair contact + scope of each komisja helps students self-route | Medium | Does not exist; maps to "Komisje" new page or zarzad.html section |
| Category filter on Aktualności | Students only want to see Ogłoszenia, Stypendia, Kampus, etc. — not everything; JS-only filter on static HTML requires no backend | Medium | Hardcoded category badges exist; filter logic is ~20 lines of vanilla JS with `data-category` attributes |
| Animated stats counter (already present) | "5000 studentów, 18 projektów" builds credibility; rare on institutional sites | Low | Already implemented; needs real numbers from the council |
| Partner logos with hover effect | Real logos (not "Partner 1–8") signal legitimacy and funding | Low | Exists as placeholder grid; needs actual logo images in `/assets/partnerzy/` |
| Projects showcase with status badges | Aktywny / Zakończony / Planowany badges communicate real activity | Low | projekty.html has category badges; easy to add status variant |
| Student zone with direct deeplinks | Footer and homepage cards link directly to `strefa-studenta.html#stypendia` anchors — lets students bookmark exact info | Low | Anchor structure already exists; needs consistent link wiring |
| Agency-style visual design | Smooth scroll, hover effects, animated section entries — differentiates from typical university grey/table layout | Medium | CSS foundation exists; hero animations present; needs consistency across all sections |
| Netlify Forms with real delivery + honeypot | Working contact form with spam protection is rare on student org sites; most just show an email | Medium | Requires: `data-netlify="true"`, AJAX submit, honeypot field, custom success state |
| Document section grouped by category | Students browsing uchwały need quick orientation: "Uchwały finansowe", "Regulaminy", "Protokoły" | Medium | New feature; pure HTML with PDF links grouped in `<dl>` or accordion; no JS required for basic version |

---

## Anti-Features

Features to explicitly NOT build given the vanilla HTML/Netlify/no-backend constraint.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| CMS / admin panel | Out of scope per PROJECT.md; adds infra complexity with no gain for a team already using GitHub | Manage content by editing HTML and committing; Git is the audit trail |
| Per-article news detail pages | Requires either a CMS or 20+ individual HTML files updated by hand; unsustainable | Keep full article text in aktualnosci.html cards; link out to FB/Instagram post for full story |
| Search functionality | Requires either a backend index or a third-party widget (Algolia, Pagefind); adds complexity | Use browser Ctrl+F for now; revisit if content volume demands it; Pagefind is viable if build step is added later |
| Event calendar widget (embedded Google Calendar / Calendly) | Adds third-party dependency, GDPR complexity, iframe accessibility issues | Use the existing date-badge card grid; link to Facebook event for RSVP |
| Online forms beyond contact (np. wniosek stypendialny) | Processing applications requires backend data handling, storage, GDPR compliance | Link directly to university USOS system or PDF form for download |
| User accounts / login | Zero justification for a public informational site | Keep fully public; no auth surface to attack |
| Dark mode | Nice-to-have but costs significant CSS work; CSS variables make it feasible but not essential | Use system prefers-color-scheme only if a phase is dedicated to polish |
| Live chat widget | Third-party dependency, ongoing cost, someone must monitor it | Contact form + listed email is sufficient for samorząd scale |
| Social media feed embed | Facebook/Instagram embeds are slow, GDPR landmines, break often | Link to social profiles; do not embed feeds |
| Cookie consent banner with full CJEU compliance | Overkill for a site with no tracking cookies (no analytics installed yet) | Add only if/when analytics (Plausible, Google Analytics) is added |

---

## Feature Dependencies

```
Netlify Forms (working contact) → requires: data-netlify attribute + AJAX fetch in script.js
                                → blocks nothing, but unblocks: trust in the site

Documents section (Uchwały)    → requires: /dokumenty/ directory or PDFs committed to repo
                                → no JS dependency; pure HTML anchor list

Komisje section                → requires: real komisja names/chair names from council
                                → can be added to zarzad.html or new komisje.html

Category filter (Aktualności)  → requires: data-category attributes on all news cards
                                → requires: filter buttons + ~20 lines of JS in script.js
                                → no backend dependency

Partner logos                  → requires: logo image files placed in /assets/partnerzy/
                                → no code change; just swap placeholder divs with <img>

Real board photos               → requires: photo files from council members
                                → no code change; swap emoji divs with <img class="avatar-img">

404 page                        → requires: 404.html in repo root (Netlify auto-serves it)
                                → no JS dependency

Komisje page                   → can reuse: .card-grid-3, .avatar-card, .section patterns
                                → depends on: real komisja data from council

PL/EN typewriter fix            → requires: call initTypewriter() at end of applyLang()
                                → fixes: existing bug; no new feature code needed
```

---

## Standard Pages for Polish University Samorząd Sites

Based on analysis of the reference site structure (samorzad.ue.wroc.pl content model), the current codebase, and domain knowledge of Polish higher education organizations:

| Page | Polish Name | Purpose | Status in Codebase |
|------|-------------|---------|-------------------|
| Homepage | Strona główna | Overview, hero, stats, news/events preview, contact | Exists (index.html) |
| News/Announcements | Aktualności | Ongoing news, ogłoszenia, scholarship updates | Exists (aktualnosci.html) — no filter |
| Events | Wydarzenia | Upcoming events with dates | Exists (wydarzenia.html) — no past/future split |
| Board / Władze | Zarząd | Executive board + Rada Uczelniana | Exists (zarzad.html) — emoji placeholders |
| Commissions | Komisje | Thematic commissions (naukowa, socjalna, kulturalna, sportowa, zagraniczna) | Missing — text mention only in zarzad.html |
| Projects | Projekty | Active and past initiatives | Exists (projekty.html) — no status filter |
| Student Zone | Strefa Studenta | Resources: scholarships, rights, ombudsman, regulations | Exists (strefa-studenta.html) — thin content |
| Documents | Dokumenty / Uchwały | Formal resolutions, regulations, financial reports (PDFs) | Missing — in PROJECT.md Active list |
| Contact | Kontakt | Form + address + social — often embedded in homepage | Exists as section in index.html |
| About | O nas | History, mission, statute overview | Not present — merged with Zarząd section in current nav |

### What Students Actually Search For on Samorząd Sites

Priority order based on Polish university student behavior patterns:

1. **Stypendium deadlines and types** — Highest traffic; students need exact amounts, criteria, deadlines, USOS link
2. **Contact / who to call** — Students with a problem want a named person, not just a generic form
3. **Rzecznik Praw Studenta** — Students in academic disputes look for the ombudsman specifically
4. **Uchwały / Regulations downloads** — Students appealing decisions need official regulation PDFs
5. **Event dates** — Juwenalia, integration camps, workshops with registration info
6. **Who is the current Przewodniczący** — Students want to know who represents them
7. **Komisje** — Students wanting to join or contact a specific commission
8. **Projects portfolio** — Prospective members and partners look for what the council does

---

## Organizational Structure: How to Present Komisje Clearly

Polish university samorząd typically has:
- **Zarząd** (Executive board): Przewodniczący, Wiceprzewodniczący, Sekretarz, Skarbnik
- **Rada Uczelniana** (University council): Representatives per faculty/wydział
- **Komisje tematyczne** (Thematic commissions): typically 5–8 named groups
- **Filia** (Branch): if university has satellite campuses (UEW has Jelenia Góra branch)

Typical komisje names at economics universities:
- Komisja Naukowa (academic/research)
- Komisja Socjalna (welfare/social support)
- Komisja Kulturalna (culture/events)
- Komisja Sportowa (sports)
- Komisja ds. Współpracy Zagranicznej (international/Erasmus)
- Komisja Finansowa (finance/budget)
- Komisja Prawna (legal/rights)

**Recommended presentation pattern for static HTML:**
- Dedicated section in `zarzad.html` below Rada Uczelniana
- Each komisja as a `.card` with: komisja name, short scope description (1–2 sentences), chair name, contact link
- Use `.card-grid-3` (3 columns) — 6 komisje fits perfectly
- Add `#komisje` anchor for deeplink from strefa-studenta.html

---

## Document / PDF Management Pattern for Static Sites

**Recommended approach for this project:**

```
/dokumenty/
  uchwaly/
    2026-01-10-uchwala-nr-1.pdf
    2026-02-15-uchwala-nr-2.pdf
  regulaminy/
    regulamin-samorzadu.pdf
    regulamin-stypendialny.pdf
  protokoly/
    protokol-2026-01.pdf
  sprawozdania/
    sprawozdanie-finansowe-2025.pdf
```

**HTML pattern** — no JavaScript required:
```html
<section class="section" id="uchwaly">
  <div class="container">
    <h2>Uchwały 2026</h2>
    <ul class="doc-list">
      <li class="doc-item">
        <span class="doc-icon">PDF</span>
        <a href="/dokumenty/uchwaly/2026-01-10-uchwala-nr-1.pdf"
           target="_blank" rel="noopener">
          Uchwała nr 1/2026 z dnia 10 stycznia 2026
        </a>
        <span class="doc-date">10 sty 2026</span>
      </li>
    </ul>
  </div>
</section>
```

**Key decisions:**
- Files in repo root `/dokumenty/` — versioned with Git, free hosting on Netlify
- Netlify serves all static files including PDFs directly (no config needed)
- Filename convention: `YYYY-MM-DD-slug.pdf` enables natural sort order
- Link opens in new tab (`target="_blank"`) so user doesn't lose page context
- Group by category with separate `<section id="...">` per category — deeplinks work
- Add a `.doc-list` CSS class styled as a clean bordered list, not a table — simpler on mobile
- No JavaScript filtering needed unless document count exceeds ~50; at that point a simple `data-year` filter suffices

**Scalability limit:** At ~100+ documents, consider an external document host (Google Drive folder, university SharePoint) and link out — avoids repo bloat and Netlify's 100MB free deployment limit.

---

## News / Blog Pattern for Static HTML (No CMS)

**The fundamental constraint:** Vanilla HTML has no templating — each news item is hardcoded HTML. This is fine at the scale of a samorząd site (10–30 items/year).

**Recommended pattern:**

Option A — All news on one page (current approach, recommended):
- `aktualnosci.html` contains all news items as `.card` elements
- Newest at top; older items below
- Adding new item = copy a card block, edit the text, commit
- No individual article pages; full text in the card or link to social media post
- Add `data-category="ogloszenie|kampus|stypendium|wydarzenie|raport"` attribute per card
- Category filter: 6 lines of JS toggling `display: none/block` based on active filter button

Option B — Individual article HTML files (not recommended):
- `aktualnosci/wybory-2026.html`, `aktualnosci/stypendia-2026.html`, etc.
- Requires duplicating navbar/footer in each file (maintenance nightmare without templating)
- Only justified if articles regularly exceed 300 words and need proper formatting

**Decision: Use Option A.** The samorząd publishes announcements (150–300 words), not long-form journalism. Link to Facebook/Instagram for multimedia.

**Category filter implementation (vanilla JS, no dependencies):**
```javascript
// In script.js — add to initNewsFilter()
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll('.card[data-category]').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
```

---

## Netlify Forms: Full Implementation Guide

**How it works:**
- Netlify's build bot scans HTML at deploy time for forms with `data-netlify="true"`
- Submissions go to Netlify dashboard (Forms tab) and optionally trigger email notifications
- No JavaScript required for basic submission (standard POST); AJAX required for custom success state
- Free tier: 100 submissions/month — more than sufficient for a student council contact form

**Required HTML attributes:**
```html
<form
  name="contact"          <!-- must match across form and hidden input -->
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"   <!-- spam protection -->
  action="/kontakt-wyslany.html" <!-- redirect on success (or omit for AJAX) -->
>
  <!-- hidden input required when using AJAX submit -->
  <input type="hidden" name="form-name" value="contact" />
  <!-- honeypot: hidden from humans, bots fill it -->
  <p style="display:none">
    <input name="bot-field" />
  </p>
  <!-- real fields -->
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="text" name="subject" required />
  <textarea name="message" required></textarea>
  <button type="submit">Wyślij</button>
</form>
```

**AJAX submit pattern** (keeps user on page, shows custom success message — matches existing UX):
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // ... existing validation ...
  const formData = new FormData(form);
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
      form.style.display = 'block';
      form.reset();
    }, 5000);
  } catch (err) {
    // show error state
  }
});
```

**Spam protection: use honeypot, not reCAPTCHA.**
- reCAPTCHA adds a visible challenge widget, creates friction, and requires Google API key management
- Netlify's Akismet auto-filter + honeypot field is sufficient for a student council site
- reCAPTCHA only justified if spam becomes a recurring problem post-launch

**Email notifications:**
- Configure in Netlify UI: Site > Forms > select form > Notifications > Add email recipient
- No code change needed; Netlify emails when a submission arrives
- Multiple recipients supported (e.g., przewodniczacy@... + kontakt@...)

**Limitation to know:** Netlify Forms does not support file upload submissions reliably in the free tier (8 MB max, 30 s timeout). Do not add a file upload field to the contact form.

---

## MVP Recommendation

Prioritize for immediate completion:

1. **Fix Netlify Forms integration** — critical trust issue; ~1 hour of work; unblocks actual use of the site
2. **Documents section** — highest student demand; pure HTML + PDF files; no new JS needed
3. **Komisje cards in zarzad.html** — closes the biggest structural gap; ~30 min of HTML work once data is available
4. **Real partner logos** — trivial once image files exist; replaces placeholder text
5. **Category filter on Aktualności** — adds real usability; ~25 lines of JS + filter buttons

Defer:
- **Individual news article pages** — not justified at current content volume; revisit at 30+ items
- **Interactive campus map** — embed Google Maps iframe only if section needs to exist; link to university map URL as fallback
- **Search** — not needed until document/news count exceeds 50 items
- **Dark mode** — polish phase only

---

## Sources

- Codebase analysis: `index.html`, `aktualnosci.html`, `zarzad.html`, `strefa-studenta.html`, `wydarzenia.html`, `projekty.html`, `script.js` — HIGH confidence (direct inspection)
- PROJECT.md requirements: Active and Out of Scope feature lists — HIGH confidence
- Architecture analysis: `.planning/codebase/ARCHITECTURE.md`, `CONCERNS.md`, `STRUCTURE.md` — HIGH confidence
- Netlify Forms documentation: https://docs.netlify.com/forms/setup/ — HIGH confidence (official docs, verified)
- Netlify spam filters: https://docs.netlify.com/forms/spam-filters/ — HIGH confidence (official docs, verified)
- Polish university samorząd domain knowledge (komisje naming, student search patterns, Prawo o szkolnictwie wyższym transparency requirements): MEDIUM confidence — drawn from knowledge of Polish higher education law and samorząd statute norms; should be confirmed against UEW's actual statute and samorzad.ue.wroc.pl sitemap when accessible
