---
name: supertokens-docs-proofreader
description: Proofread and fact-check SuperTokens documentation page by page against released SuperTokens SDKs, the Core, API specifications, tests, and official repositories. Use when asked to audit documentation accuracy or freshness, validate one or more docs pages, correct stale or wrong SuperTokens guidance, review SDK-specific examples, or summarize evidence-backed documentation corrections.
---

# SuperTokens Docs Proofreader

Audit user-facing documentation as both a technical editor and a SuperTokens implementation reviewer. Treat factual correctness as more important than stylistic polish.

## Ground Rules

- Verify claims from source. Do not rely on model memory or copy claims between docs pages.
- Document released behavior. Do not present code on an unreleased default branch as generally available.
- Validate each SDK tab independently. Similar APIs across Node.js, Python, Go, Java, PHP, .NET, frontend, mobile, and framework SDKs are not evidence of parity.
- Use the smallest evidence-backed correction. Preserve page structure, voice, MDX components, frontmatter, and unrelated local changes.
- Do not silently remove uncertain content. Record unresolved claims and the evidence needed to settle them.
- Never modify SDK or Core repositories during an audit. Read or fetch them without changing their worktrees.
- Do not create a branch, commit, or pull request unless the user asks.

## Scope

If the user names pages, audit those pages and the directly linked prerequisites needed to assess them. Otherwise:

1. Locate the Blume content root from `blume.config.ts`; default to `docs/`.
2. Enumerate every user-facing `.md` and `.mdx` page in that root. Treat a page as its rendered output: trace imported components, shared snippets, data files, generators, and runtime-backed widgets that add technical claims.
3. Exclude authoring templates, generated artifacts, vendored content, and build output unless requested.
4. Include generated API/reference sections by validating their source specification or generator. Do not hand-edit generated output.
5. Process pages in navigation order when `meta.ts` provides one, then process remaining pages by path.

For a repository-wide audit, maintain a ledger with one row per page. Track outcome (`unchanged` or `corrected`), completeness (`pending`, `complete`, or `blocked`), and generated content separately. A page is not complete until its rendered factual claims, code examples, links, and prose have been considered. Any unresolved material claim makes the page `blocked`, even when other claims were corrected. A material claim affects a user's implementation, security, compatibility, deployment, cost, or expected product behavior.

## Workflow

### 1. Establish Context

1. Read repository instructions, contributor guidance, docs templates, and relevant `meta.ts` files.
2. Inspect the worktree before editing. Preserve all unrelated changes.
3. Read `references/validation-checklist.md` before starting the audit.
4. Identify whether the docs target latest releases, a versioned release, or unreleased behavior. Ask one short question only when the target cannot be inferred.
5. Create an audit workspace under `/tmp/opencode/supertokens-docs-proofreader/<timestamp>/`. Keep the release manifest, claim evidence, and page ledger there until the final report is complete so the audit can be reviewed and resumed.

### 2. Locate Authoritative Sources

Prefer local sibling repositories under the common SuperTokens workspace when present. Discover repositories rather than assuming the list is complete. Typical sources include:

- `supertokens-core` for Core behavior, storage, configuration, CDI implementation, and deployment behavior.
- Backend SDK repositories such as `supertokens-node`, `supertokens-python`, `supertokens-golang`, `supertokens-java`, `supertokens-php`, and `supertokens-dotnet`.
- Frontend and UI repositories such as `supertokens-web-js`, `supertokens-auth-react`, `supertokens-website`, and supported mobile SDK repositories.
- Integration repositories such as `supertokens-nestjs`, plugins, and plugin interfaces when a page documents them.
- This docs repository's `openapi/`, generators, examples, and code-block checks for generated references and documentation contracts.

When a required repository is absent, use only the official `supertokens` GitHub organization, official package registries, and official SuperTokens release notes. Record the URL and revision used.

For local Git repositories:

1. Inspect remotes, current revision, default branch, tags, and worktree state.
2. Fetch release metadata when network access is available. For current documentation, freshness always matters. Do not checkout, pull, reset, clean, or alter files.
3. Inspect remote revisions with `git show`, `git grep`, or a temporary clone/worktree under `/tmp/opencode`.
4. Match claims to the latest relevant published package or binary, then map that artifact to its release tag and source commit. Use the default branch only for explicitly unreleased documentation or when release evidence proves the behavior shipped.

Before confirming current behavior, create a release manifest for every relevant product and SDK. Record the registry or distribution channel, published version, release tag, source commit, retrieval date, and evidence URL. If the latest published state cannot be established, mark affected pages `blocked`.

For cross-stack pages, also record the applicable Core, backend SDK, frontend SDK, CDI, and FDI versions as a compatibility tuple. Confirm compatibility from released SDK metadata, dependency constraints, compatibility tables, or tests. Do not combine each repository's newest release unless evidence shows that set interoperates.

Use this evidence order:

1. Released implementation, exported types, and tests at the relevant tag.
2. Versioned API specifications, generated references, and SDK documentation in the source repository.
3. Official changelogs, release notes, migration guides, and package metadata.
4. Official examples.
5. Existing prose documentation only as a lead, never as sole confirmation.

Published artifacts define whether behavior is released; source and tests define how it behaves. If registry metadata, tags, release notes, specifications, implementation, or tests disagree, do not choose silently. Recheck version mapping, report the conflict, and mark the affected claim `blocked`. For public wire contracts, require agreement between the released contract and implementation or explicitly report the discrepancy.

### 3. Audit Each Page

Read the entire page, then inventory claims that can become stale:

- API names, signatures, return values, exceptions, defaults, and deprecations.
- Recipe availability, feature support, SDK/framework compatibility, and version requirements.
- Core configuration, environment variables, ports, connection behavior, storage, and deployment steps.
- Authentication, session, token, cookie, anti-CSRF, account linking, multitenancy, MFA, and security behavior.
- Dashboard, managed service, licensing, and operational claims.
- Installation commands, package names, imports, routes, request/response examples, and code snippets.
- Internal links, prerequisites, sequencing, terminology, grammar, and ambiguous instructions.

Trace every material claim to concrete evidence. Search by exact symbol, config key, route, error name, or behavior. For security-sensitive or surprising behavior, confirm with implementation and tests when available.

Check examples against the exact SDK represented by their tab or label. Confirm imports, casing, argument order, async behavior, middleware ordering, framework version, and required initialization. Run targeted code-block tooling where practical.

Mark the page on separate dimensions:

- Outcome `unchanged`: no factual or editorial correction needed.
- Outcome `corrected`: one or more evidence-backed edits made.
- Completeness `complete`: every material claim was confirmed or corrected.
- Completeness `blocked`: at least one material claim could not be confirmed, including on an otherwise corrected page.
- Generated `yes`: source/generator checked instead of hand-editing output. This does not imply that the page is complete or unchanged.

### 4. Edit

1. Correct factual errors and stale instructions immediately when evidence is conclusive.
2. Fix grammar, clarity, and consistency without changing technical meaning or creating broad rewrite churn.
3. Update all variants of the same proven error when they are in scope, but do not infer that superficially similar text is wrong.
4. Preserve valid version-specific guidance and label it clearly when needed.
5. Update links or navigation metadata only when required by the correction.

### 5. Verify

Run the narrowest relevant checks first, then repository-level checks when the audit scope warrants them:

```sh
npm run lint:code-blocks -- <changed-pages>
npm run write-code-blocks -- <changed-pages>
npm run lint:vale
npm run lint:prettier:check
npm run validate
npm run typecheck
npm run build
```

After extracting snippets, compile or type-check every supported language represented by an affected example:

```sh
npm run check-code-blocks <language>
```

Record unsupported, intentionally partial, or non-runnable examples as residual risk. Mark the page `blocked` when its correctness depends on an example that cannot otherwise be confirmed from released source and tests. Fix failures caused by the edits. Report pre-existing or environment-related failures separately.

Review `git diff --check` and the final diff. Ensure every content change has evidence and no unrelated changes were included.

## Final Report

Lead with the result and include:

1. **Coverage:** pages considered, unchanged, corrected, complete, blocked, generated, and intentionally excluded.
2. **Corrections:** one row per changed page with the original problem, correction, and authoritative source including repository plus tag, commit, file, symbol, or URL.
3. **Editorial changes:** concise summary of non-factual proofreading edits.
4. **Validation:** commands run and results.
5. **Unresolved:** claims that remain unverified, why, and what evidence is missing.

Summarize semantic diffs, not line-by-line edits. If no changes are needed, state that clearly and still report coverage, sources checked, validation performed, and residual risk.

## Resource

- `references/validation-checklist.md`: page checklist, evidence rules, and audit ledger format.
