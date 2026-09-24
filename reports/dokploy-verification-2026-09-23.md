# Dokploy and production build verification — 2026-09-23

## Changes

- Added `compose.dokploy.yml`, MariaDB and uploads volumes, environment example and `docs/dokploy.md`.
- Multi-stage PHP 8.5 / Node 24 image installs locked Composer dependencies using a BuildKit secret. It consumes committed client/SSR assets.
- Apache routing works without local `.htaccess`; private application paths are denied. Healthcheck probes Apache and SSR.
- Container environment controls Inertia SSR settings without database mutations. Entrypoint supervises both processes; explicit SIGTERM overrides the Apache base image's SIGWINCH.
- Fixed `.dockerignore` to retain root MU-plugin PHP files while excluding Composer-managed plugin directories. A clean image initially returned HTTP 500 without the compatibility MU-plugin; rebuilding with this fix returned HTTP 200.
- WP Vite uses the root Composer autoloader instead of installing an obsolete nested dependency graph.
- Resolved Vite static/dynamic import warnings: SSR resolves PrimeVue to its server implementation, and flexible-content discovery excludes the statically imported PageHero. Browser event registration occurs on mount with unmount cleanup.

## Verification

- `npm run build`: client and SSR successful, no warnings or deprecations in build output.
- ESLint and `vue-tsc --noEmit`: passed. PHP syntax and entrypoint shell syntax: passed.
- Docker Compose configuration validation and real image build: passed. Tested locally on Docker ARM64, using a disposable copy of the DDEV database and independent volumes.
- Production `/` and `/test/`: HTTP 200, rendered content inside `#app`, no Vite dev-server URL. Referenced generated assets returned HTTP 200.
- `/healthz`: HTTP 200; combined Apache/SSR healthcheck passed.
- `.env`, Composer manifest, Compose YAML, vendor autoloader and private SSR bundle: HTTP 403.
- Runtime contains neither local `.env` nor `auth.json`; COMPOSER_AUTH is absent from runtime environment.
- Terminating Node SSR caused one automatic container restart; health recovered and the home page returned HTTP 200.
- Final image: home HTTP 200 and healthcheck passed; Compose stop completed in under one second with exit code 0 after the SIGTERM correction.
- Composer and root npm audits: no known vulnerability advisories.

## Scope

No remote Dokploy deployment was performed. Domain, HTTPS routing, production database/uploads migration, SMTP delivery and production credentials require configuration on the destination. Browser hydration and amd64 execution were not re-tested in this Docker check. Dependency audit results do not constitute a complete penetration test or container OS vulnerability scan.

This follow-up supersedes the earlier SSR-only build scope: the complete client + SSR production build has now been verified.
