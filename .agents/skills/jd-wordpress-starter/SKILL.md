---
name: jd-wordpress-starter
description:
    Work in the jD WordPress + Inertia starter or an uncustomized project created from it. Use for theme PHP and Vue changes, ACF blocks, Gravity Forms, Vite
    and SSR, animation directives, dependency updates, and local setup.
---

# jD WordPress starter

Check the repository's `AGENTS.md` and project skills. Follow a derived project's own conventions for its design, content and integrations. Read
[the starter architecture](references/architecture.md) when working from the starter's defaults. Resolve paths in the current checkout before using that map in
a derived project.

## Use CodeGraph

If `.codegraph/` exists at the repository root, run `codegraph sync` when the index may be stale. Query `codegraph_explore` with the absolute repository
`projectPath` before searching for or reading code. Use `codegraph explore "<symbols or paths>"` at the root if MCP is unavailable. Batch edits, then sync
before querying the changed code and before handoff. Use targeted file reads for unsupported formats such as ACF JSON, CSS tokens and lockfiles. Keep the index
local and share `codegraph.json`. Projects without `.codegraph/` use ordinary source discovery until the user initializes an index.

## Work on the starter

- Follow WordPress template or REST route → controller/model → Inertia props or JSON → Vue consumer. Keep page names and persisted ACF keys stable.
- Reuse the shared layout, media, button, icon and form components. Use the theme's Tailwind CSS variables and utilities for repeatable styles.
- When implementing design motion, read [Animation directives](references/animation-directives.md) for the starter's Vue examples and binding options.
- Keep editable copy and media in WordPress. Align ACF JSON, the public field list, `acf_fc_layout` resolution and the Vue block when implementing a new layout.
- Preserve deterministic initial server and client rendering. Defer browser side effects until mount and dispose them on unmount.
- On dependency upgrades, verify the latest compatible release of each direct package, update the lower version bounds in `composer.json` and `package.json`,
  and regenerate both lockfiles. Verify the Inertia client against the WordPress bridge in `InertiaRequest.php` and the MU plugin when upgrading the protocol.
- Preserve existing `<pre>` markup and content. Verify with focused lint, typecheck, frontend tests and DDEV smoke checks as relevant. Skip builds. Run
  `sh scripts/checks/public-paths.sh <site-url>` after changes to Apache or Nginx routing.

For an approved design in a derived project, use `$jd-project-skill-from-design` to record its specific frontend and content conventions.
