# Agent Memory

Durable learnings so the **next** agent is smarter than the last.

## When to read

Before non-trivial work (features, bugs, refactors, flaky tests):

1. Open [`INDEX.md`](./INDEX.md)
2. Open any memory whose tags/paths match your task

## When to write

In the **same session** you learned it (before landing the plane), if **all** are true:

- It would save the next agent clear time or prevent a repeated mistake
- It is **not** already captured accurately in live handbook pages or INDEX
- It is not a secret, credential, or temporary WIP note

### Belongs here

- Gotchas and footguns
- Root-cause writeups after debugging
- Failed approaches (“don’t try X because Y”)
- Flaky test notes and reliable fixes
- “Code appears to do A but actually B”
- Repo-specific preferences

### Does not belong here

- Generic React/TS/Vite knowledge
- Unstable WIP or personal scratch notes
- Secrets, tokens, env values
- Stable facts that should live in `domain-rules.md` / `codebase-map.md` / `ops-playbook.md` (put them there instead, or promote)

## How to write

1. Create `YYYY-MM-DD-<slug>.md` in this folder (UTC or local date; be consistent within a session).
2. Use the template below.
3. Add a **newest-first** line to [`INDEX.md`](./INDEX.md).
4. Commit with the rest of the session work.

### Template

```markdown
# <short title>

- **Date:** YYYY-MM-DD
- **Status:** active
- **Tags:** tracing, playwright, pwa, …
- **Related:** `src/…`, `tests/…`, issue ids

## Context

What you were doing.

## Learning

The durable fact or gotcha.

## Evidence

Paths, commands, symptoms, commits.

## Do / Don't

- **Do:** …
- **Don't:** …
```

### Status values

| Status | Meaning |
|--------|---------|
| `active` | Still true; next agents should read |
| `promoted` | Folded into a handbook page; kept for history |
| `outdated` | No longer true; leave file + note why in body |

## Promotion

If a memory becomes a standing project rule:

1. Update the appropriate handbook page (`domain-rules`, `codebase-map`, or `ops-playbook`).
2. Set memory status to `promoted` and link the handbook section.
3. Keep the INDEX entry (optionally annotate “promoted → …”).

## Privacy

Never store API keys, child personal data, or production credentials in memory files.
