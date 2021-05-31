---
id: version-2.0.X-supertokens-middleware
title: supertokens.middleware
hide_title: true
original_id: supertokens-middleware
---

# `supertokens.middleware(enableCsrfProtection?)`
### Parameters
- `enableCsrfProtection`
    - **type:** `boolean`
    - **description:** If `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `false`, this value will be considered as `false` even if value `true` is passed

### Returns
- `(req, res, next) => void`
    - This middleware function will verify sessions for all APIs that it is used in, except for:
        - OPTIONS and TRACE methods
        - refresh session API.
    - For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
    - It will use the [`getSession`](../get-session) function to verify sessions.
    - If `enableCsrfProtection` is `undefined`, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.