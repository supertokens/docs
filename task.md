# Fumadocs Migration Plan

Migrate the documentation site from Docusaurus to Fumadocs/Next.js while preserving documentation content, authoring intent, and URL behavior under `/docs/**`.

## Constraints

- Do not change docs content meaning or authoring intent.
- Keep docs paths stable under `/docs/**`.
- Use a single production cutover. Section phases are for implementation and review, not long-lived production dual runtime.
- Preserve or intentionally replace current advanced docs behavior:
  - Search, currently Algolia/custom indexes.
  - SDK/API reference generation.
  - `llms.txt`, `llms-full.txt`, and per-page markdown output.
  - Custom MDX components and Docusaurus-era MDX syntax.
  - Link validation.
  - Metadata, OG images, OpenSearch, analytics, and production scripts.
- Keep the Fumadocs migration app tracked and reviewable in Git before treating progress as complete.

## References

- Fumadocs: https://www.fumadocs.dev/docs
- Fumadocs navigation: https://www.fumadocs.dev/docs/navigation
- Fumadocs search: https://www.fumadocs.dev/docs/search
- Fumadocs UI search: https://www.fumadocs.dev/docs/ui/search
- Fumadocs LLM integration: https://www.fumadocs.dev/docs/integrations/llms
- Fumadocs OpenAPI integration: https://www.fumadocs.dev/docs/integrations/openapi
- Fumadocs link validation: https://www.fumadocs.dev/docs/integrations/validate-links
- Fumadocs OG images: https://www.fumadocs.dev/docs/integrations/og
- Docusaurus: https://docusaurus.io/docs

## Current State

- Docusaurus remains the complete production implementation.
- `v2/` now contains the tracked Fumadocs/Next.js foundation app for the migration.
- The production docs content is not migrated yet; `v2/content/docs/index.mdx` and `v2/content/docs/compatibility.mdx` are smoke-test pages.

## Phase 1 — Foundation

Create or restore a standalone Fumadocs/Next.js app in `v2/`.

Tasks:

- Initialize Next.js + Fumadocs (`fumadocs-ui`, `fumadocs-mdx`, `fumadocs-core`).
- Ensure `v2/` source files are not accidentally ignored.
- Add `package.json`, `tsconfig.json`, `next.config.mjs`, `source.config.ts`, and basic app routes.
- Copy required `static/` assets to the Next.js public asset path.
- Configure `/docs/**` route handling with trailing-slash behavior matching Docusaurus.
- Add build, typecheck, and local dev commands.

Acceptance criteria:

- The Fumadocs app is tracked in Git.
- A minimal `/docs` page renders locally.
- `npm run build` or the chosen equivalent succeeds for the minimal app.

## Phase 2 — MDX Compatibility Layer

Build the runtime needed for existing MDX to compile with minimal content edits.

Tasks:

- Define frontmatter schema parity for all fields currently used by docs pages.
- Convert `_category_.json` metadata to Fumadocs `meta.json` or an equivalent loader format.
- Support Docusaurus admonition syntax, including inline titles.
- Port required remark/rehype behavior:
  - `remarkDocItemContextValues`
  - `remarkRemoveCodeTypeCheckingCommentsAndRows`
  - `remarkRemoveWebJsScriptImports`
  - `remarkAddBadgesInHeadings`
  - `remarkDocItemDescription`
  - external-link `nofollow` behavior
- Support `_blocks/` MDX imports and any required auto-import strategy for shared components.

Acceptance criteria:

- Representative pages using frontmatter, admonitions, `_blocks/`, and custom JSX compile without semantic content changes.
- Build failures clearly identify unsupported MDX behavior instead of silently dropping content.

## Phase 3 — Shared Component Parity

Migrate shared MDX components before moving full sections.

Priority components:

- Tabs: `BackendTabs`, `FrontendTabs`, `FrontendPrebuiltUITabs`, `FrontendCustomUITabs`, `OSTabs`, `SelfHostingTabs`, `DatabaseTabs`, `ReactRouterVersionTabs`.
- State switches: `UIType.Switch`, `PrebuiltUIContent`, `CustomUIContent`, `TenantTypeSwitch`.
- Cards/selects: framework cards, package manager cards, config cards, `ReferenceCard`, `HTTPRequestCard`, `CodeSampleCard`.
- Forms: `AppInfoForm`, `ExampleAppForm`, `PasswordlessRecipeForm`.
- Callouts: `PaidFeatureCallout`, `TokensCallout`, OAuth callouts.
- References: `SDKCompatibilityTable`, SDK reference components.

Acceptance criteria:

- State-backed components work with SSR and client navigation.
- LocalStorage or URL state behavior matches current docs where relevant.
- Stubs are allowed only temporarily and must be tracked in this phase's remaining-work list.

## Phase 4 — Section-by-Section Content Migration

Migrate ordinary documentation sections after shared MDX/runtime behavior is stable.

Recommended order:

1. `docs/quickstart` — broad component coverage and good smoke-test section.
2. `docs/platform-configuration` — small, low-risk section.
3. `docs/deployment` — small, low-risk section.
4. `docs/migration` — moderate dependencies.
5. `docs/post-authentication` — session/account-management flows.
6. `docs/additional-verification` — MFA, session verification, attack protection.
7. `docs/authentication` — largest non-reference section with many recipes and `_blocks/`.

Acceptance criteria for each section:

- Every page in the section builds.
- Every existing `/docs/**` URL for the section returns 200 or an intentional redirect.
- Sidebar ordering and labels match Docusaurus intent.
- No content meaning changes.
- Perform manual or visual checks on representative pages, including mobile layout.

## Phase 5 — References Migration

Treat `docs/references` as multiple subprojects, not one normal content section.

Recommended order:

1. High-level references and testing/debugging pages.
2. `docs/references/plugins`.
3. `docs/references/backend-sdks`.
4. `docs/references/frontend-sdks`.
5. `docs/references/fdi`.
6. `docs/references/cdi`.

Acceptance criteria:

- SDK reference pages preserve generated content structure and headings.
- Reference sidebar grouping and URL behavior match current docs.
- API reference pages are not considered complete until Phase 6 is complete.

## Phase 6 — API Reference Runtime

Decide and implement the final API reference strategy.

Options:

- Keep generated MDX pages that render `APIRequestPage`.
- Replace the current API reference runtime with Fumadocs OpenAPI integration.
- Use Scalar directly inside a Fumadocs-compatible page template.

Tasks:

- Verify `static/fdi.json` and `static/cdi.json` generation and serving.
- Recreate `APIRequestPage` behavior or replace it intentionally.
- Support `page_type: api-reference` page templates and title/sidebar behavior.
- Confirm FDI and CDI examples render correctly.

Acceptance criteria:

- Representative FDI and CDI endpoints render correctly.
- Method/path/title metadata match the OpenAPI source.
- Generated pages can be rebuilt deterministically.

## Phase 7 — Search

Replace the current search setup after routes and content structure are stable.

Tasks:

- Decide between Fumadocs/Orama and another search implementation.
- Replace the current 3-index Algolia setup if moving to Fumadocs search.
- Preserve useful facets such as guide, API reference, and SDK reference.
- Implement `/api/search` or the selected search route.

Acceptance criteria:

- Search indexes all migrated docs sections.
- Keyboard navigation and result grouping work.
- API/SDK/reference content remains discoverable.

## Phase 8 — LLM And Markdown Output

Recreate AI/markdown-oriented docs output.

Tasks:

- Generate `llms.txt`.
- Generate `llms-full.txt`.
- Expose per-page `.md` routes.
- Preserve `skip_llms_txt` behavior.
- Preserve `RemoveForLLMs` behavior.
- Add page actions such as copy as markdown and open-in integrations where appropriate.

Acceptance criteria:

- Generated LLM files preserve current ordering and exclusions.
- Per-page markdown output is available for migrated pages.
- API reference pages expose useful markdown output, not just empty component shells.

## Phase 9 — Production Parity

Restore production-only behavior from Docusaurus plugins/config.

Tasks:

- Analytics and page-view tracking.
- `supertokens.com` React bundle/footer integration, production only.
- Intercom script behavior, if still required.
- OpenSearch metadata.
- Static metadata, social metadata, and OG images.
- Dynamic OG image generation if useful.
- External link behavior.

Acceptance criteria:

- Production build includes required scripts and metadata only where intended.
- Preview/local builds do not load production-only scripts unexpectedly.

## Phase 10 — Validation And Cutover

Perform final parity checks before replacing Docusaurus in production.

Tasks:

- URL parity script for every existing `/docs/**` URL.
- Link validation with Fumadocs or an equivalent tool.
- Typecheck and production build.
- Visual regression checks on representative pages.
- Lighthouse baseline for key pages.
- Update CI/CD for Next.js server artifact or selected hosting model.
- Coordinate with the `supertokens-backend-website` pipeline if it owns SSR hosting.

Acceptance criteria:

- All required `/docs/**` URLs pass.
- Broken links fail CI or are explicitly allowed for preview builds.
- Production deployment path is documented and tested.
- Docusaurus is removed only after the Next.js/Fumadocs site passes parity checks.

## Progress Tracking

Use this section only for verified progress from the current checkout.

### Done

- [x] Phase 1 — Foundation
- [x] Phase 2 — MDX Compatibility Layer
- [ ] Phase 3 — Shared Component Parity
- [ ] Phase 4 — Section-by-Section Content Migration
- [ ] Phase 5 — References Migration
- [ ] Phase 6 — API Reference Runtime
- [ ] Phase 7 — Search
- [ ] Phase 8 — LLM And Markdown Output
- [ ] Phase 9 — Production Parity
- [ ] Phase 10 — Validation And Cutover

### Notes

- Do not mark a phase complete unless the related files are tracked/reviewable and the acceptance criteria pass.
- Temporary stubs should be listed explicitly with owners or follow-up tasks.
- Phase 1 verified with `npm run typecheck` and `npm run build` in `v2/`.
- Phase 2 verified with `npm run typecheck`, `npm run build`, and `npm run migrate:categories` in `v2/`.
- Phase 2 added extended docs frontmatter/meta schemas, Docusaurus directive callouts, code sample cleanup, optional heading badges, external-link `nofollow`, flow-style `{props.*}` replacement, and a `_category_.json` to `meta.json` migration script.
- `remarkDocItemDescription` behavior is covered by the Fumadocs page template through `DocsDescription`; revisit if migrated pages need path-specific subtitle injection.
- `_blocks/` imports and shared custom JSX compile support depend on Phase 3 component parity. The Phase 2 smoke page only validates the MDX runtime and basic compatibility components.
- Inline text `{props.*}` expressions are not required by current docs content and are not validated; flow-style expressions are supported.
- `npm install` in `v2/` reports 5 moderate vulnerabilities from dependencies; review before production cutover.
