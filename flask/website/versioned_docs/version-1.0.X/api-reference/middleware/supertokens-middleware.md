---
id: version-1.0.X-supertokens-middleware
title: supertokens_middleware
hide_title: true
original_id: supertokens-middleware
---

# `@supertokens_middleware`
- This middleware function will verify sessions for all APIs that it is used in, except for:
    - OPTIONS and TRACE methods
    - refresh session API.
- For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
- It will use the [`getSession`](../get-session) function to verify sessions.
- If using `@supertokens_middleware`, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.
- If using `@supertokens_middleware(False)`, then it will not provide anti CSRF protection for that API.
- If using `@supertokens_middleware(True)`, then it will provide anti CSRF protection for that API.