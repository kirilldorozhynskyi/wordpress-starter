# Frontend review — 2026-09-23

Compared the active Inertia theme with Balabenka's form, field, navigation and utility patterns. Implementation scope: form components, request/data modules, shared link classification, ACF component resolution, and PrimeVue setup. Existing reusable comments and `<pre>` blocks were retained.

## Fixed

- Form logic extracted into typed feature modules and an HTTP service; public GForm id and field v-model contracts retained.
- Visible retry and submission errors, positive `is_valid` check, cancelled stale requests, duplicate-submit protection, and lifecycle cleanup.
- Working date input, real GF date serialization, consent sub-inputs, checkbox IDs, single File serialization, zero values and hidden defaults.
- Conditional rules shared by rendering and submission instead of being local to MultiChoice only.
- Connected error messages, unique IDs for repeated forms, labelled groups, disabled fieldset during submission, focus on error/success and named file removal.
- Removed project-specific input_13 injection and DOM-based consent lookup.
- Fixed native date label overlap, undefined button/colour classes and missing gold palette tokens. Theme uses Aura amber primitives with explicit Tailwind layer order.
- Ported deterministic link classification from Balabenka using the starter's server-provided wp.homeUrl. Protocol links, anchors and new-tab links remain native.
- ACF layout resolution tolerates missing/empty names and uses a fallback key when no explicit key exists.
- PrimeVue 5.0.1 and themes 3.0.1 produced a missing-license notice in a real browser. Replaced with MIT PrimeVue 4.5.5 and themes 2.0.3; no runtime license warning remains. This supersedes the earlier dependency report's PrimeVue 5 choice.

## Verification

- 10 Node tests passed: GF payloads, HTTP failures, validation failure returned with HTTP 200, duplicate submission, stale request cancellation, disposal, and SSR-safe link classification.
- ESLint, vue-tsc and git diff --check passed.
- Full client + SSR build passed with no warnings. Generated artifacts refreshed for Dokploy.
- npm audit: 0 known vulnerabilities.
- Browser fixture rendered two independent forms with no duplicate IDs. Tested conditional phone field, consent, server validation error and focus, success status and focus. Desktop visual review caught and resolved date/button styling defects. Clean reload produced no console warnings/errors.
- Production asset navigation between local home and test pages worked without console errors. The local WordPress test form contains only one text field, so broader cases were exercised with an isolated fixture.

No production submission, email delivery or database change was performed. Multi-page/payment/CAPTCHA/compound-address and multi-file workflows are outside the implemented field set. Detailed architecture, supported fields and repeatable checks: `docs/frontend-structure.md`.
