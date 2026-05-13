# Testing Patterns

**Analysis Date:** 2026-05-13

## Test Framework

**Status:** No automated testing framework present

**Why:** This is a static HTML/CSS/JavaScript website with client-side functionality only. No build pipeline, no package.json, no test runner configured (Jest, Vitest, Mocha not present).

**Current Testing Approach:** Manual browser testing only

## What Cannot Be Tested Automatically

Due to the architecture, the following areas lack test coverage:

1. **Translation system** (`i18n` object in `script.js` lines 2-195)
   - No unit tests for `applyLang()` function
   - No tests verifying all translation keys are present in both languages
   - No tests for language persistence to localStorage

2. **Form validation** (`script.js` lines 353-398)
   - Manual testing only for required field validation
   - Email regex validation not tested: `.match(/.+@.+\..+/)`
   - No tests for edge cases (spaces-only input, malformed emails)
   - No tests for success state transitions (form hiding, message showing)

3. **Animations and scroll interactions** (`script.js` lines 284-301, 329-347)
   - Scroll-triggered fade animations not tested
   - Counter animations not unit tested
   - IntersectionObserver behavior not verified
   - Animation easing function (`cubicEaseOut` at line 308) has no tests

4. **Navigation and UI interactions** (`script.js` lines 242-281)
   - Hamburger menu toggle not tested
   - Mobile menu close on link click not tested
   - Navbar scroll state (`navbar.scrolled` class) not tested
   - Language toggle button state not tested

5. **Typewriter effect** (`script.js` lines 401-439)
   - Word cycling logic not tested
   - Opacity transition timing not tested
   - Language switching effect on typewriter not tested

## Manual Testing Areas

**Browser testing checklist (manual):**

1. **Translation (i18n)**
   - Switch between Polish and English languages
   - Verify all visible text updates
   - Check localStorage persistence (language selection survives page reload)
   - Test that language is applied on page load

2. **Responsive Design**
   - Test on mobile (< 768px): hamburger menu appears
   - Test on tablet (768px - 1024px): footer grid changes
   - Test on desktop (> 1024px): full navbar visible
   - Verify responsive grid layouts (`card-grid-3`, `card-grid-4`)

3. **Form Validation**
   - Submit empty form - error messages appear, border highlights red
   - Enter name and subject only - email error shows
   - Enter invalid email - error shows (test: `test`, `test@`, `test@domain`)
   - Enter valid form - success message shows, form hides
   - Verify error messages use `#d32f2f` (red) border color

4. **Scroll Animations**
   - Scroll down page - cards fade in with `.fade-up` animation
   - Check animation delays work: `.delay-1`, `.delay-2`, `.delay-3`
   - Verify counters animate from 0 to target (5000, 18, 32, 24)
   - Test IntersectionObserver threshold at 0.12 (cards trigger at 12% visibility)

5. **Navigation**
   - Mobile: hamburger click toggles menu open/closed
   - Mobile: clicking menu link closes menu
   - Desktop: navbar links navigate correctly
   - Scrolling navbar - verify `.scrolled` class applied at `window.scrollY > 0`
   - Language buttons toggle active state

6. **Typewriter Effect**
   - Verify "Działamy dla" text cycles through words every 2.8 seconds
   - Polish words: `['studentów', 'reprezentacji', 'zmian', 'społeczności']`
   - English words: `['students', 'representation', 'change', 'community']`
   - Verify 300ms fade transition between words
   - Test that word list updates when language changes

## Testing Recommendations

**If automated testing is required in future:**

### 1. Add Test Framework
```bash
npm install --save-dev vitest jsdom
```

### 2. Create test files
- `script.test.js` - test all functions in `script.js`
- `i18n.test.js` - test translation object completeness
- `animations.test.js` - test easing functions and animation logic

### 3. Priority tests (high-value, low-effort)
```javascript
// Example test structure (Vitest)
describe('applyLang', () => {
  it('should update all [data-i18n] elements', () => {
    // Mock DOM
    // Call applyLang('en')
    // Assert text content changed
  });
  
  it('should persist language to localStorage', () => {
    applyLang('en');
    expect(localStorage.getItem('lang')).toBe('en');
  });
});

describe('animateCounter', () => {
  it('should animate from 0 to target value', () => {
    // Create mock element
    // Call animateCounter
    // Use requestAnimationFrame mock to test final value
  });
});

describe('Form validation', () => {
  it('should reject empty required fields', () => {
    // Fill partial form
    // Submit
    // Assert error display
  });
  
  it('should validate email format', () => {
    const validEmails = ['test@example.com', 'user+tag@domain.co.uk'];
    const invalidEmails = ['test', 'test@', '@domain.com'];
    // Test each with current regex
  });
});
```

### 4. Coverage targets
- At minimum: form validation (high user impact)
- Second priority: i18n system (data completeness)
- Nice-to-have: animations (visual/nice-to-have, hard to test)

## Current Testing Limitations

1. **No regression tests** - Changes to HTML structure or CSS could break layouts without detection
2. **No accessibility tests** - ARIA labels exist (e.g., `aria-label="Menu"`) but no automated a11y testing
3. **No visual regression** - No screenshot testing for animation/styling changes
4. **No E2E tests** - No Cypress/Playwright tests for full user workflows
5. **No performance tests** - No metrics for animation smoothness, load times

## Test Data & Fixtures

**Fake/Mock Data (used in HTML):**
- `style.css` lines 1-22: CSS variables with test values
- `script.js` line 406-409: wordLists for typewriter effect (Polish and English)
- `index.html` lines 100-115: Counter data attributes (`data-counter="5000"`, etc.)
- Static test content in multiple HTML files (cards, articles, etc.)

**No fixture/factory pattern used** - Data is hardcoded in HTML/JavaScript

## Browser Compatibility Testing

**Required manual testing on:**
- Chrome/Edge (Chromium-based): Primary target
- Firefox: Secondary
- Safari: Mobile focus
- Mobile browsers: iOS Safari, Chrome Android

**Known potential issues:**
- `IntersectionObserver` API used (IE11 not supported)
- CSS `clamp()` used (IE11 not supported)
- `localStorage` used (IE9+)
- CSS Grid and Flexbox used (IE10+ with limitations)

## Accessibility Testing (Manual)

**Areas to test manually:**
- Keyboard navigation: Tab through navbar, buttons, form fields
- Screen reader: Test with NVDA/JAWS on Windows
- Focus indicators: Buttons have outline on focus (line 65: `.btn-primary:focus, .btn-outline:focus`)
- Color contrast: Text vs background meets WCAG AA (verify `--text` on `--bg`)
- Form labels: Associated correctly (line 162: `<label>` paired with input)

---

*Testing analysis: 2026-05-13*
