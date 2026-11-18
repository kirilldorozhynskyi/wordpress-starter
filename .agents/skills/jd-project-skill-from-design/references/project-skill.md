# Project skill structure

Use this structure, inspired by Hinohara's design handoff. Include references as evidence becomes available.

```text
.agents/skills/<project-slug>-frontend-conventions/
  SKILL.md
  agents/openai.yaml
  references/original-patterns.md
  references/design-system.md
  references/content-sources.md
```

- **SKILL.md** names the actual project and identifies when to use the skill. Summarize its reusable implementation rules, theme paths, CodeGraph workflow and
  checks. Reference the relevant source document for each kind of work.
- **original-patterns.md** identifies actual source files and examples of the project's layout, component, styling, responsive, accessibility and media
  patterns. Point to a verified baseline only if the project uses one. Include ACF layout and Inertia page resolution where relevant.
- **design-system.md** links approved design frames or supplied assets, records verified color and type scales, breakpoints, common controls and interaction
  states, and maps them to implemented Tailwind tokens or components. Label proposed tokens and unmapped values clearly.
- **content-sources.md** maps editable content to the approved copy source and corresponding CMS fields and language variants. Identify integration-owned
  values, field formatting, and how to handle missing or conflicting copy. Link to shared source documents and keep credentials and private working directories
  outside the skill.
- **agents/openai.yaml** supplies a project-specific display name and default prompt using the same skill name.

Include this behavior in each project skill. If the repository has an existing `.codegraph/`, run `codegraph sync` when the graph may be stale, use
`codegraph_explore` with its absolute repository path before code searches, and sync again after source changes and before handoff. Support
`codegraph explore "<question>"` when MCP is unavailable. Review `codegraph.json` for the project's actual source trees and generated/vendor exclusions, then
use `codegraph files` to verify coverage if the configuration changes. With no index, use targeted file reads and leave initialization to the user.

Use the target project's real verification commands and keep `<pre>` intact. Add a checker script only if the project has a recurring rule that can be checked
reliably. Keep stable conventions in the skill and implementation-specific decisions alongside the code they affect.
