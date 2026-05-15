---
phase: 01-bug-fixes-and-css-foundation
plan: 01
subsystem: contact-form, typewriter, i18n
tags: [bug-fix, netlify-forms, typewriter, i18n, accessibility]
dependency_graph:
  requires: []
  provides: [netlify-forms-integration, contact-form-submission, typewriter-lang-switch, dismiss-behavior]
  affects: [index.html, script.js]
tech_stack:
  added: []
  patterns: [Netlify Forms POST, async fetch, auto-dismiss timeout, honeypot spam prevention]
key_files:
  created: []
  modified:
    - index.html
    - script.js
decisions:
  - "Honeypot p tag uses inline style=display:none — functional, not cosmetic; exempt from FOUND-01 cleanup"
  - "Auto-dismiss after 6s with clearTimeout on manual dismiss to prevent race condition"
  - "initTypewriter() called at end of applyLang() so language switch immediately resets interval and word list"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-15"
  tasks_completed: 2
  files_modified: 2
---

# Phase 1 Plan 1: Contact Form Bug Fixes and Typewriter Re-init Summary

**One-liner:** Fixed three bugs: Netlify Forms wiring with real fetch() POST submission, 6s auto-dismiss + manual dismiss on success, and typewriter re-initialisation on language switch.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Wire index.html form for Netlify Forms detection | 181f3a5 | index.html |
| 2 | Replace fake-submit with real fetch() and add typewriter re-init + dismiss logic | 26a3beb | script.js |

## What Was Built

### Task 1 — index.html

- `<form>` tag now has `name="contact"`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"` — required for Netlify build-bot to register the form
- Hidden `<input name="form-name" value="contact">` provides the form name to Netlify in the POST body
- Honeypot `<p style="display:none"><input name="bot-field"></p>` provides spam protection
- All four form inputs and textarea now have `id` and `name` attributes (`contact-name`, `contact-email`, `contact-subject`, `contact-message`)
- All four `<label>` elements now have matching `for=` attributes for accessibility
- `#formSuccess` div replaced with `role="alert"` version containing a dismiss `<button id="formSuccessDismiss">` and initial `style="display:none"` (hidden on load)

### Task 2 — script.js

- **BUG-01:** `initContactForm()` submit handler rewritten as `async`. On valid form data, sends real `fetch('/', { method: 'POST', ... URLSearchParams(new FormData(form)) })` to Netlify Forms endpoint
- **BUG-03:** `initTypewriter()` called at end of `applyLang()` — clears old interval and restarts with correct language word list immediately on language switch
- **BUG-04:** After submit, 6-second `setTimeout` auto-hides success and restores form. `formSuccessDismiss` onclick clears the timeout before hiding — prevents race condition. Both restore `form.style.display = 'block'`
- `contact_dismiss` key added to both `pl` (`'Zamknij'`) and `en` (`'Close'`) i18n objects

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `#formSuccess` dismiss button has `style="margin-top:1rem"` inline — marked with `<!-- FOUND-01: extract to .form-success and .form-success__dismiss -->` comment in index.html for extraction in Plan 03.

## Self-Check: PASSED
