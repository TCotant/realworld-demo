---
name: req-doc
description: Draft REQUIREMENTS.md/USER_STORIES.md/ACCEPTANCE_CRITERIA.md entries (REQ/US/AC, next unused numbers, cross-referenced) for a behavior change, following this repo's documentation contract and house style. Default timing is spec-first — draft the entries from the issue/description before implementation begins, then implement to match them.
---

You draft new, numbered `REQ-###` / `US-###` / `AC-###` entries — plus the
matching row(s) in `ACCEPTANCE_CRITERIA.md`'s Traceability Matrix — for a
behavior change, in this repo's exact existing style. You apply the edits
directly, then stop and show the diff for the user to review. You never
stage, commit, or push.

This exists because `CLAUDE.md`'s documentation contract and `ISSUES.md`'s
Definition of Done (item 3) require every behavior change in this repo to
be reflected in these three files, using the next unused number, cross-
referenced, "following the existing conventions." Getting that formatting
and numbering right by hand, every ticket, is exactly the kind of
repetitive, easy-to-get-subtly-wrong work worth automating.

## Before doing anything else

Read, in order:

1. Root `CLAUDE.md`.
2. `REQUIREMENTS.md`, `USER_STORIES.md`, `ACCEPTANCE_CRITERIA.md` — in
   full, not just the tail. You need the numbering, tone, and cross-
   reference conventions from the *whole* file, not just the most recent
   entries.
3. `frontend/src/CLAUDE.md` if the change touches `frontend/src/`, and/or
   `test/CLAUDE.md` if you'll be reasoning about test coverage.

## Step 1 — Pick a timing mode

- **Spec-first (default for new `ISSUES.md` tickets)** — run this skill
  *before* writing any implementation code, straight from the issue/ticket
  description (plus any scoping discussion or `PLAN.md` already agreed
  with the user). The entries you draft here become the contract the
  implementation is written to satisfy — this flips the historical
  "document what the code already does" habit for brand-new features:
  here, the doc is written first and the code follows it, the same way
  `PLAN.md` itself is a spec written before the code that implements it.
  Skip straight to Step 2 (Compute next numbers) in this mode; there is no existing code/tests to
  read yet, so calibrate format and house style only from the *existing*
  `REQ-###`/`US-###`/`AC-###` entries (Step "Before doing anything else"),
  not from a diff.
- **Post-hoc reconciliation** — run this after implementation, either
  because (a) the feature was already built before this skill ran (e.g.
  an older ticket, or a fix applied mid-implementation before the spec was
  drafted), or (b) implementation surfaced a real special case or boundary
  condition the spec-first draft didn't anticipate and the entries need a
  follow-up amendment. In this mode, source material is the actual diff —
  run `git diff main...HEAD` and `git log main..HEAD --oneline` (or read
  the named files directly), and **read the touched source and its
  tests** before drafting anything; never draft an entry from a
  description alone here, since the whole point of this mode is
  documenting what the code *actually* does, including the edge cases the
  spec missed. This is also the mode for **amendments**: documenting a
  special case in code that already existed but was never captured in
  `REQUIREMENTS.md` — exactly why the `## Amendments` section exists today
  (`REQ-041`–`048` were "added after a documentation review found special
  cases present in the code but not yet captured above").
- **If invoked with an issue number** (e.g. `/req-doc #4`) and no code for
  it exists yet, run `gh issue view <N>` and treat that as spec-first
  source material.
- **If invoked with no arguments and implementation already exists** on
  the current branch, fall back to post-hoc reconciliation against
  `git diff main...HEAD`.

Both timing modes produce the same shape of entry and go through the same
steps below — the difference is only what you read to derive them (the
issue/description vs. an existing diff) and whether you're allowed to
draft ahead of verified code (spec-first only).

## Step 1a — After a spec-first draft, close the loop

Spec-first entries describe *intended* behavior. Once the implementation
this spec was written for is actually done, re-read the real code/tests
against the drafted entries before calling the ticket finished:

- If the implementation matches the draft, nothing further to do.
- If implementation had to diverge from the draft in some way (a detail
  the spec didn't anticipate, a boundary case discovered while coding),
  do **not** silently edit the spec-first entry to match after the fact —
  run this skill again in post-hoc reconciliation mode to add an
  `## Amendments` entry capturing the discovered special case, the same
  way undocumented legacy behavior gets amended. The original entry stays
  as-is; the amendment supersedes it for that specific case.

## Step 2 — Compute next numbers

For each file, find the highest existing number and add 1:

```bash
grep -oE 'REQ-[0-9]+' REQUIREMENTS.md | grep -oE '[0-9]+' | sort -n | tail -1
grep -oE 'US-[0-9]+'  USER_STORIES.md | grep -oE '[0-9]+' | sort -n | tail -1
grep -oE 'AC-[0-9]+'  ACCEPTANCE_CRITERIA.md | grep -oE '[0-9]+' | sort -n | tail -1
```

Never reuse or renumber an existing entry. **Always append** — this file's
own stated policy is "Numbering is appended rather than interleaved so
that the original numbering is preserved unchanged," and that rule holds
regardless of which timing mode (Step 1) produced the entry.

## Step 3 — Draft the REQ entry

- Observable behavior only — no implementation detail (no variable names,
  no internal function names). State what the system *does*, the way
  every existing `REQ-###` does.
- Call out boundary/special cases explicitly with a **Boundary:** or
  **Special case:** paragraph when relevant (see `REQ-011`, `REQ-017`,
  `REQ-020` for the pattern).
- Append it under the `## Amendments` heading at the end of
  `REQUIREMENTS.md` (create that heading only if a future repo state
  somehow lacks it — today it exists, after `REQ-040`).

## Step 4 — Draft the US entry

Format, matching every existing entry in `USER_STORIES.md`:

```
**US-###** — As a <role>, I want <capability>, so that <benefit>.
*Related requirements: REQ-###[, REQ-###...]*
```

Append to the end of `USER_STORIES.md`.

## Step 5 — Draft the AC entries and the traceability row

In `ACCEPTANCE_CRITERIA.md`, append:

```
### US-### — <short title>
*(REQ-###[, REQ-###...])*

- **AC-###** — Given <state>, when <action>, then <outcome>.
```

One or more `AC-###` bullets per story, as needed to cover the behavior's
distinct cases (success path, each rejected/boundary case). Then append
the matching row(s) to the **Traceability Matrix** table at the bottom of
the same file, in the same `| REQ-### | US-### | AC-###[–AC-###] |` format
as the existing rows.

## Worked example to match

The most recent real additions to this repo are the canonical style
reference — read them directly before drafting anything new:

- `REQUIREMENTS.md`: `REQ-046` (single requirement) and `REQ-047`–`048`
  (a pair added together for one feature).
- `USER_STORIES.md`: `US-027` and `US-028`.
- `ACCEPTANCE_CRITERIA.md`: `AC-074`–`075` and `AC-076`–`079`, plus their
  Traceability Matrix rows.

Match that formatting exactly — heading style, em-dash usage, bullet
structure, cross-reference syntax.

## Step 6 — Apply and stop

Apply the drafted entries with `Edit`. Then run `git diff` over the three
files and show it to the user. **Do not** run `git add`, `git commit`, or
`git push`, and do not touch `ISSUES.md` or GitHub issues — committing and
opening a PR is `GITHUB.md`'s job, not this skill's.

## Guardrails

- Never edit or renumber any existing `REQ-###`/`US-###`/`AC-###` entry or
  Traceability Matrix row.
- In post-hoc reconciliation mode, never document behavior you haven't
  verified in the actual code/tests. In spec-first mode, you have no code
  to verify against yet — but never draft a spec that contradicts an
  *existing* `REQ-###`/`US-###`/`AC-###` entry or a stated scope decision
  in `PLAN.md`/the issue; if the two conflict, stop and ask rather than
  guessing which one wins. Either way, run Step 1a once implementation
  exists so the doc and the code end up saying the same thing.
- Never touch `ISSUES.md`, run the test suite, or perform any git
  operation beyond read-only inspection (`git diff`, `git log`).
- If the change spans multiple distinct behaviors, draft one `REQ-###` per
  distinct behavior rather than cramming unrelated behavior into one entry
  — matches how existing requirements are scoped.
