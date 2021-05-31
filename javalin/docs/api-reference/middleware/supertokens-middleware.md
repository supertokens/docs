---
id: supertokens-middleware
title: supertokens.middleware
hide_title: true
---

# `SuperTokens.middleware()`
### Parameters
- none

# `SuperTokens.middleware(boolean enableCsrfProtection)`
### Parameters
- `enableCsrfProtection`
    - **description:** If `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `false`, this value will be considered as `false` even if value `true` is passed

### Returns
- `io.javalin.http.Handler`
    - This middleware function will verify sessions for all APIs that it is used in, except for:
        - OPTIONS and TRACE methods
        - refresh session API.
    - For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
    - It will use the [`getSession`](../get-session) function to verify sessions.
    - If `enableCsrfProtection` is not given, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.