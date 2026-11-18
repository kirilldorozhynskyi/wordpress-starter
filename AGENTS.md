# jD WordPress starter

Preserve existing `<pre>` elements and their content. Work without a build. Use `npm run lint`, `npm run typecheck`, `npm run test:frontend`, and focused PHP or
DDEV checks as relevant. Keep generated Vite client and SSR artifacts out of source edits.

## CodeGraph

When `.codegraph/` exists at the repository root, run `codegraph sync` if the index may be stale. Use `codegraph_explore` with the absolute repository path
before searching or reading code. The CLI fallback is `codegraph explore "<question or symbols>"`. Use targeted source reads for gaps and unsupported formats.
Sync after code edits before relying on the changed index and at handoff. Without `.codegraph/`, use ordinary discovery and leave initialization to the user.

## Repository skills

- Use `$jd-wordpress-starter` for the shared architecture, theme, tooling and dependency workflow.
- Use `$jd-project-skill-from-design` in a derived project to create or update its own frontend conventions from the actual repository and approved design.
