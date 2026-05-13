# Samorząd Studentów UEW — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (PL/EN), hosting-ready static website for Samorząd Studentów UEW with improved UI/UX, scroll animations, and a light-blue/white palette.

**Architecture:** Multi-file static site — `index.html` as the main one-page scroll experience with anchor sections, plus five standalone subpages. All pages share `style.css` and `script.js`. No build tools, no frameworks — vanilla HTML/CSS/JS only.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid, Flexbox), Vanilla JS (IntersectionObserver, ES6+), Google Fonts (Inter/Poppins via CDN).

---

## File Map

| File | Responsibility |
|---|---|
| `style.css` | CSS variables, reset, shared components (navbar, footer, cards, buttons, forms) |
| `script.js` | i18n engine, scroll animations, mobile menu, counter animation, form validation |
| `index.html` | Main page: all 11 sections (hero → footer) |
| `aktualnosci.html` | Full news listing |
| `wydarzenia.html` | Full events calendar |
| `zarzad.html` | Full board / org structure |
| `projekty.html` | Full projects portfolio |
| `strefa-studenta.html` | Full student zone (rights, scholarships, ombudsman, law, map, contacts) |

---

### Task 1: Project scaffold & CSS foundation

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\style.css`

- [ ] **Step 1: Create `style.css` with CSS variables and reset**

```css
/* ===== VARIABLES ===== */
:root {
  --primary: #3BAEFF;
  --primary-dark: #1A8FE3;
  --primary-light: #EAF5FF;
  --bg: #FFFFFF;
  --bg-alt: #F0F7FF;
  --text: #1A2340;
  --text-muted: #6B7A99;
  --border: #D6E9FF;
  --shadow: 0 4px 24px rgba(59, 174, 255, 0.12);
  --shadow-hover: 0 8px 40px rgba(59, 174, 255, 0.22);
  --radius: 16px;
  --radius-sm: 8px;
  --transition: 0.3s ease;
  --max-width: 1200px;
  --font: 'Inter', sans-serif;
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body { font-family: var(--font); color: var(--text); background: var(--bg); line-height: 1.6; overflow-x: hidden; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

/* ===== TYPOGRAPHY ===== */
h1 { font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.1; }
h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; line-height: 1.2; }
h3 { font-size: clamp(1.1rem, 2vw, 1.4rem); font-weight: 600; }
h4 { font-size: 1rem; font-weight: 600; }
p { font-size: 1rem; color: var(--text-muted); }

/* ===== LAYOUT ===== */
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 1.5rem; }
.section { padding: 5rem 0; }
.section-alt { background: var(--bg-alt); }

/* ===== SECTION HEADER ===== */
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-header .label {
  display: inline-block; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--primary); background: var(--primary-light);
  padding: 0.3rem 1rem; border-radius: 100px; margin-bottom: 1rem;
}
.section-header h2 { color: var(--text); margin-bottom: 0.75rem; }
.section-header p { max-width: 560px; margin: 0 auto; }

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 2rem; border-radius: 100px; font-weight: 600;
  font-size: 0.95rem; transition: var(--transition); white-space: nowrap;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.btn-outline { border: 2px solid var(--primary); color: var(--primary); background: transparent; }
.btn-outline:hover { background: var(--primary); color: #fff; transform: translateY(-2px); }
.btn-sm { padding: 0.55rem 1.3rem; font-size: 0.85rem; }

/* ===== CARDS ===== */
.card {
  background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.75rem; transition: var(--transition); position: relative; overflow: hidden;
}
.card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--primary); }
.card-grid { display: grid; gap: 1.5rem; }
.card-grid-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.card-grid-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.card-grid-4 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.card-badge {
  display: inline-block; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem;
  border-radius: 100px; background: var(--primary-light); color: var(--primary); margin-bottom: 0.75rem;
}
.card-date { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.card-title { font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
.card-text { font-size: 0.9rem; color: var(--text-muted); }
.card-footer { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.card-link { font-size: 0.88rem; font-weight: 600; color: var(--primary); display: inline-flex; align-items: center; gap: 0.3rem; }
.card-link:hover { gap: 0.6rem; }

/* ===== NAVBAR ===== */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 1rem 0; transition: var(--transition);
}
.navbar.scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
.navbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.navbar-logo { display: flex; align-items: center; gap: 0.6rem; font-weight: 800; font-size: 1.1rem; color: var(--text); }
.navbar-logo .logo-icon {
  width: 38px; height: 38px; background: var(--primary); border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 1rem;
}
.navbar-links { display: flex; align-items: center; gap: 2rem; }
.navbar-links a { font-size: 0.9rem; font-weight: 500; color: var(--text); transition: var(--transition); }
.navbar-links a:hover { color: var(--primary); }
.navbar-actions { display: flex; align-items: center; gap: 1rem; }
.lang-toggle {
  display: flex; border: 1.5px solid var(--border); border-radius: 100px; overflow: hidden;
}
.lang-toggle button {
  padding: 0.3rem 0.75rem; font-size: 0.8rem; font-weight: 700; color: var(--text-muted);
  transition: var(--transition);
}
.lang-toggle button.active { background: var(--primary); color: #fff; }
.hamburger { display: none; flex-direction: column; gap: 5px; padding: 0.5rem; }
.hamburger span { display: block; width: 24px; height: 2px; background: var(--text); border-radius: 2px; transition: var(--transition); }
.mobile-menu {
  display: none; position: fixed; top: 70px; left: 0; right: 0; background: #fff;
  padding: 1.5rem; z-index: 999; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  flex-direction: column; gap: 1rem; border-bottom: 1px solid var(--border);
}
.mobile-menu a { font-size: 1rem; font-weight: 500; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
.mobile-menu.open { display: flex; }

/* ===== FOOTER ===== */
.footer { background: var(--text); color: #fff; padding: 4rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
.footer-brand p { color: rgba(255,255,255,0.6); margin-top: 1rem; font-size: 0.9rem; max-width: 280px; }
.footer-logo { display: flex; align-items: center; gap: 0.6rem; font-weight: 800; font-size: 1rem; }
.footer-logo .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; }
.footer-col h4 { color: #fff; margin-bottom: 1.25rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; }
.footer-col a { display: block; color: rgba(255,255,255,0.6); font-size: 0.9rem; margin-bottom: 0.6rem; transition: var(--transition); }
.footer-col a:hover { color: var(--primary); }
.social-links { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
.social-link {
  width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.7);
  font-size: 1rem; transition: var(--transition);
}
.social-link:hover { background: var(--primary); border-color: var(--primary); color: #fff; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; align-items: center; justify-content: space-between; }
.footer-bottom p { color: rgba(255,255,255,0.45); font-size: 0.85rem; }

/* ===== SCROLL ANIMATION ===== */
.fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-up.visible { opacity: 1; transform: none; }
.fade-up.delay-1 { transition-delay: 0.1s; }
.fade-up.delay-2 { transition-delay: 0.2s; }
.fade-up.delay-3 { transition-delay: 0.3s; }
.fade-up.delay-4 { transition-delay: 0.4s; }

/* ===== PAGE HERO (subpages) ===== */
.page-hero {
  padding: 9rem 0 4rem; background: linear-gradient(135deg, var(--primary-light) 0%, #fff 100%);
  text-align: center; position: relative; overflow: hidden;
}
.page-hero h1 { color: var(--text); margin-bottom: 1rem; }
.page-hero p { max-width: 560px; margin: 0 auto 2rem; }

/* ===== FORM ===== */
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text); }
.form-group input, .form-group textarea, .form-group select {
  width: 100%; padding: 0.85rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  font-family: var(--font); font-size: 0.95rem; color: var(--text); background: var(--bg);
  transition: var(--transition); outline: none;
}
.form-group input:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,174,255,0.15); }
.form-group textarea { resize: vertical; min-height: 130px; }
.form-error { font-size: 0.8rem; color: #e53e3e; margin-top: 0.3rem; display: none; }
.form-success { background: #e6ffed; border: 1px solid #68d391; border-radius: var(--radius-sm); padding: 1rem; text-align: center; display: none; color: #276749; font-weight: 600; }

/* ===== EVENT DATE BADGE ===== */
.event-card { display: flex; gap: 1.25rem; align-items: flex-start; }
.event-date-badge { min-width: 56px; text-align: center; background: var(--primary); color: #fff; border-radius: var(--radius-sm); padding: 0.5rem; }
.event-date-badge .day { font-size: 1.5rem; font-weight: 800; line-height: 1; }
.event-date-badge .month { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }

/* ===== STAT CARD ===== */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
.stat-card { text-align: center; padding: 2.5rem 1.5rem; background: #fff; border-radius: var(--radius); border: 1px solid var(--border); }
.stat-number { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; color: var(--primary); line-height: 1; }
.stat-label { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem; font-weight: 500; }

/* ===== AVATAR CARD ===== */
.avatar-card { text-align: center; }
.avatar-img {
  width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--primary);
  border: 3px solid var(--border);
}
.avatar-name { font-weight: 700; color: var(--text); }
.avatar-role { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }

/* ===== STUDENT ZONE ICON CARD ===== */
.zone-card { text-align: center; padding: 2rem 1.25rem; }
.zone-icon {
  width: 64px; height: 64px; border-radius: var(--radius-sm); background: var(--primary-light);
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;
  font-size: 1.75rem; transition: var(--transition);
}
.zone-card:hover .zone-icon { background: var(--primary); }
.zone-card:hover .zone-icon span { filter: brightness(10); }
.zone-card h3 { font-size: 1rem; color: var(--text); margin-bottom: 0.5rem; }

/* ===== PARTNER LOGO GRID ===== */
.partners-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.25rem; }
.partner-item {
  height: 80px; background: var(--bg-alt); border: 1px solid var(--border); border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;
  color: var(--text-muted); transition: var(--transition);
}
.partner-item:hover { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }

/* ===== SECTION CTA LINK ===== */
.section-cta { text-align: center; margin-top: 3rem; }

/* ===== CONTACT GRID ===== */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
.contact-info h3 { margin-bottom: 1.5rem; }
.contact-item { display: flex; gap: 1rem; margin-bottom: 1.25rem; align-items: flex-start; }
.contact-item-icon {
  width: 42px; height: 42px; border-radius: var(--radius-sm); background: var(--primary-light);
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 768px) {
  .navbar-links { display: none; }
  .hamburger { display: flex; }
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; gap: 0.75rem; text-align: center; }
  .section { padding: 3.5rem 0; }
  .event-card { flex-direction: column; }
}
```

- [ ] **Step 2: Verify the file is saved** — open `style.css` in a text editor, confirm it has ~250 lines and no syntax errors visible.

---

### Task 2: JavaScript engine (i18n + animations + interactions)

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\script.js`

- [ ] **Step 1: Create `script.js`**

```js
/* ===== TRANSLATIONS ===== */
const i18n = {
  pl: {
    nav_home: 'Strona główna',
    nav_news: 'Aktualności',
    nav_events: 'Wydarzenia',
    nav_board: 'Samorząd',
    nav_student: 'Strefa Studenta',
    nav_projects: 'Projekty',
    nav_contact: 'Kontakt',
    hero_label: 'Samorząd Studentów UEW',
    hero_title_1: 'Działamy dla',
    hero_title_2: 'studentów',
    hero_subtitle: 'Jesteśmy Twoją reprezentacją na Uniwersytecie Ekonomicznym we Wrocławiu. Walczymy o Twoje prawa, organizujemy wydarzenia i tworzymy społeczność.',
    hero_cta1: 'Poznaj nas',
    hero_cta2: 'Strefa Studenta',
    stats_students: 'Studentów',
    stats_projects: 'Projektów',
    stats_years: 'Lat działalności',
    stats_partners: 'Partnerów',
    news_label: 'Aktualności',
    news_title: 'Co słychać w samorządzie?',
    news_subtitle: 'Najnowsze wiadomości, ogłoszenia i relacje z wydarzeń.',
    news_see_all: 'Zobacz wszystkie aktualności',
    events_label: 'Wydarzenia',
    events_title: 'Nadchodzące wydarzenia',
    events_subtitle: 'Dołącz do naszych wydarzeń i rozwijaj się razem ze społecznością UEW.',
    events_see_all: 'Zobacz wszystkie wydarzenia',
    board_label: 'Zarząd',
    board_title: 'Poznaj nasz zespół',
    board_subtitle: 'Studenci, którzy działają na rzecz całej społeczności akademickiej.',
    board_see_all: 'Poznaj cały zarząd',
    zone_label: 'Strefa Studenta',
    zone_title: 'Wszystko, czego potrzebujesz',
    zone_subtitle: 'Twój przewodnik po życiu studenckim na UEW.',
    zone_rights: 'Prawa Studenta',
    zone_rights_desc: 'Poznaj swoje prawa i dowiedz się, jak z nich korzystać.',
    zone_scholarships: 'Stypendia',
    zone_scholarships_desc: 'Informacje o rodzajach stypendiów i jak je uzyskać.',
    zone_ombudsman: 'Rzecznik Praw Studenta',
    zone_ombudsman_desc: 'Potrzebujesz pomocy? Rzecznik jest do Twojej dyspozycji.',
    zone_law: 'Prawo dla Studenta',
    zone_law_desc: 'Przepisy i regulacje dotyczące Twojej edukacji.',
    zone_map: 'Mapa Kampusu',
    zone_map_desc: 'Znajdź swoją drogę po kampusie UEW.',
    zone_contacts: 'Władze Uczelni',
    zone_contacts_desc: 'Kontakty do rektoratu i dziekanatów.',
    projects_label: 'Nasze projekty',
    projects_title: 'To, co tworzymy',
    projects_subtitle: 'Inicjatywy edukacyjne, społeczne i integracyjne dla studentów UEW.',
    projects_see_all: 'Wszystkie projekty',
    partners_label: 'Partnerzy',
    partners_title: 'Nasi partnerzy',
    partners_subtitle: 'Firmy i organizacje, które wspierają naszą działalność.',
    contact_label: 'Kontakt',
    contact_title: 'Skontaktuj się z nami',
    contact_subtitle: 'Masz pytanie lub chcesz nawiązać współpracę? Napisz do nas!',
    contact_name: 'Imię i nazwisko',
    contact_email: 'Adres e-mail',
    contact_subject: 'Temat',
    contact_message: 'Wiadomość',
    contact_send: 'Wyślij wiadomość',
    contact_address: 'ul. Kamienna 43, 53-307 Wrocław\nBudynek J, pokój 9',
    contact_success: 'Dziękujemy! Odpiszemy wkrótce.',
    footer_desc: 'Reprezentacja wszystkich studentów Uniwersytetu Ekonomicznego we Wrocławiu.',
    footer_nav: 'Nawigacja',
    footer_student: 'Strefa Studenta',
    footer_social: 'Social media',
    footer_copy: '© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.',
    news_1_title: 'Wybory do Rady Uczelnianej 2025/2026',
    news_1_cat: 'Ogłoszenie',
    news_1_text: 'Zapraszamy wszystkich studentów do wzięcia udziału w wyborach. Głosowanie odbędzie się w dniach 10-12 czerwca.',
    news_2_title: 'Nowe miejsca parkingowe dla studentów',
    news_2_cat: 'Kampus',
    news_2_text: 'Dzięki naszym staraniom uczelnia udostępniła dodatkowe 80 miejsc parkingowych przy budynku A.',
    news_3_title: 'Wyniki ankiety satysfakcji ze studiów',
    news_3_cat: 'Raport',
    news_3_text: 'Ponad 1200 studentów wzięło udział w naszej ankiecie. Dziękujemy! Wyniki dostępne w zakładce Projekty.',
    ev_1_title: 'Juwenalia UEW 2026',
    ev_1_desc: 'Największe święto studentów Wrocławia. Koncerty, atrakcje i dobra zabawa!',
    ev_2_title: 'Dni Otwarte dla kandydatów',
    ev_2_desc: 'Pomóż nam powitać przyszłych studentów i opowiedz o życiu na UEW.',
    ev_3_title: 'Warsztaty: Jak pisać CV?',
    ev_3_desc: 'Praktyczne warsztaty z ekspertem kariery. Ilość miejsc ograniczona.',
    proj_1_title: 'Akademia Liderów',
    proj_1_cat: 'Edukacja',
    proj_1_text: 'Cykl szkoleń i warsztatów rozwijających kompetencje przywódcze studentów.',
    proj_2_title: 'UEW Pomaga',
    proj_2_cat: 'Społeczność',
    proj_2_text: 'Akcja charytatywna angażująca studentów w wolontariat i pomoc lokalnej społeczności.',
    proj_3_title: 'Integracja Pierwszoroczniaków',
    proj_3_cat: 'Integracja',
    proj_3_text: 'Program powitalny dla nowych studentów — obozy integracyjne, eventy i mentoring.',
    board_president: 'Przewodnicząca',
    board_vp: 'Wiceprzewodniczący',
    board_secretary: 'Sekretarz',
    board_treasurer: 'Skarbnik',
  },
  en: {
    nav_home: 'Home',
    nav_news: 'News',
    nav_events: 'Events',
    nav_board: 'Student Gov.',
    nav_student: 'Student Zone',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    hero_label: 'UEW Student Government',
    hero_title_1: 'Working for',
    hero_title_2: 'students',
    hero_subtitle: 'We are your representation at the University of Economics in Wrocław. We fight for your rights, organize events and build community.',
    hero_cta1: 'Learn about us',
    hero_cta2: 'Student Zone',
    stats_students: 'Students',
    stats_projects: 'Projects',
    stats_years: 'Years active',
    stats_partners: 'Partners',
    news_label: 'News',
    news_title: 'What\'s happening?',
    news_subtitle: 'Latest news, announcements and event recaps.',
    news_see_all: 'See all news',
    events_label: 'Events',
    events_title: 'Upcoming Events',
    events_subtitle: 'Join our events and grow with the UEW community.',
    events_see_all: 'See all events',
    board_label: 'Board',
    board_title: 'Meet our team',
    board_subtitle: 'Students working for the entire academic community.',
    board_see_all: 'Meet the full board',
    zone_label: 'Student Zone',
    zone_title: 'Everything you need',
    zone_subtitle: 'Your guide to student life at UEW.',
    zone_rights: 'Student Rights',
    zone_rights_desc: 'Know your rights and learn how to use them.',
    zone_scholarships: 'Scholarships',
    zone_scholarships_desc: 'Information on scholarship types and how to apply.',
    zone_ombudsman: 'Student Ombudsman',
    zone_ombudsman_desc: 'Need help? The Ombudsman is here for you.',
    zone_law: 'Law for Students',
    zone_law_desc: 'Regulations and rules relating to your education.',
    zone_map: 'Campus Map',
    zone_map_desc: 'Find your way around the UEW campus.',
    zone_contacts: 'University Authorities',
    zone_contacts_desc: 'Contacts for rector\'s and dean\'s offices.',
    projects_label: 'Our Projects',
    projects_title: 'What we create',
    projects_subtitle: 'Educational, social and integration initiatives for UEW students.',
    projects_see_all: 'All projects',
    partners_label: 'Partners',
    partners_title: 'Our Partners',
    partners_subtitle: 'Companies and organizations that support our work.',
    contact_label: 'Contact',
    contact_title: 'Get in touch',
    contact_subtitle: 'Have a question or want to collaborate? Write to us!',
    contact_name: 'Full name',
    contact_email: 'Email address',
    contact_subject: 'Subject',
    contact_message: 'Message',
    contact_send: 'Send message',
    contact_address: 'ul. Kamienna 43, 53-307 Wrocław\nBuilding J, room 9',
    contact_success: 'Thank you! We\'ll reply soon.',
    footer_desc: 'Representation of all students at the University of Economics in Wrocław.',
    footer_nav: 'Navigation',
    footer_student: 'Student Zone',
    footer_social: 'Social media',
    footer_copy: '© 2026 UEW Student Government. All rights reserved.',
    news_1_title: 'Student Council Elections 2025/2026',
    news_1_cat: 'Announcement',
    news_1_text: 'We invite all students to participate in the elections. Voting will take place June 10-12.',
    news_2_title: 'New parking spaces for students',
    news_2_cat: 'Campus',
    news_2_text: 'Thanks to our efforts, the university provided 80 additional parking spots near building A.',
    news_3_title: 'Study satisfaction survey results',
    news_3_cat: 'Report',
    news_3_text: 'Over 1,200 students participated in our survey. Thank you! Results are in the Projects tab.',
    ev_1_title: 'UEW Student Festival 2026',
    ev_1_desc: 'The biggest student celebration in Wrocław. Concerts, attractions and great fun!',
    ev_2_title: 'Open Days for prospective students',
    ev_2_desc: 'Help us welcome future students and share your UEW experience.',
    ev_3_title: 'Workshop: How to write a CV?',
    ev_3_desc: 'Practical workshop with a career expert. Limited spots available.',
    proj_1_title: 'Leaders Academy',
    proj_1_cat: 'Education',
    proj_1_text: 'A series of trainings and workshops developing students\' leadership skills.',
    proj_2_title: 'UEW Helps',
    proj_2_cat: 'Community',
    proj_2_text: 'A charity initiative engaging students in volunteering and local community support.',
    proj_3_title: 'Freshman Integration',
    proj_3_cat: 'Integration',
    proj_3_text: 'Welcome program for new students — integration camps, events and mentoring.',
    board_president: 'President',
    board_vp: 'Vice-President',
    board_secretary: 'Secretary',
    board_treasurer: 'Treasurer',
  }
};

/* ===== STATE ===== */
let currentLang = localStorage.getItem('lang') || 'pl';

/* ===== i18n ENGINE ===== */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key] !== undefined) el.textContent = i18n[lang][key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (i18n[lang][key] !== undefined) el.placeholder = i18n[lang][key];
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.dataset.i18nHref;
    if (i18n[lang][key] !== undefined) el.href = i18n[lang][key];
  });
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.counter));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const err = field.nextElementSibling;
      if (!field.value.trim()) {
        if (err && err.classList.contains('form-error')) err.style.display = 'block';
        field.style.borderColor = '#e53e3e';
        valid = false;
      } else {
        if (err && err.classList.contains('form-error')) err.style.display = 'none';
        field.style.borderColor = '';
      }
    });
    if (valid) {
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) { success.style.display = 'block'; }
    }
  });
}

/* ===== HERO TYPEWRITER ===== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = { pl: ['studentów', 'Was', 'społeczności', 'przyszłości'], en: ['students', 'you', 'community', 'the future'] };
  let i = 0;
  function next() {
    const list = words[currentLang] || words.pl;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = list[i % list.length];
      el.style.opacity = '1';
      i++;
    }, 300);
  }
  next();
  setInterval(next, 2800);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initContactForm();
  initTypewriter();
  applyLang(currentLang);
});
```

- [ ] **Step 2: Verify** — open `script.js`, confirm it has `applyLang`, `initCounters`, `initTypewriter` functions and no obvious syntax errors.

---

### Task 3: Main page — `index.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\index.html`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu">
  <title>Samorząd Studentów UEW</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <style>
    /* ===== HERO ===== */
    .hero {
      min-height: 100vh; display: flex; align-items: center; padding-top: 80px;
      background: linear-gradient(145deg, #EAF5FF 0%, #F7FBFF 50%, #fff 100%);
      position: relative; overflow: hidden;
    }
    .hero-bg-circle {
      position: absolute; border-radius: 50%; opacity: 0.18; animation: float 6s ease-in-out infinite;
    }
    .hero-bg-circle:nth-child(1) { width: 420px; height: 420px; background: var(--primary); top: -80px; right: -100px; animation-delay: 0s; }
    .hero-bg-circle:nth-child(2) { width: 260px; height: 260px; background: var(--primary-dark); bottom: 80px; right: 200px; animation-delay: 2s; }
    .hero-bg-circle:nth-child(3) { width: 160px; height: 160px; background: var(--primary); top: 200px; left: -40px; animation-delay: 4s; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
    .hero-content { position: relative; z-index: 1; max-width: 680px; }
    .hero-label { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-light); color: var(--primary); font-size: 0.8rem; font-weight: 700; padding: 0.4rem 1.1rem; border-radius: 100px; margin-bottom: 1.5rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .hero-title { margin-bottom: 1.5rem; color: var(--text); }
    .hero-title .accent { color: var(--primary); display: inline-block; }
    #typewriter { transition: opacity 0.3s ease; display: inline-block; }
    .hero-subtitle { font-size: 1.1rem; max-width: 540px; margin-bottom: 2.5rem; line-height: 1.7; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .hero-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.75rem; animation: bounce 2s infinite; }
    .hero-scroll .arrow { font-size: 1.2rem; }
    @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
  </style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo">
      <div class="logo-icon">SS</div>
      <span>Samorząd UEW</span>
    </a>
    <ul class="navbar-links">
      <li><a href="#aktualnosci" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="#wydarzenia" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="#zarzad" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="#strefa" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="#projekty" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle">
        <button data-lang="pl" class="active">PL</button>
        <button data-lang="en">EN</button>
      </div>
      <button class="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="#aktualnosci" data-i18n="nav_news">Aktualności</a>
  <a href="#wydarzenia" data-i18n="nav_events">Wydarzenia</a>
  <a href="#zarzad" data-i18n="nav_board">Samorząd</a>
  <a href="#strefa" data-i18n="nav_student">Strefa Studenta</a>
  <a href="#projekty" data-i18n="nav_projects">Projekty</a>
  <a href="#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-bg-circle"></div>
  <div class="hero-bg-circle"></div>
  <div class="hero-bg-circle"></div>
  <div class="container">
    <div class="hero-content">
      <div class="hero-label">✦ <span data-i18n="hero_label">Samorząd Studentów UEW</span></div>
      <h1 class="hero-title">
        <span data-i18n="hero_title_1">Działamy dla</span><br>
        <span class="accent" id="typewriter">studentów</span>
      </h1>
      <p class="hero-subtitle" data-i18n="hero_subtitle">Jesteśmy Twoją reprezentacją na Uniwersytecie Ekonomicznym we Wrocławiu. Walczymy o Twoje prawa, organizujemy wydarzenia i tworzymy społeczność.</p>
      <div class="hero-actions">
        <a href="#zarzad" class="btn btn-primary" data-i18n="hero_cta1">Poznaj nas</a>
        <a href="strefa-studenta.html" class="btn btn-outline" data-i18n="hero_cta2">Strefa Studenta</a>
      </div>
    </div>
  </div>
  <div class="hero-scroll"><span class="arrow">↓</span></div>
</section>

<!-- STATS -->
<section class="section section-alt">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card fade-up">
        <div class="stat-number" data-counter="5000">0</div>
        <div class="stat-label" data-i18n="stats_students">Studentów</div>
      </div>
      <div class="stat-card fade-up delay-1">
        <div class="stat-number" data-counter="18">0</div>
        <div class="stat-label" data-i18n="stats_projects">Projektów</div>
      </div>
      <div class="stat-card fade-up delay-2">
        <div class="stat-number" data-counter="32">0</div>
        <div class="stat-label" data-i18n="stats_years">Lat działalności</div>
      </div>
      <div class="stat-card fade-up delay-3">
        <div class="stat-number" data-counter="24">0</div>
        <div class="stat-label" data-i18n="stats_partners">Partnerów</div>
      </div>
    </div>
  </div>
</section>

<!-- NEWS -->
<section class="section" id="aktualnosci">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="news_label">Aktualności</div>
      <h2 data-i18n="news_title">Co słychać w samorządzie?</h2>
      <p data-i18n="news_subtitle">Najnowsze wiadomości, ogłoszenia i relacje z wydarzeń.</p>
    </div>
    <div class="card-grid card-grid-3">
      <article class="card fade-up">
        <div class="card-badge" data-i18n="news_1_cat">Ogłoszenie</div>
        <div class="card-date">5 maja 2026</div>
        <h3 class="card-title" data-i18n="news_1_title">Wybory do Rady Uczelnianej</h3>
        <p class="card-text" data-i18n="news_1_text">Zapraszamy wszystkich studentów do wzięcia udziału w wyborach.</p>
        <div class="card-footer"><a href="aktualnosci.html" class="card-link">Czytaj więcej →</a></div>
      </article>
      <article class="card fade-up delay-1">
        <div class="card-badge" data-i18n="news_2_cat">Kampus</div>
        <div class="card-date">28 kwietnia 2026</div>
        <h3 class="card-title" data-i18n="news_2_title">Nowe miejsca parkingowe</h3>
        <p class="card-text" data-i18n="news_2_text">Dzięki naszym staraniom uczelnia udostępniła dodatkowe 80 miejsc.</p>
        <div class="card-footer"><a href="aktualnosci.html" class="card-link">Czytaj więcej →</a></div>
      </article>
      <article class="card fade-up delay-2">
        <div class="card-badge" data-i18n="news_3_cat">Raport</div>
        <div class="card-date">15 kwietnia 2026</div>
        <h3 class="card-title" data-i18n="news_3_title">Wyniki ankiety satysfakcji</h3>
        <p class="card-text" data-i18n="news_3_text">Ponad 1200 studentów wzięło udział w naszej ankiecie.</p>
        <div class="card-footer"><a href="aktualnosci.html" class="card-link">Czytaj więcej →</a></div>
      </article>
    </div>
    <div class="section-cta fade-up"><a href="aktualnosci.html" class="btn btn-outline" data-i18n="news_see_all">Zobacz wszystkie aktualności</a></div>
  </div>
</section>

<!-- EVENTS -->
<section class="section section-alt" id="wydarzenia">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="events_label">Wydarzenia</div>
      <h2 data-i18n="events_title">Nadchodzące wydarzenia</h2>
      <p data-i18n="events_subtitle">Dołącz do naszych wydarzeń i rozwijaj się razem ze społecznością UEW.</p>
    </div>
    <div class="card-grid card-grid-3">
      <article class="card fade-up">
        <div class="event-card">
          <div class="event-date-badge"><div class="day">14</div><div class="month">CZE</div></div>
          <div>
            <h3 class="card-title" data-i18n="ev_1_title">Juwenalia UEW 2026</h3>
            <p class="card-text" data-i18n="ev_1_desc">Największe święto studentów Wrocławia.</p>
            <div class="card-footer"><a href="wydarzenia.html" class="card-link">Szczegóły →</a></div>
          </div>
        </div>
      </article>
      <article class="card fade-up delay-1">
        <div class="event-card">
          <div class="event-date-badge"><div class="day">21</div><div class="month">CZE</div></div>
          <div>
            <h3 class="card-title" data-i18n="ev_2_title">Dni Otwarte</h3>
            <p class="card-text" data-i18n="ev_2_desc">Pomóż nam powitać przyszłych studentów.</p>
            <div class="card-footer"><a href="wydarzenia.html" class="card-link">Szczegóły →</a></div>
          </div>
        </div>
      </article>
      <article class="card fade-up delay-2">
        <div class="event-card">
          <div class="event-date-badge"><div class="day">28</div><div class="month">CZE</div></div>
          <div>
            <h3 class="card-title" data-i18n="ev_3_title">Warsztaty: Jak pisać CV?</h3>
            <p class="card-text" data-i18n="ev_3_desc">Praktyczne warsztaty z ekspertem kariery.</p>
            <div class="card-footer"><a href="wydarzenia.html" class="card-link">Szczegóły →</a></div>
          </div>
        </div>
      </article>
    </div>
    <div class="section-cta fade-up"><a href="wydarzenia.html" class="btn btn-outline" data-i18n="events_see_all">Zobacz wszystkie wydarzenia</a></div>
  </div>
</section>

<!-- BOARD -->
<section class="section" id="zarzad">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="board_label">Zarząd</div>
      <h2 data-i18n="board_title">Poznaj nasz zespół</h2>
      <p data-i18n="board_subtitle">Studenci, którzy działają na rzecz całej społeczności akademickiej.</p>
    </div>
    <div class="card-grid card-grid-4">
      <div class="card avatar-card fade-up">
        <div class="avatar-img">👩</div>
        <div class="avatar-name">Anna Kowalska</div>
        <div class="avatar-role" data-i18n="board_president">Przewodnicząca</div>
      </div>
      <div class="card avatar-card fade-up delay-1">
        <div class="avatar-img">👨</div>
        <div class="avatar-name">Marek Wiśniewski</div>
        <div class="avatar-role" data-i18n="board_vp">Wiceprzewodniczący</div>
      </div>
      <div class="card avatar-card fade-up delay-2">
        <div class="avatar-img">👩</div>
        <div class="avatar-name">Zofia Nowak</div>
        <div class="avatar-role" data-i18n="board_secretary">Sekretarz</div>
      </div>
      <div class="card avatar-card fade-up delay-3">
        <div class="avatar-img">👨</div>
        <div class="avatar-name">Piotr Zając</div>
        <div class="avatar-role" data-i18n="board_treasurer">Skarbnik</div>
      </div>
    </div>
    <div class="section-cta fade-up"><a href="zarzad.html" class="btn btn-outline" data-i18n="board_see_all">Poznaj cały zarząd</a></div>
  </div>
</section>

<!-- STUDENT ZONE -->
<section class="section section-alt" id="strefa">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="zone_label">Strefa Studenta</div>
      <h2 data-i18n="zone_title">Wszystko, czego potrzebujesz</h2>
      <p data-i18n="zone_subtitle">Twój przewodnik po życiu studenckim na UEW.</p>
    </div>
    <div class="card-grid card-grid-3">
      <a href="strefa-studenta.html#prawa" class="card zone-card fade-up">
        <div class="zone-icon"><span>⚖️</span></div>
        <h3 data-i18n="zone_rights">Prawa Studenta</h3>
        <p class="card-text" data-i18n="zone_rights_desc">Poznaj swoje prawa i dowiedz się, jak z nich korzystać.</p>
      </a>
      <a href="strefa-studenta.html#stypendia" class="card zone-card fade-up delay-1">
        <div class="zone-icon"><span>🎓</span></div>
        <h3 data-i18n="zone_scholarships">Stypendia</h3>
        <p class="card-text" data-i18n="zone_scholarships_desc">Informacje o rodzajach stypendiów i jak je uzyskać.</p>
      </a>
      <a href="strefa-studenta.html#rzecznik" class="card zone-card fade-up delay-2">
        <div class="zone-icon"><span>🛡️</span></div>
        <h3 data-i18n="zone_ombudsman">Rzecznik Praw Studenta</h3>
        <p class="card-text" data-i18n="zone_ombudsman_desc">Potrzebujesz pomocy? Rzecznik jest do Twojej dyspozycji.</p>
      </a>
      <a href="strefa-studenta.html#prawo" class="card zone-card fade-up delay-1">
        <div class="zone-icon"><span>📋</span></div>
        <h3 data-i18n="zone_law">Prawo dla Studenta</h3>
        <p class="card-text" data-i18n="zone_law_desc">Przepisy i regulacje dotyczące Twojej edukacji.</p>
      </a>
      <a href="strefa-studenta.html#mapa" class="card zone-card fade-up delay-2">
        <div class="zone-icon"><span>🗺️</span></div>
        <h3 data-i18n="zone_map">Mapa Kampusu</h3>
        <p class="card-text" data-i18n="zone_map_desc">Znajdź swoją drogę po kampusie UEW.</p>
      </a>
      <a href="strefa-studenta.html#wladze" class="card zone-card fade-up delay-3">
        <div class="zone-icon"><span>🏛️</span></div>
        <h3 data-i18n="zone_contacts">Władze Uczelni</h3>
        <p class="card-text" data-i18n="zone_contacts_desc">Kontakty do rektoratu i dziekanatów.</p>
      </a>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section class="section" id="projekty">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="projects_label">Nasze projekty</div>
      <h2 data-i18n="projects_title">To, co tworzymy</h2>
      <p data-i18n="projects_subtitle">Inicjatywy edukacyjne, społeczne i integracyjne dla studentów UEW.</p>
    </div>
    <div class="card-grid card-grid-3">
      <article class="card fade-up">
        <div class="card-badge" data-i18n="proj_1_cat">Edukacja</div>
        <h3 class="card-title" data-i18n="proj_1_title">Akademia Liderów</h3>
        <p class="card-text" data-i18n="proj_1_text">Cykl szkoleń i warsztatów rozwijających kompetencje przywódcze studentów.</p>
        <div class="card-footer"><a href="projekty.html" class="card-link">Dowiedz się więcej →</a></div>
      </article>
      <article class="card fade-up delay-1">
        <div class="card-badge" data-i18n="proj_2_cat">Społeczność</div>
        <h3 class="card-title" data-i18n="proj_2_title">UEW Pomaga</h3>
        <p class="card-text" data-i18n="proj_2_text">Akcja charytatywna angażująca studentów w wolontariat i pomoc lokalnej społeczności.</p>
        <div class="card-footer"><a href="projekty.html" class="card-link">Dowiedz się więcej →</a></div>
      </article>
      <article class="card fade-up delay-2">
        <div class="card-badge" data-i18n="proj_3_cat">Integracja</div>
        <h3 class="card-title" data-i18n="proj_3_title">Integracja Pierwszoroczniaków</h3>
        <p class="card-text" data-i18n="proj_3_text">Program powitalny dla nowych studentów — obozy integracyjne, eventy i mentoring.</p>
        <div class="card-footer"><a href="projekty.html" class="card-link">Dowiedz się więcej →</a></div>
      </article>
    </div>
    <div class="section-cta fade-up"><a href="projekty.html" class="btn btn-outline" data-i18n="projects_see_all">Wszystkie projekty</a></div>
  </div>
</section>

<!-- PARTNERS -->
<section class="section section-alt" id="partnerzy">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="partners_label">Partnerzy</div>
      <h2 data-i18n="partners_title">Nasi partnerzy</h2>
      <p data-i18n="partners_subtitle">Firmy i organizacje, które wspierają naszą działalność.</p>
    </div>
    <div class="partners-grid fade-up">
      <div class="partner-item">Partner 1</div>
      <div class="partner-item">Partner 2</div>
      <div class="partner-item">Partner 3</div>
      <div class="partner-item">Partner 4</div>
      <div class="partner-item">Partner 5</div>
      <div class="partner-item">Partner 6</div>
      <div class="partner-item">Partner 7</div>
      <div class="partner-item">Partner 8</div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="section" id="kontakt">
  <div class="container">
    <div class="section-header fade-up">
      <div class="label" data-i18n="contact_label">Kontakt</div>
      <h2 data-i18n="contact_title">Skontaktuj się z nami</h2>
      <p data-i18n="contact_subtitle">Masz pytanie lub chcesz nawiązać współpracę? Napisz do nas!</p>
    </div>
    <div class="contact-grid">
      <div class="fade-up">
        <form id="contactForm">
          <div class="form-group">
            <label data-i18n="contact_name">Imię i nazwisko</label>
            <input type="text" required data-i18n-ph="contact_name" placeholder="Imię i nazwisko">
            <div class="form-error">To pole jest wymagane.</div>
          </div>
          <div class="form-group">
            <label data-i18n="contact_email">Adres e-mail</label>
            <input type="email" required data-i18n-ph="contact_email" placeholder="Adres e-mail">
            <div class="form-error">Podaj poprawny adres e-mail.</div>
          </div>
          <div class="form-group">
            <label data-i18n="contact_subject">Temat</label>
            <input type="text" required data-i18n-ph="contact_subject" placeholder="Temat">
            <div class="form-error">To pole jest wymagane.</div>
          </div>
          <div class="form-group">
            <label data-i18n="contact_message">Wiadomość</label>
            <textarea required data-i18n-ph="contact_message" placeholder="Wiadomość"></textarea>
            <div class="form-error">To pole jest wymagane.</div>
          </div>
          <button type="submit" class="btn btn-primary" data-i18n="contact_send">Wyślij wiadomość</button>
        </form>
        <div class="form-success" id="formSuccess" data-i18n="contact_success">Dziękujemy! Odpiszemy wkrótce.</div>
      </div>
      <div class="contact-info fade-up delay-2">
        <h3>Znajdź nas</h3>
        <div class="contact-item">
          <div class="contact-item-icon">📍</div>
          <div>
            <strong>Adres</strong>
            <p>ul. Kamienna 43, 53-307 Wrocław<br>Budynek J, pokój 9</p>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon">✉️</div>
          <div>
            <strong>E-mail</strong>
            <p><a href="mailto:kontakt@samorzad.ue.wroc.pl" style="color:var(--primary)">kontakt@samorzad.ue.wroc.pl</a></p>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon">📱</div>
          <div>
            <strong>Social media</strong>
            <p>Śledź nas na Facebooku, Instagramie, TikToku i LinkedIn.</p>
          </div>
        </div>
        <div class="social-links" style="margin-top:1.5rem">
          <a href="#" class="social-link" aria-label="Facebook">f</a>
          <a href="#" class="social-link" aria-label="Instagram">ig</a>
          <a href="#" class="social-link" aria-label="TikTok">tt</a>
          <a href="#" class="social-link" aria-label="LinkedIn">in</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></div>
        <p data-i18n="footer_desc">Reprezentacja wszystkich studentów Uniwersytetu Ekonomicznego we Wrocławiu.</p>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Facebook">f</a>
          <a href="#" class="social-link" aria-label="Instagram">ig</a>
          <a href="#" class="social-link" aria-label="TikTok">tt</a>
          <a href="#" class="social-link" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_nav">Nawigacja</h4>
        <a href="index.html" data-i18n="nav_home">Strona główna</a>
        <a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a>
        <a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a>
        <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
        <a href="#kontakt" data-i18n="nav_contact">Kontakt</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_student">Strefa Studenta</h4>
        <a href="strefa-studenta.html#prawa" data-i18n="zone_rights">Prawa Studenta</a>
        <a href="strefa-studenta.html#stypendia" data-i18n="zone_scholarships">Stypendia</a>
        <a href="strefa-studenta.html#rzecznik" data-i18n="zone_ombudsman">Rzecznik</a>
        <a href="strefa-studenta.html#mapa" data-i18n="zone_map">Mapa Kampusu</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_social">Social media</h4>
        <a href="#">Facebook</a>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
        <a href="#">LinkedIn</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <p>Wrocław, ul. Kamienna 43</p>
    </div>
  </div>
</footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open `index.html` in a browser** — verify hero renders with floating circles, navbar sticks on scroll, stats section is visible, all cards display correctly, language toggle switches text.

---

### Task 4: News subpage — `aktualnosci.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\aktualnosci.html`

- [ ] **Step 1: Create `aktualnosci.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aktualności — Samorząd UEW</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar scrolled" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></a>
    <ul class="navbar-links">
      <li><a href="index.html#aktualnosci" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="index.html#wydarzenia" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="index.html#zarzad" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="projekty.html" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle"><button data-lang="pl" class="active">PL</button><button data-lang="en">EN</button></div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="index.html#aktualnosci" data-i18n="nav_news">Aktualności</a>
  <a href="index.html#wydarzenia" data-i18n="nav_events">Wydarzenia</a>
  <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
  <a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a>
  <a href="projekty.html" data-i18n="nav_projects">Projekty</a>
  <a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<div class="page-hero">
  <div class="container">
    <div class="label" data-i18n="news_label">Aktualności</div>
    <h1 data-i18n="news_title">Co słychać w samorządzie?</h1>
    <p data-i18n="news_subtitle">Najnowsze wiadomości, ogłoszenia i relacje z wydarzeń.</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="card-grid card-grid-3">
      <article class="card fade-up"><div class="card-badge" data-i18n="news_1_cat">Ogłoszenie</div><div class="card-date">5 maja 2026</div><h3 class="card-title" data-i18n="news_1_title">Wybory do Rady Uczelnianej</h3><p class="card-text" data-i18n="news_1_text">Zapraszamy wszystkich studentów do wzięcia udziału w wyborach. Głosowanie odbędzie się w dniach 10-12 czerwca.</p></article>
      <article class="card fade-up delay-1"><div class="card-badge" data-i18n="news_2_cat">Kampus</div><div class="card-date">28 kwietnia 2026</div><h3 class="card-title" data-i18n="news_2_title">Nowe miejsca parkingowe</h3><p class="card-text" data-i18n="news_2_text">Dzięki naszym staraniom uczelnia udostępniła dodatkowe 80 miejsc parkingowych przy budynku A.</p></article>
      <article class="card fade-up delay-2"><div class="card-badge" data-i18n="news_3_cat">Raport</div><div class="card-date">15 kwietnia 2026</div><h3 class="card-title" data-i18n="news_3_title">Wyniki ankiety satysfakcji</h3><p class="card-text" data-i18n="news_3_text">Ponad 1200 studentów wzięło udział w naszej ankiecie. Dziękujemy! Wyniki dostępne w zakładce Projekty.</p></article>
      <article class="card fade-up"><div class="card-badge">Wydarzenie</div><div class="card-date">3 marca 2026</div><h3 class="card-title">Relacja: Akademia Liderów — edycja wiosenna</h3><p class="card-text">Podsumowanie drugiej edycji programu rozwojowego dla studentów UEW. Przeczytaj, co udało się osiągnąć.</p></article>
      <article class="card fade-up delay-1"><div class="card-badge">Współpraca</div><div class="card-date">20 lutego 2026</div><h3 class="card-title">Nowe partnerstwo z Wrocław Tech Hub</h3><p class="card-text">Nawiązaliśmy współpracę z jednym z największych hubów technologicznych w Polsce. Więcej praktyk i szkoleń dla Was!</p></article>
      <article class="card fade-up delay-2"><div class="card-badge">Ogłoszenie</div><div class="card-date">8 stycznia 2026</div><h3 class="card-title">Stypendia socjalne — nowe zasady 2026</h3><p class="card-text">Ministerstwo zmieniło zasady przyznawania stypendiów socjalnych. Sprawdź, co się zmieniło i jak złożyć wniosek.</p></article>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <a href="index.html" class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.3)">← Strona główna</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>
```

---

### Task 5: Events subpage — `wydarzenia.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\wydarzenia.html`

- [ ] **Step 1: Create `wydarzenia.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wydarzenia — Samorząd UEW</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar scrolled" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></a>
    <ul class="navbar-links">
      <li><a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="zarzad.html" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="projekty.html" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle"><button data-lang="pl" class="active">PL</button><button data-lang="en">EN</button></div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a>
  <a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a>
  <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
  <a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a>
  <a href="projekty.html" data-i18n="nav_projects">Projekty</a>
  <a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<div class="page-hero">
  <div class="container">
    <div class="label" data-i18n="events_label">Wydarzenia</div>
    <h1 data-i18n="events_title">Nadchodzące wydarzenia</h1>
    <p data-i18n="events_subtitle">Dołącz do naszych wydarzeń i rozwijaj się razem ze społecznością UEW.</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="card-grid card-grid-3">
      <article class="card fade-up"><div class="event-card"><div class="event-date-badge"><div class="day">14</div><div class="month">CZE</div></div><div><h3 class="card-title" data-i18n="ev_1_title">Juwenalia UEW 2026</h3><p class="card-text" data-i18n="ev_1_desc">Największe święto studentów Wrocławia. Koncerty, atrakcje i dobra zabawa!</p></div></div></article>
      <article class="card fade-up delay-1"><div class="event-card"><div class="event-date-badge"><div class="day">21</div><div class="month">CZE</div></div><div><h3 class="card-title" data-i18n="ev_2_title">Dni Otwarte</h3><p class="card-text" data-i18n="ev_2_desc">Pomóż nam powitać przyszłych studentów i opowiedz o życiu na UEW.</p></div></div></article>
      <article class="card fade-up delay-2"><div class="event-card"><div class="event-date-badge"><div class="day">28</div><div class="month">CZE</div></div><div><h3 class="card-title" data-i18n="ev_3_title">Warsztaty: Jak pisać CV?</h3><p class="card-text" data-i18n="ev_3_desc">Praktyczne warsztaty z ekspertem kariery. Ilość miejsc ograniczona.</p></div></div></article>
      <article class="card fade-up"><div class="event-card"><div class="event-date-badge"><div class="day">5</div><div class="month">LIP</div></div><div><h3 class="card-title">Piknik Integracyjny</h3><p class="card-text">Relaks na koniec roku akademickiego. Gry, jedzenie i muzyka na żywo.</p></div></div></article>
      <article class="card fade-up delay-1"><div class="event-card"><div class="event-date-badge"><div class="day">12</div><div class="month">LIP</div></div><div><h3 class="card-title">Obozy Integracyjne dla Pierwszoroczniaków</h3><p class="card-text">Tygodniowy obóz dla nowych studentów. Poznaj swoich kolegów z roku!</p></div></div></article>
      <article class="card fade-up delay-2"><div class="event-card"><div class="event-date-badge"><div class="day">20</div><div class="month">LIP</div></div><div><h3 class="card-title">Konferencja Naukowa Studentów</h3><p class="card-text">Prezentuj swoje badania i posłuchaj prelekcji studentów z całej Polski.</p></div></div></article>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <a href="index.html" class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.3)">← Strona główna</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>
```

---

### Task 6: Board subpage — `zarzad.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\zarzad.html`

- [ ] **Step 1: Create `zarzad.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zarząd — Samorząd UEW</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar scrolled" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></a>
    <ul class="navbar-links">
      <li><a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="zarzad.html" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="projekty.html" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle"><button data-lang="pl" class="active">PL</button><button data-lang="en">EN</button></div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a>
  <a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a>
  <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
  <a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a>
  <a href="projekty.html" data-i18n="nav_projects">Projekty</a>
  <a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<div class="page-hero">
  <div class="container">
    <div class="label" data-i18n="board_label">Zarząd</div>
    <h1 data-i18n="board_title">Poznaj nasz zespół</h1>
    <p data-i18n="board_subtitle">Studenci, którzy działają na rzecz całej społeczności akademickiej.</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="section-header fade-up"><h3>Zarząd Główny</h3></div>
    <div class="card-grid card-grid-4">
      <div class="card avatar-card fade-up"><div class="avatar-img">👩</div><div class="avatar-name">Anna Kowalska</div><div class="avatar-role" data-i18n="board_president">Przewodnicząca</div></div>
      <div class="card avatar-card fade-up delay-1"><div class="avatar-img">👨</div><div class="avatar-name">Marek Wiśniewski</div><div class="avatar-role" data-i18n="board_vp">Wiceprzewodniczący</div></div>
      <div class="card avatar-card fade-up delay-2"><div class="avatar-img">👩</div><div class="avatar-name">Zofia Nowak</div><div class="avatar-role" data-i18n="board_secretary">Sekretarz</div></div>
      <div class="card avatar-card fade-up delay-3"><div class="avatar-img">👨</div><div class="avatar-name">Piotr Zając</div><div class="avatar-role" data-i18n="board_treasurer">Skarbnik</div></div>
    </div>
    <div class="section-header fade-up" style="margin-top:4rem"><h3>Rada Uczelniana</h3></div>
    <div class="card-grid card-grid-4">
      <div class="card avatar-card fade-up"><div class="avatar-img">👩</div><div class="avatar-name">Marta Lewandowska</div><div class="avatar-role">Wydział Ekonomii</div></div>
      <div class="card avatar-card fade-up delay-1"><div class="avatar-img">👨</div><div class="avatar-name">Tomasz Dąbrowski</div><div class="avatar-role">Wydział Zarządzania</div></div>
      <div class="card avatar-card fade-up delay-2"><div class="avatar-img">👩</div><div class="avatar-name">Karolina Wójcik</div><div class="avatar-role">Wydział Finansów</div></div>
      <div class="card avatar-card fade-up delay-3"><div class="avatar-img">👨</div><div class="avatar-name">Bartosz Kaczmarek</div><div class="avatar-role">Wydział Informatyki</div></div>
    </div>
    <div class="section" style="padding-top:3rem">
      <div class="card fade-up" style="max-width:700px;margin:0 auto;text-align:center;padding:3rem">
        <h3>Struktura organizacyjna</h3>
        <p class="card-text" style="margin-top:1rem">Samorząd Studentów UEW składa się z Rady Uczelnianej, Zarządu, komisji tematycznych oraz filii w Jeleniej Górze. Działamy na podstawie Statutu Samorządu uchwalonego przez Radę Uczelnianą.</p>
        <div class="card-footer" style="text-align:center"><a href="index.html#kontakt" class="btn btn-primary" style="display:inline-flex">Skontaktuj się z nami</a></div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <a href="index.html" class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.3)">← Strona główna</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>
```

---

### Task 7: Projects subpage — `projekty.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\projekty.html`

- [ ] **Step 1: Create `projekty.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projekty — Samorząd UEW</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar scrolled" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></a>
    <ul class="navbar-links">
      <li><a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="zarzad.html" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="projekty.html" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle"><button data-lang="pl" class="active">PL</button><button data-lang="en">EN</button></div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a>
  <a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a>
  <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
  <a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a>
  <a href="projekty.html" data-i18n="nav_projects">Projekty</a>
  <a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<div class="page-hero">
  <div class="container">
    <div class="label" data-i18n="projects_label">Nasze projekty</div>
    <h1 data-i18n="projects_title">To, co tworzymy</h1>
    <p data-i18n="projects_subtitle">Inicjatywy edukacyjne, społeczne i integracyjne dla studentów UEW.</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="card-grid card-grid-3">
      <article class="card fade-up"><div class="card-badge" data-i18n="proj_1_cat">Edukacja</div><h3 class="card-title" data-i18n="proj_1_title">Akademia Liderów</h3><p class="card-text" data-i18n="proj_1_text">Cykl szkoleń i warsztatów rozwijających kompetencje przywódcze studentów.</p></article>
      <article class="card fade-up delay-1"><div class="card-badge" data-i18n="proj_2_cat">Społeczność</div><h3 class="card-title" data-i18n="proj_2_title">UEW Pomaga</h3><p class="card-text" data-i18n="proj_2_text">Akcja charytatywna angażująca studentów w wolontariat i pomoc lokalnej społeczności.</p></article>
      <article class="card fade-up delay-2"><div class="card-badge" data-i18n="proj_3_cat">Integracja</div><h3 class="card-title" data-i18n="proj_3_title">Integracja Pierwszoroczniaków</h3><p class="card-text" data-i18n="proj_3_text">Program powitalny dla nowych studentów — obozy integracyjne, eventy i mentoring.</p></article>
      <article class="card fade-up"><div class="card-badge">Networking</div><h3 class="card-title">Career Fair UEW</h3><p class="card-text">Targi pracy organizowane we współpracy z lokalnymi firmami i startupami.</p></article>
      <article class="card fade-up delay-1"><div class="card-badge">Kultura</div><h3 class="card-title">UEW Film Club</h3><p class="card-text">Cykliczne pokazy filmowe i dyskusje o kinematografii dla studentów.</p></article>
      <article class="card fade-up delay-2"><div class="card-badge">Sport</div><h3 class="card-title">Liga Sportowa UEW</h3><p class="card-text">Rozgrywki sportowe między wydziałami — piłka nożna, siatkówka, koszykówka.</p></article>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <a href="index.html" class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.3)">← Strona główna</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>
```

---

### Task 8: Student Zone subpage — `strefa-studenta.html`

**Files:**
- Create: `C:\Users\Mikołaj\samorzad-uew\strefa-studenta.html`

- [ ] **Step 1: Create `strefa-studenta.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strefa Studenta — Samorząd UEW</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="navbar scrolled" id="navbar">
  <div class="container navbar-inner">
    <a href="index.html" class="navbar-logo"><div class="logo-icon">SS</div><span>Samorząd UEW</span></a>
    <ul class="navbar-links">
      <li><a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a></li>
      <li><a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a></li>
      <li><a href="zarzad.html" data-i18n="nav_board">Samorząd</a></li>
      <li><a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a></li>
      <li><a href="projekty.html" data-i18n="nav_projects">Projekty</a></li>
      <li><a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="navbar-actions">
      <div class="lang-toggle"><button data-lang="pl" class="active">PL</button><button data-lang="en">EN</button></div>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="aktualnosci.html" data-i18n="nav_news">Aktualności</a>
  <a href="wydarzenia.html" data-i18n="nav_events">Wydarzenia</a>
  <a href="zarzad.html" data-i18n="nav_board">Samorząd</a>
  <a href="strefa-studenta.html" data-i18n="nav_student">Strefa Studenta</a>
  <a href="projekty.html" data-i18n="nav_projects">Projekty</a>
  <a href="index.html#kontakt" data-i18n="nav_contact">Kontakt</a>
</div>

<div class="page-hero">
  <div class="container">
    <div class="label" data-i18n="zone_label">Strefa Studenta</div>
    <h1 data-i18n="zone_title">Wszystko, czego potrzebujesz</h1>
    <p data-i18n="zone_subtitle">Twój przewodnik po życiu studenckim na UEW.</p>
  </div>
</div>

<section class="section" id="prawa">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_rights">Prawa Studenta</div><h2>⚖️ Prawa Studenta</h2></div>
    <div class="card-grid card-grid-2">
      <div class="card fade-up"><h3 class="card-title">Regulamin Studiów</h3><p class="card-text">Dokument określający zasady odbywania studiów, zaliczania przedmiotów, urlopów i skreśleń z listy studentów.</p></div>
      <div class="card fade-up delay-1"><h3 class="card-title">Odwołania i skargi</h3><p class="card-text">Masz prawo odwołać się od każdej decyzji dziekana do rektora. Samorząd pomaga w przygotowaniu dokumentów.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="stypendia">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_scholarships">Stypendia</div><h2>🎓 Stypendia</h2></div>
    <div class="card-grid card-grid-3">
      <div class="card fade-up"><h3 class="card-title">Stypendium socjalne</h3><p class="card-text">Dla studentów w trudnej sytuacji materialnej. Składasz wniosek w dziekanacie do 15 października lub 15 marca.</p></div>
      <div class="card fade-up delay-1"><h3 class="card-title">Stypendium rektora</h3><p class="card-text">Dla najlepszych studentów na podstawie wyników w nauce, osiągnięć naukowych, artystycznych lub sportowych.</p></div>
      <div class="card fade-up delay-2"><h3 class="card-title">Stypendium dla osób niepełnosprawnych</h3><p class="card-text">Przysługuje studentom z orzeczeniem o niepełnosprawności. Nie wymaga kryterium dochodowego.</p></div>
    </div>
  </div>
</section>

<section class="section" id="rzecznik">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_ombudsman">Rzecznik Praw Studenta</div><h2>🛡️ Rzecznik Praw Studenta</h2></div>
    <div class="card fade-up" style="max-width:700px;margin:0 auto;text-align:center;padding:3rem">
      <p class="card-text">Rzecznik Praw Studenta to osoba, do której możesz zwrócić się w przypadku naruszenia Twoich praw jako studenta. Działamy bezstronnie i bezpłatnie.</p>
      <div class="card-footer" style="text-align:center;margin-top:2rem"><a href="index.html#kontakt" class="btn btn-primary">Skontaktuj się z rzecznikiem</a></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="prawo">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_law">Prawo dla Studenta</div><h2>📋 Prawo dla Studenta</h2></div>
    <div class="card-grid card-grid-2">
      <div class="card fade-up"><h3 class="card-title">Ustawa Prawo o szkolnictwie wyższym</h3><p class="card-text">Podstawowy akt prawny regulujący funkcjonowanie uczelni i prawa studentów w Polsce.</p></div>
      <div class="card fade-up delay-1"><h3 class="card-title">Statut UEW i Regulaminy wewnętrzne</h3><p class="card-text">Dokumenty szczegółowo opisujące zasady funkcjonowania uczelni dostępne na stronie UEW.</p></div>
    </div>
  </div>
</section>

<section class="section" id="mapa">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_map">Mapa Kampusu</div><h2>🗺️ Mapa Kampusu UEW</h2></div>
    <div class="card fade-up" style="padding:3rem;text-align:center">
      <div style="background:var(--bg-alt);border-radius:var(--radius);padding:4rem;color:var(--text-muted);font-size:1.1rem">
        🗺️ Interaktywna mapa kampusu<br><small style="font-size:0.85rem">ul. Komandorska 118/120, Wrocław</small>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="wladze">
  <div class="container">
    <div class="section-header fade-up"><div class="label" data-i18n="zone_contacts">Władze Uczelni</div><h2>🏛️ Władze Uczelni</h2></div>
    <div class="card-grid card-grid-2">
      <div class="card fade-up"><h3 class="card-title">Władze Rektorskie</h3><p class="card-text">Rektor, Prorektorzy ds. Dydaktyki, Nauki, Studentów i Internacjonalizacji. Kontakt przez sekretariat rektoratu.</p></div>
      <div class="card fade-up delay-1"><h3 class="card-title">Władze Dziekańskie</h3><p class="card-text">Dziekani poszczególnych wydziałów. Sprawy studenckie kieruj do właściwego dziekanatu wydziału.</p></div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-bottom" style="border-top:none;padding-top:0">
      <p data-i18n="footer_copy">© 2026 Samorząd Studentów UEW. Wszelkie prawa zastrzeżone.</p>
      <a href="index.html" class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.3)">← Strona główna</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>
```

---

### Task 9: Final verification

- [ ] **Step 1: Open `index.html` in a browser and verify:**
  - Hero section renders with animated floating circles and typewriter effect
  - Stats counters animate on scroll
  - All 9 content sections visible and styled
  - Cards have hover lift effect
  - Language toggle switches all text between PL and EN
  - Mobile hamburger menu opens and closes
  - Navbar gets blur/shadow on scroll
  - Contact form validates required fields and shows success message

- [ ] **Step 2: Open each subpage and verify:**
  - `aktualnosci.html` — 6 news cards, correct page hero
  - `wydarzenia.html` — 6 event cards with date badges
  - `zarzad.html` — board + council members in two grids
  - `projekty.html` — 6 project cards
  - `strefa-studenta.html` — 6 anchored sections with content

- [ ] **Step 3: Resize to 375px width and verify:**
  - Navbar collapses to hamburger
  - All grids reflow to single column
  - Hero text remains readable
  - Buttons accessible and tappable

- [ ] **Step 4: Confirm all files are in `C:\Users\Mikołaj\samorzad-uew\`:**
  - `index.html`, `style.css`, `script.js`
  - `aktualnosci.html`, `wydarzenia.html`, `zarzad.html`, `projekty.html`, `strefa-studenta.html`
