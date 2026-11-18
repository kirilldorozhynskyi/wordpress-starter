# jD WordPress starter

WordPress + Inertia + Vue 3 + Tailwind CSS, with Vite and an optional SSR process. The active theme is `wp-content/themes/inertia`.

## Deploy on a regular server

Use the [server installation guide](docs/server.md) for Apache or Nginx with PHP-FPM. It includes the protected virtual host templates and optional native SSR.
Dokploy and Docker are documented separately.

## Local development requirements

- DDEV with PHP 8.5 / MariaDB 11.8 (Composer dependencies require PHP 8.4.1+).
- Node.js 26 LTS (26.13.1 or newer within 26.x) and npm. With nvm, run `nvm install` and `nvm use` in the repository. DDEV and Docker also use Node.js 26.
- Composer 2; SSH access to the configured private repositories and ACF PRO Composer credentials.

## Local development

```sh
ddev start
ddev auth ssh
ddev composer install
npm ci
npm run dev
```

Configure ACF authentication in Composer's external auth configuration; never commit credentials. For a fresh clone without `.env`, run `ddev composer setup` to
choose a project slug and configure the environment, then restart DDEV if its name changed. The setup only fills missing salts. Ordinary `composer install`
preserves `.env` and authentication salts.

Open the project URL from `ddev describe`. The starter defaults to https://wordpress-starter.ddev.site. Vite starts at `https://localhost:5173` and tries the next
available port if needed. WordPress reads the selected URL from `hot`. The existing `.env` selects environment URLs and database credentials. `VITE_CDN_BASE` is
optional; leaving it empty preserves original image URLs.

Syncport replaces WP Sync DB and its media add-on. Configure remote connections in WordPress when needed; installation does not enable remote push/pull or run a
migration. Media Cloud is no longer a default dependency. Its old database settings are retained, but it should not be restored without reviewing its bundled
libraries.

## Create a project from the starter

Clone or create the project from the starter, run Composer setup if needed, and install the frontend dependencies with `npm ci`. Composer setup leaves Git
initialization and the first commit to the project owner.

The repo includes two Codex skills:

- [jD WordPress Starter](.agents/skills/jd-wordpress-starter/SKILL.md) maps the theme, frontend, CMS data and verification workflow.
- [Project Skill from Design](.agents/skills/jd-project-skill-from-design/SKILL.md) creates or updates the derived project's own conventions in
  `.agents/skills/<project-slug>-frontend-conventions/` from its approved Figma nodes or design assets and actual source. It records design-system mappings,
  existing component patterns and content sources. Ask Codex “Use $jd-project-skill-from-design to create this project's frontend conventions from the approved
  design and the current theme.”

`codegraph.json` is shared across checkouts. If a local CodeGraph index exists, repository skills use it to trace code and run `codegraph sync` after source
edits. CSS, JSON schemas and lockfiles can be read directly when the graph lacks the information needed.

## Checks without a build

Run the project suite with DDEV running, the starter plugins activated, and the existing production assets served with SSR. Stop the Vite dev server for the SSR
checks. Install the Playwright browser once, then run the suite from the project root.

```sh
npm ci
npx playwright install chromium
npm run test:project
```

`test:project` runs lint, type checking, frontend regressions, WordPress and Gravity Forms integration checks, public-path checks, and Chromium tests. The site
checks exercise SSR HTML, hydration, Inertia navigation, SEO, search, 404 and REST. Set `E2E_BASE_URL` if the DDEV domain differs from the starter default.

`npm run test:forms` runs the frontend regressions, the Gravity Forms integration check and the isolated browser form tests. The integration check creates a
temporary form in the development database, verifies one accepted entry, and removes both. Email is disabled for that process. The browser tests intercept
requests on a local fixture and cover loading, validation, conditional fields, file uploads and multiple form instances. Run `npm run test:e2e -- --project=forms`
to run the browser portion without WordPress.

Use these commands for individual checks.

```sh
npm run lint
npm run typecheck
npm audit
ddev composer validate --no-check-publish
ddev composer audit
ddev composer check-platform-reqs
ddev wp eval-file scripts/checks/starter.php
ddev wp core verify-checksums
```

`npm run format:check` checks the whole active theme; use Prettier on changed files to avoid unrelated formatting changes. The security and upgrade report is in
`reports/dependency-audit-2026-09-23.md`.

## Production assets and SSR

`npm run build` produces the client assets in `resources/Public/Build` and the SSR output in `resources/Private/.vite/ssr` under the active theme.
Keep both generated directories out of starter commits. Run `npm ci` and `npm run build` locally or in CI, then deploy the outputs with the matching code.
`npm run ssr`, `ssr:stop`, and `ssr:restart` use the locally installed PM2 to run Node directly. Docker builds the frontend outputs from source when creating
the site image.

Set `VITE_PRIMEUI_LICENSE` in the project-root `.env` or in the build environment before building a site with PrimeVue 5. Vite includes the value in the
compiled client and SSR assets. Build again when changing the key.

For Dokploy, use `compose.dokploy.yml`. See [deployment instructions](docs/dokploy.md) for environment variables, build secrets, domains, persistent volumes,
and migration.

Frontend structure, supported form fields and isolated UI checks: [frontend guide](docs/frontend-structure.md). Run `npm run test:frontend` for regression
tests.

Release notes for [4.4.0](docs/releases/4.4.0.md) and [4.3.0](docs/releases/4.3.0.md).
