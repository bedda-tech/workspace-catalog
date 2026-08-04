# @bedda/workspace-catalog

One component registry for the generative workspace. Nozio pages and Familiar's dashboard
chat render the same json-render spec from this catalog — which is what makes a chat block
and a page **the same artifact at two lifetimes**, and "promote to page" a database write
rather than a translation layer.

Context: `projects/GENERATIVE-WORKSPACE.md` in the familiar workspace, section
*"Converge on the spec, not the apps"* (2026-08-04).

## Consumers

| surface | repo | how |
|---|---|---|
| Nozio app pages | `bedda-tech/nozio` | `src/app/json-render/catalog.ts` re-exports this |
| Familiar chat | `bedda-tech/familiar` | dashboard renders chat blocks through it |

## Install

Consumed as a git dependency (not published to npm):

```json
"@bedda/workspace-catalog": "github:bedda-tech/workspace-catalog#semver:^0.1.0"
```

Peers: `@json-render/core` / `react` / `shadcn` `^0.18.0`, `zod` `^4`. **Both consumers are
on zod 4 by design** — the version split is what previously forced an `as any` cast in Nozio
that disabled all prop-schema checking.

## dist/ is committed

`dist/` is checked in and must be rebuilt (`npm run build`) in the same commit as any `src/`
change. Committed output is what makes this installable as a git dep with no prepare-time
toolchain — a deliberate trade against drift, checked by `npm test`.

## Rules

1. **The catalog is the allowlist.** Unknown component → visible validation failure, never a
   silent drop.
2. **Curate, don't dump.** 36 deliberate components beat 200 primitives.
3. **Actions are shared or they don't exist.** An action only one surface understands breaks
   the promotion path. Familiar's ask semantics (auditable answers, single-use cards,
   retraction, free-text notes) land here next.
