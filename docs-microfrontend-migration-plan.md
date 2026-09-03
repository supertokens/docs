# Docs Microfrontend Migration Plan

## Goal

Serve the Blume documentation as a Vercel microfrontend under `https://supertokens.com/docs/**`, stop routing authored
documentation through `supertokens-backend-website`, and preserve generated SDK reference URLs by rewriting them to
`https://sdk.supertokens.com`.

This workstream covers these repositories:

- `supertokens/docs`
- `supertokens/backend-api`, specifically `apps/saas-dashboard-ui` (the authoritative dashboard implementation path is
  `backend-api/apps/saas-dashboard-ui`)
- `supertokens/supertokens-backend-website`

Repository-relative paths are used throughout this plan. A developer's local worktree path is not a portable
implementation reference.

Provisioning and publishing content to `sdk.supertokens.com` is covered by `sdk-docs-infrastructure-plan.md`.

This document records the required implementation and rollout sequence. The docs-side routing, asset prefix, endpoint
rewrites, redirect generator, security headers, and credential-free preview smoke automation are implemented; shared
preview acceptance, dashboard rollout, SDK-origin validation, and production cutover are not complete.

## Dependency Contract

Before production cutover, the infrastructure workstream must provide:

- A production CloudFront origin at `https://sdk.supertokens.com`.
- All existing SDK namespaces and historical versions.
- Stable object paths matching `/<sdk>/<version-or-path>/**`.
- Edge mappings for unversioned and `N.N.X` paths to immutable exact releases.
- Immutable legacy snapshot mappings for migrated artifacts whose exact patch provenance is unknown.
- A versioned manifest describing current releases, all historical compatibility aliases, and entrypoints.
- Correct content types, cache headers, and Android frame behavior.
- A documented rollback procedure.

The docs application preserves public URLs with rewrites such as:

```text
https://supertokens.com/docs/nodejs/24.0.X/modules.html
  -> https://sdk.supertokens.com/nodejs/24.0.X/modules.html
```

This must be an external rewrite, not a browser redirect.

## Phase 1: Make The Docs Build Microfrontend-Aware

Before this migration, Vercel routing assigned only `/docs/:path*` to the docs application, while generated Astro assets
and public files used root paths. Fix route ownership before enabling production microfrontend routing.

In the docs repository:

1. Configure `@vercel/microfrontends/experimental/vite` in `blume.config.ts`. The application owns plugin selection;
   the Blume `1.5.3` patch only passes configured Vite plugins into generated Astro config and provides asset-prefix and
   endpoint behavior unavailable upstream. Move framework changes into upstream Blume or a maintained fork later.
2. Configure `/docs-assets` as the stable asset prefix.
3. Add `/docs-assets/:path*` to the dashboard-owned authoritative microfrontends configuration before enabling the
   prefix.
4. Move public assets into a docs-owned prefix rather than relying on generic root paths such as `/img/**` and
   `/fonts/**`.
5. Update logo, content image, icon, font, favicon, and Open Graph references.
6. Verify that generated HTML does not request the parent application's `/_astro/**` resources.

Add the `/docs-assets/:path*` route before enabling the prefix so deployments remain compatible during rollout.

## Phase 2: Namespace Docs Runtime Endpoints

Move all docs-owned runtime and machine-readable endpoints under the routed `/docs` namespace:

```text
/docs/api/ask
/docs/mcp
/docs/llms.txt
/docs/llms-full.txt
/docs/agent-readability.json
/docs/sdk-manifest.json
/docs/.well-known/api-catalog
```

Also define explicit ownership for:

```text
/docs/api-spec/**
/docs/cdi.json
/docs/cdi.yml
/docs/cdi-mapping.json
/docs/fdi.json
/docs/fdi.yml
/docs/fdi-mapping.json
```

Required changes:

- Make the Ask AI client call `/docs/api/ask`.
- Configure the MCP server at `/docs/mcp`. The dashboard owns both `/.well-known/mcp.json` and
  `/.well-known/mcp/server-card.json`; both discovery documents must target `/docs/mcp`.
- Generate LLM indexes at the documented URLs.
- Rewrite `/docs/.well-known/api-catalog` to Blume's generated root artifact. This is the only docs-owned well-known
  rewrite; dashboard-owned MCP discovery remains separate.
- Rewrite `/docs/sdk-manifest.json` to `https://sdk.supertokens.com/manifest.json` and update the SDK version selector to
  use it instead of `/sdk/versions`. Retain the selector during migration. It must use `/manifest.json` when an SDK page
  is opened directly on `sdk.supertokens.com`.
- Update `docs/integrate-with-ai.mdx` after route behavior is final.
- Remove duplicate root and `/docs` endpoint header rules after migration.

The `/.well-known/**` namespace cannot be handled through ordinary Vercel rewrites, so the dashboard implementation
must serve these two discovery documents directly.

## Phase 3: Rewrite Legacy SDK Namespaces

Add external rewrites in the docs Vercel project before Astro's page handling for:

```text
/docs/nodejs/**
/docs/python/**
/docs/auth-react/**
/docs/web-js/**
/docs/website/**
/docs/react-native/**
/docs/android/**
/docs/ios/**
/docs/flutter/**
```

Each route removes only the public `/docs` prefix:

```json
{
  "source": "/docs/nodejs/:path*",
  "destination": "https://sdk.supertokens.com/nodejs/:path*"
}
```

Add explicit compatibility redirects for SDK roots:

```text
/docs/nodejs      -> /docs/nodejs/latest/modules.html
/docs/python      -> /docs/python/latest/index.html
/docs/website     -> /docs/website/latest/modules.html
/docs/auth-react  -> /docs/auth-react/latest/modules.html
/docs/web-js      -> /docs/web-js/latest/modules.html
/docs/react-native -> /docs/react-native/latest/modules.html
/docs/ios         -> /docs/ios/latest/index.html
/docs/android     -> /docs/android/latest/index.html
/docs/flutter     -> /docs/flutter/latest/index.html
```

Preserve the current external Golang behavior unless product requirements change:

```text
/docs/golang -> https://pkg.go.dev/github.com/supertokens/supertokens-golang
```

Redirect the legacy API reference entrypoints to the Blume references:

```text
/docs/cdi -> /docs/references/cdi
/docs/fdi -> /docs/references/fdi
```

## Phase 4: Migrate Redirects And URL Compatibility

The backend website contains a large redirect table plus hard-coded SDK redirects. Build a generated compatibility
manifest rather than manually copying entries.

1. Export effective entries from `supertokens-backend-website/app/src/routeRedirects.ts`.
2. Preserve current first-match behavior for duplicate source routes and emit a documented conflict report. Do not
   silently deduplicate or reorder conflicting entries.
3. Compare all redirect sources against Blume routes and existing Blume redirects.
4. Add only redirects that remain applicable.
5. Preserve fragments in targets.
6. Preserve query strings unless an existing contract requires dropping them.
7. Add redirects for removed shared plugin pages.
8. Test historical paths found in content, search indexes, analytics, and inbound-link reports.

The generated redirect data should have a source of truth and tests; do not maintain two independently edited copies.

## Phase 5: Own Security, Indexing, And Caching

The dashboard application's proxy does not supply headers to responses served by the docs child. Configure the docs
deployment itself with:

- Content Security Policy.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- Cross-origin opener and resource policies where appropriate.
- A default framing policy.
- Environment-sensitive `X-Robots-Tag: noindex` for preview and staging deployments.

Because docs remain under the same `supertokens.com` origin as the dashboard, treat docs scripts as trusted same-origin
code. Keep the script allowlist narrow and avoid `unsafe-eval` and `unsafe-inline` where feasible.

CloudFront owns CSP-compatible SDK response headers, SDK caching, and the Android framing exception. The docs
application owns headers for authored Blume responses and must verify that external rewrites preserve, rather than
weaken or replace, origin SDK headers. Use `robots.txt` on the direct `sdk.supertokens.com` host to discourage duplicate
indexing while canonical SDK URLs continue to point to `supertokens.com/docs/**`.

Define cache policies by response type:

| Response                 | Policy                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| Versioned Astro assets   | Long-lived immutable                                                  |
| Authored HTML            | CDN cache with controlled revalidation                                |
| Ask AI and MCP           | No store unless explicitly safe                                       |
| Markdown and LLM indexes | CDN cache with deployment invalidation                                |
| SDK artifacts            | Supplied by `sdk.supertokens.com` and honored by the external rewrite |

If HTML and Markdown are negotiated from the same URL, include `Vary: Accept` or use separate cache keys.

## Phase 6: Update The Dashboard Application

In the authoritative dashboard implementation at `backend-api/apps/saas-dashboard-ui`:

1. Keep the `withMicrofrontends` integration.
2. Keep hard navigation for links crossing application boundaries.
3. Add `packageName: "@supertokens/docs"` to the docs application configuration.
4. Treat the dashboard `microfrontends.jsonc` as authoritative. Add an automated synchronization check so any generated
   or mirrored docs-side routing data cannot drift from it.
5. Remove `/docs/:path*` from the explicit backend website paths only when preview routing is ready.
6. Reconsider the `isDocsPath` early return in `src/proxy.ts`; production child requests do not run the parent proxy, and
   direct parent requests should not silently lose security and indexing headers.
7. Remove dead Android handling from the parent only after CloudFront or the docs child owns it.
8. Repair CSP tests so enforced and report-only policies are asserted separately.

Expand microfrontend routing tests to include:

- `/docs` and representative Blume pages.
- The real Astro asset prefix.
- Docs public assets.
- Ask AI, MCP, LLM, and API-spec endpoints.
- Every SDK namespace.
- `/docs-old` and unrelated parent paths.
- Case variants, duplicate slashes, encoded separators, and query strings.

Use the Vercel routing flag `docs-microfrontend` for `/docs/:path*` so traffic can be enabled and disabled without a new
docs deployment. Enable it in shared previews and keep it disabled initially in production.

## Phase 7: Keep The Backend Website As Rollback

Do not remove legacy docs behavior during the initial cutover.

Before cutover:

- Keep `app/docs/v2` and `app/docs/sdk` available.
- Keep existing documentation release workflows operational.
- Freeze behavior changes except critical fixes.

After the new route has been stable for the agreed rollback window:

1. Disable `release-documentation-changes.yml`.
2. Disable the generic SDK workflow and the dedicated Node.js and Python documentation release workflows after all SDK
   repositories publish to S3.
3. Remove SDK runtime HTML injection code.
4. Remove docs and SDK filesystem-serving branches from `app/src/indexNode.ts`.
5. Remove stored docs artifacts from the repository.
6. Remove redirects only after confirming that the docs deployment owns them.
7. Retain a tagged deployable revision and documented emergency rollback.

Cleanup should be a separate pull request from the routing cutover.

## Phase 8: Verification

### Repository checks

Run in the docs repository:

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run lint:prettier:check
npm run lint:vale
```

Run the relevant test, typecheck, lint, and build commands for `saas-dashboard-ui` after its dependencies are installed.

### Preview checks

Validate through the shared microfrontend preview domain:

By default, docs previews rewrite SDK paths to production `sdk.supertokens.com` artifacts. An SDK artifact preview is
validated directly under `https://sdk.supertokens.com/_preview/<run-id>/**`. If a combined docs-and-SDK preview is
needed, create a temporary docs preview deployment whose SDK rewrite includes that run ID; never change the production
manifest or aliases for preview validation. Preview SDK pages use `/_preview/<run-id>/manifest.json` for version
selection.

1. Load `/docs` and representative authored pages.
2. Confirm the owning application using Vercel microfrontend diagnostics.
3. Fetch every script, stylesheet, font, image, and client-navigation response referenced by those pages.
4. Exercise search, Ask AI, MCP, Markdown negotiation, and direct `.md` URLs.
5. Test each SDK's unversioned entrypoint.
6. Test at least one historical version for every SDK.
7. Test deep SDK pages and their relative assets.
8. Test Android framed pages.
9. Test `/docs/sdk-manifest.json` and SDK version selection.
10. Test known legacy redirects and unknown paths.
11. Confirm preview responses have `noindex`.
12. Confirm CSP and other security headers on authored and SDK responses.
13. Confirm authenticated or restricted SDK artifacts survive the external rewrite with the required credentials.

Automate this smoke suite before production cutover. Vercel routing integration tests must run against the shared,
deployed preview, not only local configuration or an isolated child deployment.

External rewrite credential forwarding is unresolved and must not be approximated in docs code. Treat failed access to
any restricted SDK artifact through the shared preview as a cutover blocker until the deployment owners define and
verify the edge credential contract.

## Rollout Order

1. Agree on the SDK origin path and manifest contract.
2. Deploy `sdk.supertokens.com` and migrate the existing SDK archive.
3. Start a temporary SDK documentation release freeze before taking the final archive delta. Deploy no additional
   authored documentation during this freeze.
4. Take and migrate the final archive delta.
5. Add SDK rewrites and root redirects to the docs project.
6. Fix docs asset ownership and runtime endpoint namespaces.
7. Add docs security, indexing, and cache policies.
8. Deploy and validate the docs child directly.
9. Update and test the authoritative dashboard microfrontends configuration and its synchronization check.
10. Deploy to a shared preview environment with `docs-microfrontend` enabled.
11. Run the automated compatibility smoke suite, including Vercel routing integration tests against that deployed
    preview.
12. Deploy the dashboard production configuration with `docs-microfrontend` initially disabled.
13. Enable production `/docs/:path*` routing with `docs-microfrontend`.
14. Monitor routing, 404s, origin errors, CSP reports, cache behavior, and SDK traffic.
15. Switch SDK release workflows to the new publisher and verify publication end to end.
16. End the SDK documentation release freeze only after publisher verification succeeds; authored docs deployments may
    then resume.
17. Remove backend website docs handling in a later cleanup release.

## Rollback

- Disable the `docs-microfrontend` routing flag or roll back the dashboard deployment.
- Restore the backend website as the default route handler during the migration window.
- Roll back the docs child independently if only authored documentation is affected.
- Roll back the SDK manifest/current alias independently if only generated references are affected.
- Do not delete backend website artifacts until the rollback window closes.

## Acceptance Criteria

- Authored docs are served by the docs Vercel application, not `supertokens-backend-website`.
- All Astro and public assets are owned by the docs microfrontend and return successfully.
- Ask AI, MCP, LLM indexes, Markdown, API specs, and discovery URLs match their published documentation.
- Existing `/docs/<sdk>/**` URLs remain unchanged and are served from `sdk.supertokens.com` through external rewrites.
- The dashboard microfrontends configuration is authoritative, and its synchronization check passes.
- `docs-microfrontend` is enabled in shared previews and remains independently controllable in production.
- Unversioned SDK deep links and mutable `N.N.X` compatibility paths resolve to the intended exact releases or
  immutable migrated snapshots.
- SDK version selection uses the new manifest compatibility endpoint rather than the backend website API.
- Every retained SDK version and representative deep link works.
- Legacy redirects preserve supported inbound URLs.
- Preview and staging docs are not indexed.
- Authored and SDK responses have intentional security and cache headers.
- Restricted SDK artifacts work through the shared preview rewrite without exposing credentials to the browser.
- SDK releases do not rebuild or redeploy the authored docs application.
- Production routing can be rolled back without moving or regenerating SDK artifacts.

## Ownership

| Area                                                 | Owner                             |
| ---------------------------------------------------- | --------------------------------- |
| Blume assets, endpoints, redirects, and docs headers | Docs team                         |
| Microfrontend group configuration and rollout flag   | Dashboard team                    |
| SDK external rewrites and compatibility smoke tests  | Docs team                         |
| Legacy behavior inventory and post-cutover removal   | Backend website maintainers       |
| Production routing enablement and emergency rollback | Docs and dashboard release owners |
