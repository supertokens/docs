---
id: supertokens-middleware
title: supertokens.Middleware
hide_title: true
---

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
# `SuperTokens.Middleware(handler http.HandlerFunc, doAntiCsrfCheck ...bool) http.HandlerFunc`

### Parameters
- `handler`
    - **description:** Your API handler function
- `doAntiCsrfCheck`
    - **description:** If `doAntiCsrfCheck` is not provided, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.

### Returns
- `http.HandlerFunc`
    - This function will verify sessions for all APIs that it is used in, except for:
        - OPTIONS and TRACE methods
        - refresh session API.
    - For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
    - It will use the [`getSession`](../get-session) function to verify sessions.
    - If `doAntiCsrfCheck` is not given, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.
<!--Gin-->
# `SuperTokens.Middleware(doAntiCsrfCheck ...bool) func(*gin.Context)`

### Parameters
- `doAntiCsrfCheck`
    - **description:** If `doAntiCsrfCheck` is not provided, CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically.

### Returns
- `func(*gin.Context)`
    - This function will verify sessions for all APIs that it is used in, except for:
        - OPTIONS and TRACE methods
        - refresh session API.
    - For refresh session API, it will call the [`refreshSession`](../refresh-session) function.
    - It will use the [`getSession`](../get-session) function to verify sessions.
    - If `doAntiCsrfCheck` is not given, then it will automatically provide anti-CSRF protection for all `POST`, `PATCH`, `DELETE`, `PUT` APIs.
<!--END_DOCUSAURUS_CODE_TABS-->