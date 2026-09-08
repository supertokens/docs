# Validation Checklist

Use this checklist for every audited page. Adapt checks to the page; do not force irrelevant work.

## Evidence Record

Record enough detail for another reviewer to reproduce each conclusion:

```text
Claim:
Verdict: confirmed | stale | wrong | ambiguous | unresolved
Product and version:
Source: repository, tag/commit, file, symbol/test, or official URL
Action: none | corrected | clarified | blocked
```

Do not cite a repository root or default branch alone. Prefer a release tag and exact file, exported symbol, test, specification operation, or changelog entry.

Assign stable IDs within the audit, such as `docs/path/page.mdx#C01`, to material claims. Link each claim record from the page ledger. Store the ledger, claim records, release manifest, retrieval date, and audit scope under the audit workspace named in `SKILL.md`. Update them after each page and retain them through final review.

## Page Checklist

- Read the complete page, including frontmatter, imports, callouts, tabs, code groups, and linked prerequisites.
- Trace imported components, shared snippets, data sources, generators, and runtime-backed content that contribute to the rendered page.
- Identify the intended audience, SDK, framework, recipe, deployment model, and product version.
- Confirm feature names and terminology against current released exports and product language.
- Confirm package names, install commands, imports, initialization, API signatures, defaults, and return/error behavior.
- Confirm every language or SDK tab separately against that SDK's released source.
- Confirm Core claims against released Core implementation, configuration, tests, and CDI specifications.
- Confirm frontend behavior against the frontend SDK or UI implementation, not a backend SDK.
- Confirm routes and payloads against the relevant versioned CDI, FDI, or dashboard API contract.
- Confirm security statements from code and tests where possible; do not weaken warnings while editing.
- Confirm compatibility and minimum-version claims from release metadata or changelogs.
- Confirm managed-service, dashboard, licensing, and pricing claims using official current sources; mark them blocked if authoritative access is unavailable.
- Check that steps are complete, ordered, and explicit about prerequisites and side effects.
- Check code for syntax, imports, casing, async behavior, framework conventions, and middleware order.
- Check links and anchors. Prefer stable official links over branch-specific source links in page prose.
- Proofread for grammar, American spelling, active voice, concise language, defined acronyms, and consistent terms.
- Preserve deliberate versioned, legacy, and migration guidance rather than rewriting it as latest-only behavior.
- Record the page status and evidence before moving to the next page.
- Mark completeness `blocked` whenever any material claim remains unresolved, regardless of corrections made elsewhere on the page.

## Release Check

Before using default-branch code as evidence:

1. Find the latest package release or repository release tag relevant to the docs.
2. Determine whether the symbol or behavior exists at that release.
3. Check changelogs and migration notes for deprecations or breaking changes.
4. Treat behavior found only after the release tag as unreleased unless official release evidence says otherwise.
5. For version-qualified docs, inspect the exact documented version instead of latest.

For each relevant product or SDK, record:

```text
Product:
Registry or distribution channel:
Published version:
Release tag:
Source commit:
Retrieved:
Evidence URL:
```

For pages spanning products, record a Core/backend/frontend/CDI/FDI compatibility tuple and the released evidence that proves it interoperates. Never construct the tuple from unrelated latest versions without compatibility evidence.

If published artifacts, tags, specifications, implementation, or release notes conflict, verify the artifact-to-commit mapping. If the conflict remains, preserve the docs unless they are conclusively wrong, record the discrepancy, and mark the claim `blocked`.

## Generated Content

For generated references:

1. Identify the checked-in source specification or generator.
2. Compare it with the released product contract.
3. Fix the source or generator, not generated output.
4. Regenerate using the repository command when available.
5. Report generated files separately from authored page corrections.

## Audit Ledger

Use a temporary ledger for multi-page audits:

```markdown
| Page               | Product/SDK | Outcome   | Completeness | Generated | Claims  | Notes      |
| ------------------ | ----------- | --------- | ------------ | --------- | ------- | ---------- |
| docs/path/page.mdx | Node.js SDK | unchanged | complete     | no        | C01-C08 | No changes |
```

Keep the ledger outside the repository unless the user asks for a persistent report. For long audits, work in explicit batches and record the last completed page after every batch. Do not claim repository-wide completion if any in-scope page is missing from the ledger or has completeness other than `complete`.

## Diff Summary

For each changed page, report:

```markdown
| Page                 | Problem                | Correction                            | Evidence                                       |
| -------------------- | ---------------------- | ------------------------------------- | ---------------------------------------------- |
| `docs/path/page.mdx` | Documented old default | Replaced it with the released default | `supertokens-core` vX.Y.Z, `path/file:setting` |
```

Group purely editorial corrections in one concise paragraph unless they alter interpretation.
