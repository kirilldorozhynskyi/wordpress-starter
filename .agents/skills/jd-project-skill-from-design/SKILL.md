---
name: jd-project-skill-from-design
description:
    Create or refresh a project-specific frontend conventions skill from approved design references and the actual repository of a site derived from the jD
    WordPress starter. Use for design handoff, onboarding Codex into a new site, or updating its documented design system and content contracts.
---

# Create a project skill from design

1. Identify the current project's name, repository, active theme, approved design and any existing project skill. In an indexed repository, sync CodeGraph when
   stale and use `codegraph_explore` with this repository's absolute path before searching code. Fall back to the CLI or targeted local reads.
2. Inspect the actual theme's CSS entry and tokens, comparable frontend components, PHP/ACF to Vue data flow and local checks. Use the baseline the user named
   when relevant and record its Git ref only when verified. Read design nodes that establish foundations and representative layouts and states. For Figma, use
   the available Figma design tooling and its required skill before requesting design context.
3. Map approved visual rules to real tokens, utilities, components and source paths. Identify which content comes from design, WordPress/ACF, localization or an
   integration. Record gaps as open items and use only verified values and references.
4. Create or update `.agents/skills/<project-slug>-frontend-conventions/` in the target repository using
   [the project skill structure](references/project-skill.md). Preserve existing project knowledge and revise it where current evidence supports a change.
5. Validate frontmatter, links, paths, token names, ACF layout mappings and commands. If `.codegraph/` exists, sync after relevant changes and query
   representative symbols to verify coverage. Keep existing `<pre>` elements. The design handoff requires no build.

The deliverable is a repository-owned skill for future tasks. In a specific implementation task, follow that skill and the supplied design, and update its
references when the team adopts a reusable pattern.
