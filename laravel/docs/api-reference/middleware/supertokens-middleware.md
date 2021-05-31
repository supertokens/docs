---
id: supertokens-middleware
title: supertokens.middleware
hide_title: true
---

# `"supertokens.middleware"`
- This middleware will verify sessions for all APIs that it is used in, except for:
    - OPTIONS and TRACE methods
    - refresh session API.
- For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
- It will use the [`getSession`](../get-session) function to verify sessions.
- If using `"supertokens.middleware"`, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.
- If using `"supertokens.middleware:false"`, then it will not provide anti CSRF protection for that API.
- If using `"supertokens.middleware:true"`, then it will provide anti CSRF protection for that API.