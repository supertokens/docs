---
id: get-session
title: GetSession
hide_title: true
---

<!--DOCUSAURUS_CODE_TABS-->
<!--Mux or net/http-->
# `GetSession(response http.ResponseWriter, request *http.Request, doAntiCsrfCheck bool) (Session, error)`
### Parameters
- `response`
    - **description:** Response writer object from your API handler
- `request`
    - **description:** Request writer object from your API handler
- `doAntiCSRFCheck`
    - **description:** If `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `false`, this value will be considered as `false` even if value `true` is passed

<!--Gin-->

# `GetSession(c *gin.Context, doAntiCsrfCheck bool) (Session, error)`
### Parameters
- `c`
    - **description:** Context object from your API handler
- `doAntiCSRFCheck`
    - **description:** If `enable_anti_csrf` (in the SuperTokens `config.yaml`) is set to `false`, this value will be considered as `false` even if value `true` is passed

<!--END_DOCUSAURUS_CODE_TABS-->

### Returns
- `Session` on successful verification of a session. To know more about the `Session` object, click [here](./session-object/overview)
- [GeneralError](./error-handling/general-error)
- [UnauthorizedError](./error-handling/unauthorised)
    - This is thrown if a session does not exist, or has been revoked (if blacklisting is switched on).
    - When this is thrown, all the relevant auth cookies are cleared by this function call, so you can redirect the user to a login page.
- [TryRefreshTokenError](./error-handling/try-refresh-token)
    - This will be thrown if JWT verification fails. This happens, for example, if the token has expired or the JWT signing key has changed.
    - This will be thrown if CSRF protection is on and anti-csrf token is missing or invalid.
    - When this is thrown, none of the auth cookies are removed - you should return a session expired status code which will instruct your frontend to call the refresh token API endpoint.

### Additional information
- This function will mostly never require an I/O operation since we are using JWT access tokens (assuming that blacklisting is disabled).
- If `doAntiCsrfCheck` is true and `enable_anti_csrf` (in the SuperTokens config.yaml) is set to true, this function also provides CSRF protection. **We strongly recommend that you set it to true for any non-GET API that requires user auth (except for the refresh session API)**.
- May change the access token - but this is taken care of by this function and our frontend SDKs. You do need to worry about handling this.