# SSR verification — 2026-09-23

Follow-up verification explicitly authorized after the dependency audit.

- `npx vite build --ssr`: passed.
- Started the emitted `wp-content/themes/inertia/resources/Private/.vite/ssr/ssr.mjs` on a temporary port with Node.js 24.
- POSTed real current WordPress page payloads to `/render`; checked nonempty HTML and the head array.
- Runtime log contains only successful server startup, with no warnings or errors. The temporary server was stopped after verification.

- `/`: HTTP 200, component `Home`, 9378 HTML bytes, 1 head tag.
- `/test/`: HTTP 200, component `Home`, 8968 HTML bytes, 1 head tag.

Vite reports nonblocking ineffective dynamic imports for PrimeVue config/themes and PageHero: these modules are also imported statically, so those dynamic imports cannot create separate chunks.

Only SSR artifacts were rebuilt. The client production bundle was not rebuilt, and production browser hydration / the persistent PM2-to-WordPress integration were not exercised by this check. Before deployment, rebuild both client and server together with `npm run build`.
