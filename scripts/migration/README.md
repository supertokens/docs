# Documentation route migration

`legacy-redirects.ts` is generated from the backend website's `RouteRedirects` table by running
`npm run routes:legacy`. The generator resolves redirect chains, retains entries that finish on a current Blume route,
and removes the public `/docs` prefix because Blume adds it at build time. `legacyRedirectDiagnostics` records retained
targets and ignored targets with their reasons and 1-based positions in the backend source. Output is formatted with
the repository's pinned Prettier and must remain idempotent.

The backend website historically evaluates duplicate sources in array order. The migration intentionally keeps the
first match and records ignored duplicate sources in the generated file. Do not edit the generated file manually.

The docs repository's `microfrontends.jsonc` is a standalone copy of the authoritative contract in
`backend-api/apps/saas-dashboard-ui/microfrontends.jsonc`; CI must not read another repository. The expected semantic
fields are `options.disableOverrides: true`, docs `packageName: "@supertokens/docs"`, `assetPrefix: "docs-assets"`, the
flagged `/docs/:path*` route, and the permanent unflagged `/docs-assets/:path*` route. `routing.test.ts` locks this copy.

Run remote smoke tests against the shared microfrontend preview with:

```bash
MFE_PREVIEW_URL=https://<shared-preview-host> npm run test:preview-smoke
```

Run the deploy workflow manually with its `preview_url` input to test one exact shared dashboard deployment. Before
cutover, the suite must pass through that shared preview, including SDK rewrites and dashboard-owned MCP discovery.
External rewrite credential forwarding remains a deployment blocker and is intentionally not implemented in the docs
application.
