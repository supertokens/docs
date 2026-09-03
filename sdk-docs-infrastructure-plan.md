# SDK Documentation Infrastructure Plan

## Goal

Publish generated SDK references independently of the authored documentation and serve them from
`https://sdk.supertokens.com` without committing generated SDK output to the docs repository.

The existing public URLs under `https://supertokens.com/docs/<sdk>/**` remain supported by external rewrites in the
docs application. This workstream owns storage, delivery, artifact transformation, publication, and migration of the
existing SDK archive.

## Scope

- Provision S3 and CloudFront for `sdk.supertokens.com`.
- Define the SDK artifact layout and publication contract.
- Create a reusable SDK documentation publisher.
- Move required HTML transformations from request time to publication time.
- Migrate all existing SDKs and historical versions.
- Update SDK release workflows to publish directly to the artifact store.
- Provide monitoring, rollback, and disaster-recovery procedures.

This workstream does not configure `supertokens.com/docs/**` routing. That is covered by
`docs-microfrontend-migration-plan.md`.

This document records the required implementation and rollout sequence; it does not assert that production deployment
is complete.

## Public Contract

The artifact origin exposes paths without the `/docs` prefix:

```text
https://sdk.supertokens.com/nodejs/24.0.X/modules.html
https://sdk.supertokens.com/nodejs/latest/modules.html
https://sdk.supertokens.com/python/0.24.X/index.html
https://sdk.supertokens.com/python/latest/index.html
https://sdk.supertokens.com/android/0.5.X/index.html
https://sdk.supertokens.com/android/latest/index.html
```

The docs application maps existing public paths to this origin:

```text
https://supertokens.com/docs/nodejs/24.0.X/modules.html
  -> https://sdk.supertokens.com/nodejs/24.0.X/modules.html
```

The rewrite preserves the browser-visible `supertokens.com/docs/**` URL.

## Storage Layout

Use immutable exact-release directories behind mutable compatibility aliases. Existing `N.N.X` URLs are patch-family
aliases and may be updated by later patch releases, so they must not be treated as immutable releases:

```text
nodejs/
  _releases/
    24.0.3/
    24.0.2/
  _legacy/
    initial-migration/
      23.0.X/
  latest/ -> edge alias to _releases/24.0.3/
python/
  latest/ -> edge alias to its latest release
auth-react/
  latest/ -> edge alias to its latest release
web-js/
  latest/ -> edge alias to its latest release
website/
  latest/ -> edge alias to its latest release
react-native/
  latest/ -> edge alias to its latest release
android/
  latest/ -> edge alias to its latest release
ios/
  latest/ -> edge alias to its latest release
flutter/
  latest/ -> edge alias to its latest release
manifest.json
```

CloudFront maps public paths to immutable release or legacy snapshot objects using a CloudFront KeyValueStore or
equivalent edge mapping:

```text
/nodejs/modules.html          -> /nodejs/_releases/24.0.3/modules.html
/nodejs/latest/modules.html   -> /nodejs/_releases/24.0.3/modules.html
/nodejs/24.0.X/modules.html   -> /nodejs/_releases/24.0.3/modules.html
/nodejs/23.0.X/modules.html   -> /nodejs/_legacy/initial-migration/23.0.X/modules.html
```

Every SDK exposes a stable `/latest/**` virtual folder that resolves to its current exact release. Authored docs should
link to `/docs/<sdk>/latest/**` when they need the latest SDK reference without knowing its version. Unversioned deep
links remain aliases to the same release for backward compatibility. This also preserves existing `N.N.X` URLs without
copying complete SDK trees into mutable S3 prefixes.

The manifest describes routing metadata needed by the docs application or edge compatibility layer:

```json
{
  "schemaVersion": 1,
  "sdks": {
    "nodejs": {
      "latestRelease": "24.0.3",
      "entrypoint": "modules.html",
      "aliases": {
        "24.0.X": {
          "targetType": "release",
          "target": "24.0.3"
        },
        "23.0.X": {
          "targetType": "legacySnapshot",
          "target": "initial-migration/23.0.X"
        }
      }
    },
    "python": {
      "latestRelease": "0.24.1",
      "entrypoint": "index.html",
      "aliases": {
        "0.24.X": {
          "targetType": "release",
          "target": "0.24.1"
        }
      }
    }
  }
}
```

Exact-release and legacy-snapshot prefixes are immutable. Publishing a version must never delete or silently overwrite
a historical release. Alias mappings and the manifest may change only after a complete upload succeeds.

## Phase 1: Provision Infrastructure

1. Create a private S3 bucket with public access blocked.
2. Enable bucket versioning.
3. Create a CloudFront distribution using Origin Access Control.
4. Issue and attach an ACM certificate for `sdk.supertokens.com`.
5. Create the DNS record for `sdk.supertokens.com`.
6. Configure compression for supported text formats.
7. Configure access logging and CloudFront metrics.
8. Configure response headers, including `X-Content-Type-Options: nosniff` and a suitable referrer policy.
9. Define an explicit 404 response rather than serving an SDK index for arbitrary missing objects.
10. Apply an SDK-compatible CSP and deny framing by default.
11. Apply `SAMEORIGIN` framing only to Android paths that require frames.
12. Serve a `robots.txt` that prevents direct `sdk.supertokens.com` pages from competing with canonical
    `supertokens.com/docs/**` URLs.

Use infrastructure as code in the organization's existing infrastructure repository. Do not provision this manually
without capturing the final state in code.

## Phase 2: Define Cache Behavior

Use separate policies for immutable versions and mutable aliases:

| Content                                    | Recommended policy                        |
| ------------------------------------------ | ----------------------------------------- |
| Exact-release HTML                         | Long CDN TTL; browser TTL may be shorter  |
| Exact-release CSS, JS, fonts, and images   | Long TTL with `immutable`                 |
| `latest`, unversioned, and `N.N.X` aliases | Resolved at the edge to immutable objects |
| `manifest.json`                            | Short TTL or revalidation                 |
| Error responses                            | Short TTL                                 |

The publisher must set correct S3 metadata, particularly `Content-Type`, `Cache-Control`, and content encoding. Do not
rely on S3 filename inference alone.

## Phase 3: Build the Publisher

Create one reusable publishing command or workflow rather than implementing different upload logic in every SDK
repository.

Required inputs:

- SDK name.
- SDK release version.
- Generated documentation directory.
- Expected entrypoint.
- Whether the release should update its `N.N.X` compatibility alias.
- Whether the release is allowed to become the `latest` release.
- Production or preview destination.

Required behavior:

1. Validate the SDK name against an allowlist.
2. Validate the version format.
3. Verify that the expected entrypoint and referenced local assets exist.
4. Apply static HTML transformations.
5. Upload to a temporary or release-specific prefix.
6. Verify uploaded files and metadata.
7. Publish the complete upload to the immutable exact-release prefix.
8. Update the patch-family alias only when the release is the newest patch in that family.
9. Update the `/latest/**` and legacy unversioned mappings only when a validated `promoteLatest` input is true.
10. Update the manifest after successful upload and alias validation.
11. Invalidate only mutable manifest or alias responses when required.
12. Produce a machine-readable publication report.

The publisher must support a dry run and must fail before changing any alias if validation fails. An older maintenance
release must never replace the `latest` or unversioned mappings unless `promoteLatest` is explicitly authorized.

S3 cannot atomically replace a directory and manifest. Promotion therefore updates small edge alias keys after immutable
objects are verified. Update the patch-family alias first, then the `latest` and unversioned aliases when authorized,
and publish the matching manifest last. Record the previous values so a partial promotion can be rolled back
immediately.

## Phase 4: Move HTML Transformations

The backend website currently modifies SDK HTML at request time in
`supertokens-backend-website/app/src/injectReactIntoSDKDocs.ts`. Move required behavior into the publication process so
that every uploaded HTML file is complete and directly servable.

Decide explicitly whether to retain each behavior:

- SDK version selector mount point and assets.
- Shared header and footer.
- Links back to authored documentation.
- Deprecated SDK banners.
- Canonical and hreflang tags pointing to `https://supertokens.com/docs/<sdk>/**`.
- Analytics scripts.
- SDK-specific styling.
- Android iframe support.

Avoid retaining the current runtime dependency on `/static/bundle.js`. If shared UI remains necessary, publish it at a
stable, explicitly owned URL and include a versioned asset reference in generated HTML.

## Phase 5: Compatibility At The Edge

The current backend website provides filesystem conveniences and error fallbacks in addition to serving static files.
The migration should preserve valid published URLs, but it does not need to reproduce every legacy behavior.

| Behavior                                     | Decision                               | Reason                                                                                                   |
| -------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/latest/**` alias mapping                   | Keep                                   | Authored docs can reference the latest SDK without knowing its version.                                  |
| `N.N.X/**` alias mapping                     | Keep                                   | Existing public versioned URLs use this format.                                                          |
| Unversioned SDK paths                        | Keep for compatibility                 | Existing deep links such as `/docs/nodejs/modules.html` must continue working.                           |
| SDK root entrypoint redirects                | Keep                                   | `/docs/nodejs`, `/docs/python`, and similar routes are established public entrypoints.                   |
| Extensionless `.html` resolution             | Keep if validation confirms it is used | It is inexpensive to implement deterministically, but is not needed by most generated links.             |
| Generic directory-to-`index.html` resolution | Drop by default                        | Generated SDK links generally reference explicit HTML files; handle only known SDK entrypoints.          |
| Missing-page fallback redirects              | Drop                                   | Redirecting an unknown page to an SDK landing page hides broken links and produces misleading soft 404s. |
| Case-insensitive filesystem lookup           | Drop                                   | S3 keys are case-sensitive; known historical variants can use explicit redirects.                        |
| Android frame policy                         | Keep                                   | Historical Android Javadocs use frames and break under a default deny policy.                            |
| SDK version-selector data                    | Keep if retaining the selector         | Replace the dynamic `/sdk/versions` endpoint with the static manifest.                                   |

### Resolve aliases

Use a CloudFront viewer-request function and KeyValueStore to resolve aliases to immutable object paths:

```text
/nodejs/latest/modules.html
  -> /nodejs/_releases/24.0.3/modules.html

/nodejs/24.0.X/modules.html
  -> /nodejs/_releases/24.0.3/modules.html

/nodejs/modules.html
  -> /nodejs/_releases/24.0.3/modules.html
```

The function rewrites only the request URI. It must not fetch content, inspect S3, or transform HTML. Alias values come
from KeyValueStore and may target either an exact release or an immutable migrated snapshot.

### Redirect known SDK roots

Redirect SDK roots to their `/latest` entrypoints:

```text
/nodejs       -> /nodejs/latest/modules.html
/python       -> /python/latest/index.html
/auth-react   -> /auth-react/latest/modules.html
/web-js       -> /web-js/latest/modules.html
/website      -> /website/latest/modules.html
/react-native -> /react-native/latest/modules.html
/ios          -> /ios/latest/index.html
/android      -> /android/latest/index.html
/flutter      -> /flutter/latest/index.html
```

The docs application owns the equivalent public redirects from `/docs/<sdk>` to `/docs/<sdk>/latest/<entrypoint>`.

### Handle extensionless URLs narrowly

If traffic or inbound-link validation confirms that extensionless SDK URLs are used, the viewer-request function may
append `.html` when the final path segment has no extension:

```text
/nodejs/latest/modules -> /nodejs/latest/modules.html
```

Do not append `.html` to paths ending in `/`, and do not modify a path that already has an extension. The function must
not probe S3 for existence; a missing rewritten object returns a normal 404.

Do not implement generic directory-to-`index.html` behavior unless a generator is proven to produce and link such
routes. Known SDK roots and entrypoints are handled explicitly.

### Return real 404 responses

Do not migrate the backend website behavior that redirects missing JS or Python pages to an SDK landing page. Unknown
objects should return `404`, allowing broken links to be detected through tests and logs. Only known SDK roots and valid
aliases should redirect.

### Use case-sensitive paths

Do not reproduce general case-insensitive filesystem lookup. Validate generated internal links before publication and
add explicit redirects only for historical case variants shown to receive traffic. Monitor CloudFront 404 logs after
cutover to identify additional compatibility redirects.

### Preserve Android framing

Historical Android Javadocs use frames. Apply these headers to Android paths that require them:

```http
Content-Security-Policy: frame-ancestors 'self'
X-Frame-Options: SAMEORIGIN
```

Other SDK documentation should deny framing by default:

```http
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY
```

Implement the distinction with CloudFront cache behaviors or a response function rather than modifying HTML at request
time.

### Replace the versions API

Retain the SDK version selector and replace `/sdk/versions` with `manifest.json`. The manifest must include:

- The latest release and entrypoint for every SDK.
- Every retained historical `N.N.X` alias.
- Whether each alias targets an exact release or a migrated snapshot.
- Display ordering and deprecated status if required by the selector.

SDK UI should fetch `/docs/sdk-manifest.json` when served through `supertokens.com` and `/manifest.json` when accessed
directly through `sdk.supertokens.com`. The docs application rewrites the compatibility URL to
`https://sdk.supertokens.com/manifest.json`. Add a narrow CORS policy to the direct manifest response only if a separate
origin needs to fetch it.

The intended edge implementation is therefore limited to alias resolution, optional extensionless normalization,
Android response headers, and serving the static manifest. It does not require Lambda@Edge, dynamic S3 existence checks,
generic directory indexes, case-insensitive lookup, missing-page redirects, or runtime HTML transformation.

## Phase 6: Authentication And Deployment Access

Use GitHub Actions OIDC for uploads. Do not store long-lived AWS access keys in repository secrets.

The publishing role should only be able to:

- Write to approved SDK or preview prefixes.
- Read objects needed for verification.
- Update the manifest through the publishing process.
- Create narrowly scoped CloudFront invalidations.

Separate production and preview roles. Protect production publication through the existing release approval process.

Preview uploads use an isolated `/_preview/<run-id>/<sdk>/_releases/<version>/**` prefix with short cache TTLs, an S3
lifecycle policy, and `X-Robots-Tag: noindex`. Preview publication must never update production alias keys or the
production manifest. Publish a preview-specific manifest under `/_preview/<run-id>/manifest.json`, and configure
transformed preview SDK pages to use that URL for version selection. The publication report supplies direct preview
URLs for validation and cleanup.

## Phase 7: Migrate Existing References

The current archive is approximately 535 MB across 17,049 files in
`supertokens-backend-website/app/docs/sdk/docs`.

Migrate these namespaces:

- `android`
- `auth-react`
- `flutter`
- `ios`
- `nodejs`
- `python`
- `react-native`
- `web-js`
- `website`

Migration steps:

1. Produce an inventory with file counts, checksums, versions, and entrypoints.
2. Recover exact patch provenance only where release metadata proves it reliably.
3. Store unresolved unversioned and `N.N.X` trees under an immutable `_legacy/<snapshot-id>/**` prefix without claiming
   an exact semver release.
4. Point historical aliases at either a proven exact release or the corresponding immutable legacy snapshot, and point
   each SDK's `latest` and unversioned aliases at the migrated current snapshot.
5. Apply the final publication-time HTML transformations.
6. Start a temporary SDK documentation release freeze before capturing the final archive delta. Deploy no additional
   authored documentation during the freeze.
7. Capture the final archive delta and upload each namespace without changing the backend website.
8. Compare source and destination checksums for unchanged files.
9. Crawl representative HTML pages and all referenced local assets.
10. Publish `manifest.json` with every historical alias only after all required namespaces pass validation.
11. Keep the freeze in effect through end-to-end verification of the new publisher. Resume SDK documentation releases
    and authored docs deployments only after that verification succeeds.

## Phase 8: Integrate SDK Release Workflows

Inventory and update every SDK release workflow that currently publishes through the backend website. This includes
the generic `release-sdk-documentation-changes.yml` flow and the dedicated Node.js and Python documentation release
flows.

The new workflow should:

1. Generate SDK references.
2. Invoke the shared publisher.
3. Verify the versioned URL on `sdk.supertokens.com`.
4. Verify the patch-family, `latest`, and unversioned mappings when applicable.
5. Report the published paths and manifest revision.

Publishing SDK documentation must not rebuild or redeploy the authored docs application. The SDK release workflow must
calculate or receive `promoteLatest` using the same release-channel decision currently represented by `isLatest`.

## Ownership

| Area                                                  | Owner                                    |
| ----------------------------------------------------- | ---------------------------------------- |
| S3, CloudFront, ACM, DNS, KeyValueStore, IAM          | Infrastructure team                      |
| Publisher and manifest schema                         | Infrastructure team with SDK maintainers |
| SDK generator invocation and release-channel decision | Individual SDK repositories              |
| Publication approval and rollback                     | Release owner for the affected SDK       |
| Public `/docs/<sdk>/**` rewrites                      | Docs team                                |

The IaC and shared publisher repositories must be selected before implementation and recorded in the delivery ticket.

## Rollout

1. Deploy the infrastructure without changing public routing.
2. Upload the existing archive.
3. Validate direct `sdk.supertokens.com` URLs.
4. Provide the origin and manifest contract to the docs migration workstream.
5. Allow the docs application to add preview rewrites.
6. Start the temporary SDK documentation release freeze before capturing the final archive delta; deploy no additional
   authored documentation during the freeze.
7. Capture and migrate the final archive delta.
8. Validate public compatibility through the shared deployed preview domain.
9. Enable production rewrites.
10. Switch SDK release workflows to the new publisher and verify publication end to end.
11. End the freeze only after publisher verification succeeds.
12. Keep the backend website artifacts available during the agreed rollback window.

## Rollback

- Restore the previous `latest`, unversioned, and patch-family alias values and manifest revision.
- Invalidate only the affected mutable paths.
- Disable docs-application SDK rewrites to return traffic to the backend website during the migration window.
- Preserve historical version prefixes so rollback never requires regenerating old SDK releases.

## Acceptance Criteria

- `sdk.supertokens.com` serves every existing SDK namespace and retained version over HTTPS.
- S3 is not publicly readable except through CloudFront.
- Exact releases are immutable; `N.N.X` aliases remain compatible with patch updates.
- Existing unresolved artifacts are preserved under immutable legacy snapshot IDs.
- Every SDK exposes `/latest/**` as a stable alias to its latest exact release or migrated current snapshot.
- Authored documentation can link to `/docs/<sdk>/latest/**` without knowing a concrete version.
- Unversioned and `N.N.X` paths resolve through recorded edge mappings to exact releases or legacy snapshots.
- Alias and manifest promotion has a defined order, failure recovery, and rollback.
- Maintenance releases cannot become `latest` without explicit authorization.
- HTML, CSS, JavaScript, images, fonts, and search assets have correct content types.
- Canonical URLs point to the intended `supertokens.com/docs/**` locations.
- `/docs/sdk-manifest.json` can replace the legacy `/sdk/versions` version-selector API.
- Android framed pages work with the intended frame policy.
- CloudFront supplies the defined CSP, default framing, Android exception, caching, and direct-host indexing behavior.
- One SDK can publish without rebuilding the docs application or another SDK.
- Production publishing uses OIDC and least-privilege IAM.
- Monitoring, alerting, publication audit logs, and rollback instructions exist.
