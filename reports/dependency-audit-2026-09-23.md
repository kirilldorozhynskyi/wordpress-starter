# Dependency and starter audit — 2026-09-23

## Result

Updated Composer and both npm installations and lockfiles. DDEV is running as a WordPress project with existing settings management disabled, PHP 8.5 and
Node.js 24. Existing `.env`, salts, content and reusable commented examples were preserved. No frontend or production image build was run; DDEV rebuilt its
service images during the configuration restart.

| Check                                                           | Before                                | After                      |
| --------------------------------------------------------------- | ------------------------------------- | -------------------------- |
| Root Composer advisories                                        | 31 advisories in 4 packages           | 0                          |
| Root npm audit                                                  | 17 affected packages (16 high, 1 low) | 0                          |
| Example-theme npm audit after initial update                    | 4 high                                | 0 after transitive updates |
| Installed plugin Composer bundles with available installed.json | Separate from root audit              | 0                          |

The JSON reports beside this document preserve the findings. An advisory count is not a count of proven exploitable application paths.

## Dependencies and compatibility

- WordPress 6.9.4 → 7.1.2; local database schema upgraded and official core checksums verified.
- ACF PRO 6.8.0.1 → 6.8.10, Gravity Forms 2.9.31 → 3.1.2, Timber 2.3.3 → 2.5.1, jD Support 2.1.4 → 2.2.0, Yoast 27.4 → 28.5.
- Updated PHP transitive libraries, including Guzzle, PSR-7, Twig and PHP_CodeSniffer. Minimum PHP corrected to 8.4 for the resolved graph.
- Added and activated `justdev/syncport` from `dev-develop`, with the exact commit pinned in composer.lock. Removed obsolete WP Sync DB / media packages and
  unused VCS repositories.
- Vite 8.3, Vue 3.5, PrimeVue 5, Tailwind 4.3, ESLint 10 flat config. Removed the obsolete Airbnb configuration and duplicate PrimeVue theme package; both
  rendering paths now use `@primeuix/themes`.
- Kept Inertia at 2.3.28 and VueUse at 13.9 to satisfy the installed evo-mark bridge's peer contract. The initially edited Inertia 3 / VueUse 15 requirements
  conflicted with that bridge. TypeScript is 6.0 because the current TypeScript ESLint parser requires <6.1. No forced peer resolution was used.
- Added PM2, which existing SSR scripts referenced but did not install. A scoped PM2 override selects patched js-yaml >=4.3.2, because PM2's own pinned version
  remained vulnerable.
- Kept the reusable `template` theme; updated its separate dependency graph. This is not the active theme and its old application paths are not certified for
  activation.

## Removed Media Cloud

`ilab/ilab-media-tools` 4.6.4 ships 112 prefixed third-party packages outside root Composer. Normalizing the `mcloud-` package prefix for comparison produced
**53 advisories across 19 upstream packages**. This version mapping does not prove that each issue is reachable or that a fork has no backports.

No newer release was available from the configured Composer repositories. The local database had two attachments and no Media Cloud storage metadata; source
code did not call its API. The unused plugin was deactivated and removed from Composer. Database settings and media were retained.
`mediacloud-bundled-audit.json` records the removed version, not current installed vulnerabilities.

## Reused from balabenka and hardened

- Syncport integration, without copying remote connections or credentials.
- Reusable `jdev_link` ACF field: stable link-array shape, translated internal page IDs, title fallback. Added query-string preservation, plain-text title
  rendering and unsafe URL rejection during the port. Existing field groups were not rewritten.
- The reference cache helper was compared, but not copied wholesale: the starter already had better transient cleanup. Fixed its actual group mismatch and
  bypassed persistent caching for authenticated, preview and query-filtered requests.
- Did not copy client-specific RealPad/financial content, multiple competing cache/SMTP plugins, premium download URLs, or MCP administration endpoints.

## Other fixes

- Composer installation no longer invokes initial setup or changes `.env`/salts. `composer setup` is explicit.
- Core sync is repeatable, retains Composer's installed core directory and skips user content/configuration; Docker uses the same script.
- Salt generation uses `random_bytes`, replaces existing keys instead of appending duplicates, and `.env.template` contains no shared salts. Existing
  credentials were not rotated.
- PUC compatibility resolves the installed major-version factory instead of hard-coding v5p6, fixing the fatal error after upgrading to v5p7.
- Limited anonymous news queries to 100 posts and made malformed term input safe.
- Restricted Vite CORS to local hosts and the configured application origin.
- Removed a client-specific CDN default; configured through optional `VITE_CDN_BASE` instead.
- Mobile navigation exposes expanded/controls state, hides closed links from keyboard navigation, closes on Escape and releases scroll handling on unmount.
- Development notices are logged rather than inserted into HTML/JSON responses by default.

## Verification and limits

Passed: active-theme ESLint, Vue/TypeScript checking, focused Prettier checks, PHP syntax checks, Composer validation/platform checks, repeated Composer install
with unchanged `.env`, WordPress core checksums, browser page navigation without console errors, mobile-menu open/Escape, and `scripts/checks/starter.php`
(plugin loading, link round-trip/unsafe scheme, news limit and Gravity Forms data access).

Syncport's unsigned handshake returns HTTP 401 (`syncport_missing_signature`). No remote connection or migration was executed. Form reading was exercised; live
email submission and remote storage were not.

WordPress.org plugin checksum checks cannot verify premium/private packages without published checksums. Yoast's Composer distribution adds `composer.json`
relative to WordPress.org, so the aggregate checksum command reports a mismatch; this is not treated as a clean all-plugin checksum result. Media Cloud also had
distribution mismatches before removal.

The upstream WP Vite distribution includes its own stale nested lockfile warning on install; its installed PUC bundle audit reports no known advisory. WP-CLI
emits PHP 8.5 deprecation notices. Neither issue was hidden by changing vendor code.

The full Wordfence scanner feed requires authentication (HTTP 401). Public vendor release notes were checked for ACF and Gravity Forms, but no authenticated
exhaustive WordPress vulnerability scan or penetration test was performed. Zero registry advisories is not a guarantee that custom/private plugin code has no
vulnerabilities.

Production client and SSR bundles remain from the previous build by request. Rebuild and check production/SSR behavior explicitly before deployment; these
results cover development mode and the listed static/runtime checks.

## Vendor references

- [ACF 6.8.10 security release](https://www.advancedcustomfields.com/blog/acf-6-8-10-security-release/)
- [Gravity Forms changelog](https://docs.gravityforms.com/gravityforms-change-log/)
- [ESLint flat-config migration](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Vite migration guide](https://vite.dev/guide/migration)
