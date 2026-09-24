# jD WordPress starter

WordPress + Inertia + Vue 3 + Tailwind CSS, with Vite and an optional SSR process. The active theme is `wp-content/themes/inertia`. The `template` theme remains
a reusable example with its own npm lockfile.

## Requirements

- DDEV with PHP 8.5 / MariaDB 11.8 (Composer dependencies require PHP 8.4+).
- Node.js 24 (`nvm use`) and npm. DDEV also uses Node.js 24.
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
configure the environment and generate unique salts, then restart DDEV if its name changed. Ordinary `composer install` preserves `.env` and authentication
salts.

Open https://wordpress-starter.ddev.site. Vite runs on the host at https://localhost:5173. The existing `.env` selects environment URLs and database
credentials. `VITE_CDN_BASE` is optional; leaving it empty preserves original image URLs.

Syncport replaces WP Sync DB and its media add-on. Configure remote connections in WordPress when needed; installation does not enable remote push/pull or run a
migration. Media Cloud is no longer a default dependency. Its old database settings are retained, but it should not be restored without reviewing its bundled
libraries.

`inertia` is the only installed theme. Its PHP classes, including page metadata helpers, use the `InertiaTheme` namespace.

## Checks without a build

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

`npm run build` produces client and SSR assets. Run it explicitly before deployment after dependency changes; the dependency audit does not rebuild committed
artifacts. `npm run ssr`, `ssr:stop`, and `ssr:restart` use the locally installed PM2 and require WP-CLI. The Docker image expects committed client/SSR
artifacts and uses the same WordPress core synchronization script as Composer.

For Dokploy, use `compose.dokploy.yml`. See [deployment instructions](docs/dokploy.md) for environment variables, build secrets, domains, persistent volumes, and migration.

Frontend structure, supported form fields and isolated UI checks: [frontend guide](docs/frontend-structure.md). Run `npm run test:frontend` for regression tests.

Release notes: [4.3.0](docs/releases/4.3.0.md).
